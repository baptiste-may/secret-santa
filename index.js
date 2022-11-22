require("dotenv").config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require("express");
const app = express();

app.listen();

app.use("/", (req, res) => {
  res.send(new Date());
});

const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "s/";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async message => {
	const attachment = message.attachments.first();
	const url = attachment ? attachment.url : null;
	if(message.content.startsWith(prefix + "test")) {
		if (url != null) {
			fetch(url).then(res => res.json()).then(out => {
			  	for (i = 0; i < out.length; i++) {
						const data = out[i];
						try {
							client.users.fetch(data.discord_id).then(user => {
								const embed = {
									color: 0xffffff,
									title: "📋 Test d'inscription au Secret Santa 📋",
									description: "Bonjour ! 👋 Je viens en MP pour verifier certaines informations 📃 (dont notamment le fait de pouvoir te MP 😉)",
									fields: [
											{
												name: "Ton NOM Prénom",
												value: data.name
											},
											{
												name: "Ton adressse",
												value: data.adress
											}
										],
									footer: {
										text: "N'hésite par prévenir un membre du staff si tu vois une erreur dans ces données",
										icon_url: "https://cdn.discordapp.com/attachments/753928979383320579/1006656001329614858/unknown.png",
									}
								}
								user.send({embed: embed})
								.then(() => {
									message.channel.send("✅ Message send to " + user.tag);
								}).catch(() => {
									message.channel.send("⛔️ Cannot send message to " + user.tag);
								});
							});
						} catch(err) {
							console.log(err);
							message.channel.send("❌ Error for " + data.discord_id);
						}
					}
					
					message.react("✅");
				}).catch(err => {
					message.channel.send("Le fichier JSON ne fonctionne pas.");
				});
			}
  	}
	if (message.content.startsWith(prefix + "random")) {
		if (url != null) {
			fetch(url).then(res => res.json()).then(out => {
				const data = getCouples(out);
				for (i = 0; i < data.length; i++) {
					const couple = data[i];
					try {
						client.users.fetch(couple[0].discord_id).then(user => {
							const embed = {
								color: 0xffffff,
								title: "🎅 Secret Santa 🎅",
								description: `Je vais pouvoir ~~enfin~~ te donner un nom ! 👌 Tu vas devoir offrir un cadeau à... <@${couple[1].discord_id}> !! 🎉 Voici ses informations :`,
								fields: [
									{
										name: couple[1].name,
										value: couple[1].adress
									}
								]
							}
							user.send({embed: embed})
							.then(() => {
								message.channel.send("✅ Message send to " + user.tag);
							}).catch(() => {
								message.channel.send("⛔️ Cannot send message to " + user.tag);
							});
						});
					} catch(err) {
						console.log(err);
						message.channel.send("❌ Error for " + data.discord_id);
					}
				}

				message.react("✅");
			}).catch(err => {
				message.channel.send("Le fichier JSON ne fonctionne pas.");
			});
		}
	}
});

console.log("Connection...");
client.login(process.env["TOKEN"]);

function getRandomElement(list) {
	return list.splice(Math.floor(Math.random()*list.length), 1)[0];
}

function getCouples(list) {
	let tuples = [];
	const first = getRandomElement(list);
	let u = first;

   	while (list.length != 0) {
		let r = getRandomElement(list);
		while (u == r) r = getRandomElement(list);
    	tuples.push([u, r]);
    	u = r;
	}
	tuples.push([u, first]);
	
   return tuples
}