# Highscores Bot

Highscores is a Discord.js (version 12.2.0) based Discord chat bot, written entirely in Javascript. This bot is heavily adapted from KingBot, and contains some code/utilities that are entirely unused owing to its hasty source in that project. Most functions are calls to the vidyascape.org open API.

## Initializing And Launching

```
npm install

node index.js
```

You must provide your Discord Bot Auth Token in config.json before Highscores Bot will connect to Discord.

## Other Considerations

The "!roll" utility is populated from a JSON data sheet. In the live version of Highscores Bot, this data sheet is populated with private vscape content, and thus is not included on this public repository. You will need to populate rolls.json yourself for this utility to work.
