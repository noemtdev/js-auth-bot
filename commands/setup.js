const { SlashCommandBuilder, MessageEmbed, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { clientId, redirect_uri } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup verification for the server')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the verification message')
                .setRequired(true)),
    async execute(interaction) {
        interaction.reply({ ephermeral: true, content: `Setting up verification...`})
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('You are not an administrator.');
        }

        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
            .setTitle('Verification')
            .setDescription('Click the Verify button below to verify, which will pull you back into the server in case the server gets terminated \n\nIf you do not want to be pulled back into the server click the Manual Verify button below.');

        const verifyButton = new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Manual Verify')
            .setStyle(ButtonStyle.Primary);

        const redirectLinkButton = new ButtonBuilder()
            .setLabel('Verify')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds%20guilds.join`); 

        const row = new ActionRowBuilder()
        .addComponents(redirectLinkButton) 
        .addComponents(verifyButton);
        await channel.send({ embeds: [embed], components: [row] });

        interaction.editReply({ ephermeral: true, content: `Verification setup should be complete!`})
    }
};






