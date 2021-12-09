const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const creditfile = require("./creditfile.json");

const {
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	MessageEmbed
} = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('sgpa')
		.setDescription('Calculate SGPA 2019 scheme'),
	async execute(interaction) {
		await interaction.deferReply({
			ephemeral: true
		});




		const departmentrow = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
				.setCustomId('deptselect')
				.setPlaceholder('Department'),
			);

		const buttonrow1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('10')
				.setLabel('S')
				.setStyle('SUCCESS'),
				new MessageButton()
				.setCustomId('9')
				.setLabel('A+')
				.setStyle('SUCCESS'),
				new MessageButton()
				.setCustomId('8.5')
				.setLabel('A')
				.setStyle('SUCCESS'),
				new MessageButton()
				.setCustomId('8')
				.setLabel('B+')
				.setStyle('SUCCESS'),
				new MessageButton()
				.setCustomId('7.5')
				.setLabel('B')
				.setStyle('SUCCESS'),
			);
		const buttonrow2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('7')
				.setLabel('C+')
				.setStyle('PRIMARY'),
				new MessageButton()
				.setCustomId('6.5')
				.setLabel('C')
				.setStyle('PRIMARY'),
				new MessageButton()
				.setCustomId('6')
				.setLabel('D')
				.setStyle('PRIMARY'),
				new MessageButton()
				.setCustomId('5.5')
				.setLabel('P (Pass)')
				.setStyle('PRIMARY'),
				new MessageButton()
				.setCustomId('0')
				.setLabel('F/FE/I')
				.setStyle('DANGER'),
			);


		for (var k in creditfile) { //add all available department from json to discord selection menu list
			departmentrow.components[0].addOptions({
				label: k,
				value: k,
			})
		}


		const deptMessage = await interaction.editReply({   //department selection menu
			content: '**Select Department**',
			components: [departmentrow],
			ephemeral: true
		}); 
		const filter = i => i.user.id === interaction.user.id;



		const deptCollector = deptMessage.createMessageComponentCollector({
			filter: filter,
			time: 20000,
			limit: 1
		});
		let dept, sem;
		let n = 1;
		let gi = 0,
			scigi = 0,
			gpa = 0,
			sgi = 0;
		deptCollector.on('collect', async i => {

			if (i.customId == "deptselect") { //if department selected
				await i.deferUpdate();

				const semrow = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
						.setCustomId('semselect')
						.setPlaceholder('Semester'),
					);
				dept = i.values;
				for (var k in creditfile[dept]) { //add all semester available within the department from json to selection menu list
					semrow.components[0].addOptions({
						label: k,
						value: k,
					})

				}
				const semMessage = await i.editReply({ //semester selection menu
					content: "**Select semester.**",
					components: [semrow],
					ephemeral: true,
				})
				const semCollector = await semMessage.createMessageComponentCollector({
					filter: filter,
					time: 20000,
					limit: 1
				});

				semCollector.on('collect', async i => {  //if semester selected
					if (i.customId == "semselect") {
						await i.deferUpdate();
						sem = i.values;

						const gradeMessage = await i.editReply({ //first subject grade selection			
							content: `**Select grade for \n ${creditfile[dept][sem][0].name}**`,
							components: [buttonrow1, buttonrow2],
							ephemeral: true,
						})
						let gradeCollector = gradeMessage.createMessageComponentCollector({
							filter: filter,
							time: 100000
						});

						gradeCollector.on('collect', async i => {
							if (i.isButton()) {
								await i.deferUpdate();


								scigi = scigi + (creditfile[dept][sem][n - 1].credit * Number(i.customId)); // sum of (credit * grade)
								gi = gi + creditfile[dept][sem][n - 1].credit; // sum of total credits
								sgi = sgi + (i.customId == 0 ? 0 : creditfile[dept][sem][n - 1].credit) // add credit if scored a grade (for total earned credits)
								if (creditfile[dept][sem][n]) { // check if subject array end
									const gradeCollectorLoop = await i.editReply({ // update message with next grade selection
										content: `**Select grade for \n ${creditfile[dept][sem][n].name}**`,
										components: [buttonrow1, buttonrow2],
										ephemeral: true,
									})
									gradeCollector = gradeCollectorLoop.createMessageComponentCollector({
										filter: filter,
										time: 100000
									});


									n++;

								} else {

									gpa = scigi / gi; // SGPA
									const embed1 = new MessageEmbed()
										.setTitle("KTU SGPA CALCULATOR 2019 scheme")
										.setColor("RANDOM")
										.setDescription("```js\nSGPA = Σ(Ci×GPi)/ΣCi \n\"Ci\" - credit assigned fo‎r a course.\n\"GPi\" - grade point fo‎r that course``` ")
										.addFields({
												name: `**SGPA**`,
												value: " " + Math.round((gpa) * 100) / 100,//fixed to 2 decimal point
												inline: true
											}, 
											{
												name: `**Percentage**`,
												value: " " + Math.round((10 * gpa) * 100) / 100,
												inline: true
											}, {
												name: `**Credits**`,
												value: sgi + "/" + gi,
												inline: true
											}, );

									await i.editReply({ //result 
										content: " ",
										embeds: [embed1],
										components: [],
										ephemeral: true,
									})
									return;
								}
							}

						})
						gradeCollector.on('end', async i => {
							if (i.size == 0)
								interaction.editReply({
									content: "Time expired",
									ephemeral: true
								});

						})

					}
				});
				semCollector.on('end', async i => {
					if (i.size === 0) {

						interaction.editReply({
							content: "Time expired",
							components: [],
							ephemeral: true
						});
					}
				})

			}

		});

		deptCollector.on('end', async i => {
			if (i.size === 0) {

				interaction.editReply({
					content: "Time expired",
					components: [],
					ephemeral: true
				});
			}
		})



	},
};
