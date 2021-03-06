const ScoreboardHandler = require("./content/highscores/scoreboardhandler.js");
const utils = require("./utils/utils.js");

// Set launch time for uptime calc
const launchTime = new Date().getTime();

// Load up the discord.js library
const Discord = require("discord.js");

const axios = require("axios").default;

// Discord Client
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

if (config.daemon) {
  const daemonizeProcess = require("daemonize-process");
  daemonizeProcess();
}

const sh = new ScoreboardHandler();

const MAX_REQUESTS = 3;

var requests = 0;

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(
    `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
  );
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`!help`);
});

client.on("guildCreate", (guild) => {
  // This event triggers when the bot joins a guild.
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", (guild) => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async (message) => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes("nerf") || message.author.tag.toLowerCase().includes("tummyfish")) {        
    message.react("702889157596545205");
  }

  if (message.content.toLowerCase().includes("read the wiki")) {
    message.channel.send("READ THE WIKI http://vscape.wikidot.com/");
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "about") {
    message.channel.send(
      "HighscoresBot is a vidyascape.org helper bot, created by Ovid."
    );
  }

  //Left In As Convenient Embed Example
  /*if (command === "embed") {
    
      const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Some title')
          .setURL('https://discord.js.org/')
          .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
          .setDescription('Some description here')
          .setThumbnail('https://i.imgur.com/wSTFkRM.png')
          .addFields(
              { name: 'Regular field title', value: 'Some value here' },
              { name: '\u200B', value: '\u200B' },
              { name: 'Inline field title', value: 'Some value here', inline: true },
              { name: 'Inline field title', value: 'Some value here', inline: true },
          )
          .addField('Inline field title', 'Some value here', true)
          .setImage('https://i.imgur.com/wSTFkRM.png')
          .setTimestamp()
          .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

          message.channel.send(exampleEmbed);    
    }*/

  if (command === "dl" || command === "download") {
    message.channel.send("https://vidyascape.org/downloads");
  }

  if (command === "wiki" || command === "readwiki") {
    message.channel.send("http://vscape.wikidot.com/");
  }
  if (command === "blog" || command === "devblog") {
    message.channel.send("https://vidyascape.org/devblog");
  }
  if (command === "map") {
    message.channel.send("https://vidyascape.org/map");
  }
  if (command === "locked" || command === "btfo") {
    const btfoEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("/v/scape BTFO (Port-Mortem) - 2018-08-04")
      .setDescription(
        "If your account is locked, you will need to contact a staff member to have it unlocked for you. We are going to restore all accounts no matter how long that takes us. You can message us on Steam from the /v/scape Steam group or make a new account and message us in game."
      )
      .setURL("https://vidyascape.org/devblog#vscape-btfo");
    message.channel.send(btfoEmbed);
  }

  if (command === "pnotes" || command === "pn") {
    if (requests >= MAX_REQUESTS) {
      message.channel.send("Too many requests. Fuck off.");
    }
    requests++;
    let manualMode = false;
    axios
      .get("https://vidyascape.org/files/patchnotes.json")
      .then((response) => {
        let pn1;
        if (manualMode) {
          let pn = require("./patchnotes.json");
          pn1 = pn[0];
        } else {
          pn1 = response.data[0];
        }
        let header = "**" + pn1["header"] + "**\n";
        let major = "";
        let minor = "";
        for (let i = 0; i < pn1["major"].length; i++) {
          major += "- " + pn1["major"][i] + "\n";
        }
        for (let i = 0; i < pn1["minor"].length; i++) {
          minor += "- " + pn1["minor"][i] + "\n";
        }
        const attachment = new Discord.MessageAttachment(
          "./img/sb.png",
          "sb.png"
        );
        const pnotesEmbed = new Discord.MessageEmbed()
          .attachFiles(attachment)
          .setColor("RANDOM")
          .setTitle(header)
          .setThumbnail("attachment://sb.png")
          .setURL("https://vidyascape.org/patchnotes");
        if (major !== "") {
          pnotesEmbed.addField("Major", major);
        }
        if (minor !== "") {
          pnotesEmbed.addField("Minor", minor);
        }
        message.channel.send(pnotesEmbed);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        m.edit("Unable to fetch data.");
      })
      .finally(function () {
        requests--;
      });
  }

  if (command === "vsg" || command === "thread") {
    if (requests >= MAX_REQUESTS) {
      message.channel.send("Too many requests. Fuck off.");
    }
    let request = "https://a.4cdn.org/vg/catalog.json";
    const m = await message.channel.send("Loading request...");
    requests++;
    axios
      .get(request)
      .then(function (response) {
        let dataArray = response.data;
        for (let i = 0; i < dataArray.length; i++) {
          let threadsArray = dataArray[i].threads;
          for (let j = 0; j < threadsArray.length; j++) {
            let thread = threadsArray[j];
            if (thread.sub.includes("/vsg/")) {
              let link = "https://boards.4chan.org/vg/thread/" + thread.no;
              const exampleEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(thread.sub)
                .setURL(link)
                .setThumbnail(
                  "https://i.4cdn.org/vg/" + thread.tim + thread.ext
                )
                .addField("Current Replies", thread.replies, false)
                .setTimestamp();

              message.channel.send(exampleEmbed);
              m.delete();
              return;
            }
          }
        }
        m.edit("Unable to fetch data.");
      })
      .catch(function (error) {
        m.edit("Unable to fetch data.");
      })
      .finally(function () {
        requests--;
      });
  }

  if (command === "tracker") {
    if (requests >= MAX_REQUESTS) {
      message.channel.send("Too many requests. Fuck off.");
    }
    //         if (!message.channel.name.includes("bot")) {
    //             message.channel.send("Please keep this command to a designated bot channel.");
    //             return;
    //         }
    var mod = args[0] != undefined ? args[0].toLowerCase() : "";
    var request =
      `https://vidyascape.org/api/tracker/skill/overall/1?time=` +
      (mod === "weekly" ? 604800 : mod === "monthly" ? 2592000 : 86400) +
      `&ironman=0`;
    const m = await message.channel.send("Loading request...");
    requests++;
    axios
      .get(request)
      .then(function (response) {
        // handle success
        sh.addScoreboard(message.channel.id);
        var sb = sh.getScoreboardById(message.channel.id);
        response.data.map((p, k) => sb.addScore(p.username, p["overall_diff"]));
        m.delete();
        message.channel.send(
          sb.buildScoreboard(
            (mod === "weekly"
              ? "Weekly "
              : mod === "monthly"
              ? "Monthly "
              : "Daily ") + "Overall Highscores:",
            "tracker"
          )
        );
        sh.removeScoreboard(message.channel.id);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        m.edit("Unable to fetch data.");
      })
      .finally(function () {
        requests--;
      });
  }

  if (command === "stats") {
    if (requests >= MAX_REQUESTS) {
      message.channel.send("Too many requests. Fuck off.");
    }
    //         if (!message.channel.name.includes("bot")) {
    //             message.channel.send("Please keep this command to a designated bot channel.");
    //             return;
    //         }
    var player =
      args[0] != undefined ? args.join(" ").toLowerCase() : undefined;
    if (player === undefined) {
      message.channel.send("!stats [player name]");
    }
    var request = `https://vidyascape.org/api/highscores/player/` + player;
    const m = await message.channel.send("Loading request...");
    requests++;
    axios
      .get(request)
      .then(function (response) {
        // handle success
        sh.addScoreboard(message.channel.id);
        var sb = sh.getScoreboardById(message.channel.id);
        utils.getValidSkills().map((s) => {
          sb.addScore(
            s,
            response.data[s + "_xp"],
            response.data[s + "_rank"],
            response.data[s + "_lvl"]
          );
        });
        m.delete();
        message.channel.send(
          sb.buildScoreboard(
            player.charAt(0).toUpperCase() + player.substring(1) + "'s Stats",
            "player"
          )
        );
        sh.removeScoreboard(message.channel.id);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        m.edit("Unable to fetch data.");
      })
      .finally(function () {
        requests--;
      });
  }

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-tripiiiiiiiiuuuuu)
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }

  if (command === "roll") {
    let rolls = require("./data/rolls.json");
    message.channel.send(rolls[Math.floor(Math.random() * rolls.length)]);
  }

  if (command === "uptime" || command === "up") {
    let curTime = new Date().getTime();
    let uptime = curTime - launchTime;

    let days = Math.floor(uptime / 86400000);
    uptime %= 86400000;

    let hours = Math.floor(uptime / 3600000);
    uptime %= 3600000;

    let minutes = Math.floor(uptime / 60000);

    //TODO: format method in utils
    message.channel.send(
      "HighscoresBot has been online for " +
        (days > 0 ? days + " day" + (days === 1 ? "" : "s") + ", " : "") +
        (hours > 0 ? hours + " hour" + (hours === 1 ? "" : "s") + ", " : "") +
        minutes +
        " minute" +
        (minutes === 1 ? "" : "s") +
        "."
    );
  }

  if (command === "help" || command === "h") {
    let helpString = "Something went wrong. Contact admin.";
    let commandList = "";
    let list = require("./data/help.json");
    let i = 0;
    if (args[0] === undefined) {
      args.push("default");
    }
    if (list !== null) {
      for (i = 0; i < list.length; i++) {
        commandList += "\n" + config.prefix + list[i]["command"];
        if (args[0] === list[i]["command"]) {
          helpString = list[i]["explanation"];
          break;
        }
      }
      if (i >= list.length) {
        const scoreEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Commands")
          .setDescription(commandList)
          .setFooter(
            'Type "!help [command]" to learn more about a command, eg "!help help".'
          );
        var channel = this.channel;
        message.channel.send(scoreEmbed);
        return;
      }
    }
    message.channel.send(helpString);
  }
});

client.login(config.token);
