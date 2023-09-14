const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { guildId, token } = require('../config.json'); 
const Authed = require('../models/Authed.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull users from authed model and perform action'),
    async execute(interaction) {
        await interaction.deferReply();
        const hasAdminPermissions = interaction.member.permissions.has('Administrator');

        if (!hasAdminPermissions) {
            return interaction.editReply({content: 'I refuse (kindly).', ephemeral: true});
        }

        try {
            interaction.editReply({ content: 'Pulling users, if this doesnt work do /refresh' });
            const users = await Authed.find();
            const successfullyPulledUsers = [];
            for (const user of users) {
                try {
                    await axios.put(`https://discord.com/api/guilds/${guildId}/members/${user.userId}`, {
                        access_token: user.accessToken
                    }, {
                        headers: {
                            'Authorization': `Bot ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    successfullyPulledUsers.push(user.userId);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                } catch (error) {
                    console.error('Error pulling user:', user.userId, error);
                }
            }
            fs.writeFileSync('pulled.txt', successfullyPulledUsers.join(', '));
            interaction.editReply({ 
                content: `Action completed. Successfully pulled ${successfullyPulledUsers.length} users out of ${users.length} total users.`,
                files: ['pulled.txt'], 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error:', error);
            interaction.editReply({ content: 'An error occurred.' });
        }
    }
};
