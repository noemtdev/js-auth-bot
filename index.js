const fs = require('node:fs');
const Discord = require('discord.js')
const path = require('node:path');
const mongoose = require('mongoose');
const { Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, mongotoken } = require("./config.json")
const startServer = require('./API.js');

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
    ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    console.log(`Loading ${filePath}...`)

    if (!command.data || !command.data.name) {
        console.log(`Error: Command file ${filePath} is missing the 'data' or 'name' property.`);
    } else {
        client.commands.set(command.data.name, command);
    }
}

client.buttonHandlers = new Collection();
const buttonHandlersPath = path.join(__dirname, 'buttons');
const buttonHandlerFiles = fs.readdirSync(buttonHandlersPath).filter(file => file.endsWith('.js'));

for (const file of buttonHandlerFiles) {
  const filePath = path.join(buttonHandlersPath, file);
  const buttonHandler = require(filePath);
  const buttonId = file.slice(0, -3);
  console.log(`Loading button handler ${filePath} with ID ${buttonId}...`);
  client.buttonHandlers.set(buttonId, buttonHandler);
}

mongoose.set('strictQuery', true);
mongoose.connect(mongotoken, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('connected to mongo');
}).catch((err) => {
  console.log(err);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
      const buttonHandler = client.buttonHandlers.get(interaction.customId);
      if (buttonHandler) {
        await buttonHandler.execute(interaction, client);
      }
    }
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  
    console.log(`${interaction.commandName} was run by ${interaction.user.tag} at ${time}`);
  
    await command.execute(interaction, client);
  });

client.once(Events.ClientReady, async () => {
    console.log('done booting up');
});

client.login(token);

startServer(client);

module.exports = client;