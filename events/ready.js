module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		num=1;
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(() => {
			num = Math.floor(Math.random() * 5) + 1;
			
			if (num == 1) {
			  client.user.setActivity(`KTU News`, {
				type: "WATCHING"
			  });
			}
			if (num == 2) {
			  client.user.setActivity(`/notification`, {
				type: "LISTENING"
			  });
			}

			if (num == 3) {
			  client.user.setActivity(` Supply 🔥`, {
				type: "COMPETING"
			  });
			}

			if (num == 4) {
			  client.user.setActivity(`/ commands`, {
				type: "LISTENING"
			  });
			}
		  }, 36000);
	},
};
