const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const axios = require("axios");
const {
	MessageEmbed
} = require('discord.js');
const {
	MessageActionRow,
	MessageButton
} = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('notification')
		.setDescription('Get the latest notification from ktu'),
	async execute(interaction) {
		await interaction.deferReply();
		axios.get(`https://ktu.amith.ninja`)
			.then(function (response) {
				const row = new MessageActionRow()
					.addComponents(new MessageButton()
						.setCustomId('0')
						.setLabel('1')
						.setStyle('PRIMARY'))
					.addComponents(
						new MessageButton()
						.setCustomId('1')
						.setLabel('2')
						.setStyle('PRIMARY'))
					.addComponents(
						new MessageButton()
						.setCustomId('2')
						.setLabel('3')
						.setStyle('PRIMARY'))
					.addComponents(
						new MessageButton()
						.setCustomId('3')
						.setLabel('4')
						.setStyle('PRIMARY'))
					.addComponents(
						new MessageButton()
						.setCustomId('4')
						.setLabel('5')
						.setStyle('PRIMARY'));



				const embed1 = new MessageEmbed()
					.setTitle("KTU NOTIFICATION")
					.setColor("RANDOM")
					.setDescription("Select button to view notification")
					.setTimestamp("hoi")
					.addFields({
						name: `**#1**`,
						value: `${response.data.notifications[0].title}`
					}, {
						name: `**#2**`,
						value: `${response.data.notifications[1].title}`
					}, {
						name: `**#3**`,
						value: `${response.data.notifications[2].title}`
					}, {
						name: `**#4**`,
						value: `${response.data.notifications[3].title}`
					}, {
						name: `**#5**`,
						value: `${response.data.notifications[4].title}`
					});





				return interaction.editReply({
					embeds: [embed1],
					components: [row]
				});



			}).catch(function (error) {
				console.log(error);
			});
			const row2 = new MessageActionRow();
			const filter = i => i.user.id === interaction.user.id;

		const collector = interaction.channel.createMessageComponentCollector({filter,time :20000,limit:1});

		collector.on('collect', async i => {
			await i.deferUpdate();
			if (i.customId === '0' || i.customId === '1' || i.customId === '2' || i.customId === '3' || i.customId === '4') {
				let k =i.customId;
				axios.get(`https://ktu.amith.ninja`).then(function (response) {
				const embed2 = new MessageEmbed()
					.setTitle(response.data.notifications[k].title)
					.setColor("RANDOM")
					.setDescription(response.data.notifications[k].description)
					.setTimestamp();
				if (response.data.notifications[k].links[0]) {
					let i = 0;
					for (i; response.data.notifications[k].links[i]; i++) {
						row2.addComponents(
							new MessageButton()
							.setLabel(`${response.data.notifications[k].links[i].url_title}`)
							.setStyle('LINK')
							.setURL(`${response.data.notifications[k].links[i].url})`),
						);
					}
					 
				
				}
				i.editReply({
					embeds: [embed2],
					components: [row2]
				});
			}).catch(function (error) {
				console.log(error);
			});
			
			
			
			
			}



		});
		collector.on('end', async i => {
			if (i.size === 0) {

				interaction.editReply({
					content: "Time expired",
					components: [],
				});
			}
		})




	},
};





