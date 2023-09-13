const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { clientId, clientSecret } = require('../config.json');
const Authed = require('../models/Authed.js');

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
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('You are not an administrator.');
        }
        try {
            const users = await Authed.find();
            let refreshedCount = 0;
            interaction.reply({ content: `Starting to refresh users` })
            for (const user of users) {
                const tokens = await refreshAccessToken(user.refreshToken);
                
                if (tokens) {
                    user.accessToken = tokens.accessToken;
                    user.refreshToken = tokens.refreshToken;
                    await user.save();
                    refreshedCount++;
                }
            }

            interaction.editReply({ content: `Refreshed access tokens for ${refreshedCount} users.` });

        } catch (error) {
            console.error('Error:', error);
            interaction.editReply({ content: 'An error occurred while refreshing tokens.' });
        }
    }
};
