# Auth Bot by Lenny.Wiki

Auth Bot is a Discord bot designed to manage user authentication and data syncing. It comes with commands to pull, refresh tokens, and setup verification for users.

## Features

- **Pull Command**: Retrieve user details and perform operations based on user's authentication status.
- **Refresh Command**: Refresh access tokens for users in the authed model.
- **Setup Command**: Setup verification for the server, allowing users to verify their identity.
- **API.js**: An API utility that connects and interfaces with Discord's API.
- **Config.json**: Configuration file to store essential bot parameters.

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Lenny119/Auth-Bot.git
    cd Auth-Bot
    ```

2. Install the required packages:
    ```bash
    npm install
    ```

3. Set up your `config.json`:
    ```json
    {
        "clientId": "",
        "guildId": "",
        "memberrole": "",
        "token": "",
        "mongotoken": "",
        "port": 2121,
        "clientSecret": "",
        "redirect_uri": "https://your.domain/verify"
    }
    ```

4. Run the bot:
    ```bash
    node index.js
    ```

## Commands

### /pull
- Description: Pull users from the authed model and perform a predefined action.
- Usage: `/pull`

### /refresh
- Description: Refresh access tokens for users in the authed model.
- Usage: `/refresh`

### /setup
- Description: Setup verification for the server.
- Usage: `/setup`

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## Credits

Developed by lenny.wiki, if you do not want to set this up you can pay me to setup and host for you contact me on discord @lennyzzz or @lenny119. or find me at [ratterscanner](https://discord.gg/B6kS49abSr)
