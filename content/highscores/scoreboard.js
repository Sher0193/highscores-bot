const Discord = require("discord.js");
const utils = require('../../utils/utils.js');

class Scoreboard {
	
	scores = new Array();
	cats = new Array();
    ranks = new Array();
	
	channel = null;
	
	constructor(channel, scores, cats, ranks) {
		if (scores !== null) {
			this.scores = scores;
		}
		if (cats !== null) {
			this.cats = users;
		}
		if (ranks !== null) {
            this.ranks = ranks;
        }
		this.channel = channel;	
	}
	
	getId() {
		return this.channel;
	}
	
	buildScoreboard(title, flag) {
        if (flag === "tracker")
            this.sort();
		if (this.channel != null) {
            const scoreEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(title)
            .setThumbnail('https://i.imgur.com/MQeQ1NW.png')
            .setDescription(flag === "tracker" ? this.trackerToString() : flag === "player" ? this.playerToString() : "Something went wrong. Go bug Ovid.");
            return scoreEmbed;
		}
	}
	
	trackerToString() {
 		var string = "";
		for (let i = 0, j = 1; i < this.cats.length; i++) {
			if (this.scores[i] > 0 && this.cats[i] !== "") {
                if (i > 0 && this.scores[i] < this.scores[i - 1])
                    j = i + 1;
				string += ("*" + utils.ordinal(j) + "*") + " **" + this.cats[i] + "**: +" + this.scores[i] + " XP\n";
			}
		}
		return string;
	}
	
	playerToString() {
        var string = "";
		for (let i = 0, j = 1; i < this.cats.length; i++) {
			if (this.cats[i] !== "") {
                var levelString = i == 0 ? "" : "**(Level " + utils.xp_to_level(this.scores[i]) + ")**";
				string += ("*" + utils.ordinal(this.ranks[i]) + "*") + " **" + this.cats[i] + "**: " + this.scores[i] + " XP " + levelString + "\n";
			}
		}
		return string;
    }
	
	addScore(cat, amt, rank) {
		var found = false;
		var toTry = cat.trim();
		for (let j = 0; j < this.cats.length; j++) {
			if (toTry.toLowerCase() === this.cats[j].toLowerCase()) {
				found = true;
				this.scores[j] = this.scores[j] + amt < 0 ? 0 : this.scores[j] + amt;
                this.ranks[j] = rank;
				break;
			}
		}
		if (!found) {
            if (toTry !== "" && amt > 0) {
                this.cats.push((toTry.charAt(0).toUpperCase() + toTry.slice(1).toLowerCase()));
                this.scores.push(amt);
                this.ranks.push(rank);
            }
		}
	}
	
	addScores(cats, amt, rank) {
		for (let i = 0; i < cats.length; i++) {
			this.addScore(cats[i], amt);
		}
	}
	
	sort() {
		var len = this.scores.length;

		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - i - 1; j++) {
				if (this.scores[j] < this.scores[j + 1]) {
					// swap scores
					var tempScore = this.scores[j];
					this.scores[j] = this.scores[j + 1];
					this.scores[j + 1] = tempScore;
					// swap users
					var tempCat = this.cats[j];
					this.cats[j] = this.cats[j + 1];
					this.cats[j + 1] = tempCat;
                    // swap ranks
                    var tempRank = this.ranks[j];
                    this.ranks[j] = this.ranks[j + 1];
                    this.ranks[j + 1] = tempRank;
				}
			}
		}
	}
	
	toJson() {
		return {
			scores: this.scores,
			cats: this.cats,
			channel: this.channel
		};
	}
}

module.exports = Scoreboard;
