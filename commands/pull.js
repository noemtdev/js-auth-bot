const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { guildId, token } = require('../config.json'); 
const Authed = require('../models/Authed.js');

const getUsersFromAuthedModel = async () => {
    try {
        return await Authed.find();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull users from authed model and perform action'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('You are not an administrator.');
        }
        try {
            const users = await getUsersFromAuthedModel();
            const successfullyPulledUsers = [];
            interaction.reply({ content: `Starting to pull users, 1.5 seconds per user` })

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

            interaction.editReply({ content: `Action completed. Successfully pulled users: ${successfullyPulledUsers.join(', ')}` });

        } catch (error) {
            console.error('Error:', error);
            interaction.editReply({ content: 'An error occurred.' });
        }
    }
};
