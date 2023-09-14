const { SlashCommandBuilder } = require('discord.js');
const Authed = require('../models/Authed.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getpullable')
        .setDescription('Get all members that are pullable from the Authed collection'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const users = await Authed.find();
            const hasAdminPermissions = interaction.member.permissions.has('Administrator');

            if (!hasAdminPermissions) {
                return interaction.editReply({ content: 'I refuse (kindly).', ephemeral: true });
            }

            if (!users.length) {
                return interaction.editReply('No pullable members found.');
            }

            const userIds = users.map(user => user.userId);
            const response = userIds.join(', ');
            
            const response2 = `Pullable members: ${userIds.length} out of ${users.length} total users.`;
            fs.writeFileSync('pullable.txt', response);

            interaction.editReply({ 
                content: response2, 
                files: ['pullable.txt'], 
                ephemeral: true 
            });
        } catch (error) {
            console.error('Error:', error);
            interaction.editReply({ content: 'An error occurred while fetching pullable members.', ephemeral: true });
        }
    }
};
