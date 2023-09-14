const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { clientId, clientSecret } = require('../config.json');
const Authed = require('../models/Authed.js');
const fs = require('fs');

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token
        };
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Refresh access tokens for users in the authed model'),
    async execute(interaction) {
        await interaction.deferReply();
        const hasAdminPermissions = interaction.member.permissions.has('Administrator');

        if (!hasAdminPermissions) {
            return interaction.editReply({content: 'I refuse (kindly).', ephemeral: true});
        }
        try {
            const users = await Authed.find();
            let refreshedUsers = [];
            for (const user of users) {
                const tokens = await refreshAccessToken(user.refreshToken);
                if (tokens) {
                    user.accessToken = tokens.accessToken;
                    user.refreshToken = tokens.refreshToken;
                    await user.save();
                    refreshedUsers.push(user.userId);
                }
            }
            fs.writeFileSync('refreshed.txt', refreshedUsers.join(', '));
            interaction.editReply({ 
                content: `Refreshed access tokens for ${refreshedUsers.length} users out of ${users.length} total users.`,
                files: ['refreshed.txt'], 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error:', error);
            interaction.editReply({ content: 'An error occurred while refreshing tokens.' });
        }
    }
};
