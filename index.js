require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const GUILD_ID = process.env.GUILD_ID;
const ALLOWED_ROLE_ID = process.env.ALLOWED_ROLE_ID;

client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.get('/checkwhitelist/:discordId', async (req, res) => {
  const discordId = req.params.discordId;

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(discordId);

    if (!member) {
      return res.json({ allowed: false, reason: 'User not found in guild' });
    }

    const hasRole = member.roles.cache.has(ALLOWED_ROLE_ID);
    return res.json({ allowed: hasRole });
  } catch (err) {
    return res.json({ allowed: false, reason: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});