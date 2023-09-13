const { memberrole } = require('../config.json');
module.exports = {
    execute: async (interaction, client) => {
      interaction.deferUpdate();
      try{await interaction.member.roles.add(memberrole)}catch(err){console.log(err)}
    }
  }