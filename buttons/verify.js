const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");

const verifyconfirmButtonClicked = new ButtonBuilder()
  .setCustomId('verifyconfirm')
  .setLabel('I am sure')
  .setStyle('Danger')
  .setDisabled(true);

const verifyconfirmButton = new ButtonBuilder()
  .setCustomId('verifyconfirm')
  .setLabel('I am sure')
  .setStyle('Danger');
  
const clickedRow = new ActionRowBuilder()
  .addComponents(verifyconfirmButtonClicked);

const unClickedRow = new ActionRowBuilder()
  .addComponents(verifyconfirmButton);

module.exports = {
  execute: async (interaction, client) => {
    await interaction.reply({ 
      ephemeral: true,
      components: [clickedRow],
      content: `Are you sure you do not want to authorize the bot? We will not be able to pull you back into the server if it gets termed.`
    })
    await new Promise(r => setTimeout(r, 1500))
    await interaction.editReply({
      components: [unClickedRow]
  })
    }
}