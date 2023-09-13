const express = require('express');
const http = require('http');
const path = require('path');
const { port, clientId, clientSecret, redirect_uri, guildId, memberrole } = require("./config.json");
const Authed = require("./models/Authed");
const axios = require('axios');
const discord_token_url = 'https://discord.com/api/oauth2/token';
const discord_api_url = 'https://discord.com/api';
const app = express();

app.use(express.json());

app.get('/verify', async (req, res) => {
    try {
        const code = req.query.code;
        const tokenData = await getAccessToken(code);
        const userData = await getUserJson(tokenData.access_token);
  
        if (!tokenData.refresh_token) {
            throw new Error("Missing refreshToken in tokenData.");
        }
  
        await Authed.findOneAndUpdate(
          { userId: userData.id }, 
          {
              userId: userData.id,
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token
          }, 
          { upsert: true }
      );
  
        const client = require('./index.js');
        const guild = await client.guilds.fetch(guildId)
        const member = await guild.members.fetch(userData.id); 
        const role = await guild.roles.fetch(memberrole); 
        try {
        await member.roles.add(role);
        } catch(err) {
            console.error(`Failed to assign role. ${err}`);
        }
  
        res.sendFile(path.join(__dirname, 'response', 'success.html'));
    } catch (err) {
        console.error("oauth redirect error:", err);
        res.status(500).sendFile(path.join(__dirname, 'response', 'error.html'));
    }
  });
  
  async function getAccessToken(code) {
    const data = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        scope: 'identify guilds guilds.join'
    };
  
    const response = await axios.post(discord_token_url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
  
    return response.data;
  }
  
  async function getUserJson(access_token) {
    const url = `${discord_api_url}/users/@me`;
    const headers = {
        Authorization: `Bearer ${access_token}`
    };
    const response = await axios.get(url, { headers: headers });
    return response.data;
  }

const startServer = (client) => {
  http.createServer(app).listen(port, function () {
      console.log(`api started on port ${port}...`);
  });
};

module.exports = startServer;
