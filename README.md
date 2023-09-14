# Auth Bot by Lenny.Wiki

Auth Bot is a robust Discord bot designed to manage user authentication, synchronize user data, and offer several utility commands. Built with Discord.js v14, this bot ensures seamless user verification and data management.

## 🌟 Features

- **Pull Command**: Fetches authenticated users and can perform operations based on their authentication status.
- **Refresh Command**: Renews access tokens for users in the authed model.
- **Setup Command**: Initializes server verification, allowing users to confirm their identity.
- **API Utility**: `API.js` assists in connecting and interfacing with Discord's API.
- **Configuration**: `config.json` is provided to store essential bot parameters.

## 🚀 Setup and Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Lenny119/Auth-Bot.git
    cd Auth-Bot
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Configuration**:
    - Rename `config-sample.json` to `config.json`.
    - Populate the fields in `config.json`. Here's a quick overview:
    ```json
    {
        "clientId": "<Your Discord Bot Client ID>",
        "guildId": "<Your Server ID>",
        "memberrole": "<Member Role ID>",
        "token": "<Your Discord Bot Token>",
        "mongotoken": "<Your MongoDB Connection String>",
        "port": 2121,
        "clientSecret": "<Your Discord Bot Client Secret>",
        "redirect_uri": "https://your.domain/verify"
    }
    ```

4. **Deploy Commands**:
    ```bash
    node deploy-commands.js
    ```

5. **Run the Bot**:
    ```bash
    node index.js
    ```

## 🤖 Commands

### `/pull`
- **Description**: Fetches users from the database and pulls them (please do /refresh before pulling)
- **Usage**: `/pull`

### `/refresh`
- **Description**: Renews access tokens for users in the database
- **Usage**: `/refresh`

### `/setup`
- **Description**: Initializes server verification.
- **Usage**: `/setup`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/Lenny119/Auth-Bot/issues). If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## 🌐 Credits

Developed and maintained by lenny.wiki. If you're not inclined to set this up yourself, you can contact me for setup and hosting services. Reach out on Discord: `@lennyzzz` or `@lennydotie`, or join us at [ratterscanner](https://discord.gg/B6kS49abSr).
