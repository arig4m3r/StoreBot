const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');

const db = require('quick.db')
const { productsCategory, staffLogsChannel, adminRole, chavePix, nomePix, pixNome } = require('./botconfig/serverconfig.json')

let { QrCodePix } = require('qrcode-pix');

require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

//Commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Houve um erro enquanto você executava este comando!', ephemeral: true });
	}
});

//Modals
client.on('interactionCreate', async interaction => {
	if (!interaction.isModalSubmit()) return;
	if(interaction.customId == 'ProductCreate'){

		if(interaction.member.roles.cache.some(r => r.id == adminRole) < 1){
			interaction.reply("Você não tem permissão para registrar produtos!")
			setTimeout((() => interaction.deleteReply()), 3000)
			return;
		}

		const productName = interaction.fields.getTextInputValue('ProductName');
		const productDescription = interaction.fields.getTextInputValue('ProductDescription');
		const productValue = interaction.fields.getTextInputValue('ProductValue');
		const productEmoji = interaction.fields.getTextInputValue('ProductEmoji');

		const intEmbed = new MessageEmbed()
			.setTitle("Novo produto criado!")
			.setColor("#00ff00")
			.setDescription(`Produto: ${productName}\nDescrição: ${productDescription}\nValor: ${productValue}\nEmoji: ${productEmoji.length > 1 ? productEmoji : 'Nenhum'}`)
			.setFooter({text: "Criado por: " + interaction.user.username, iconURL: interaction.user.avatarURL()});

		let channel = await interaction.guild.channels.create(`${productEmoji}${productName}`, {type: 'GUILD_TEXT', parent: productsCategory});

		const productEmbed = new MessageEmbed()
			.setTitle(`${productEmoji} **${productName}**`)
			.setDescription(productDescription)
			.addField("Valor", "R$ " + ((productValue.includes(",") ? productValue : productValue + ",00")))
			.setColor("GREEN")

			const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`pay-${channel.id}`)
					.setLabel('Pagar')
					.setStyle('SUCCESS'),
			);
		

		await channel.send({embeds: [productEmbed], components: [row]})

		await db.push(`loja.produtos.${channel.id}`, {
			nome: productName,
			descricao: productDescription,
			valor: productValue,
			emoji: productEmoji
		})
		console.log(db.get('loja.produtos'))
		
		await interaction.reply({embeds: [intEmbed]})
		await interaction.guild.channels.cache.find(c => c.id == staffLogsChannel).send({embeds: [intEmbed]})
	}
})

//Buttons
client.on('interactionCreate',async interaction => {
	if (!interaction.isButton()) return;
	if(interaction.customId.includes('pay-')){
		const channelId = interaction.customId.split('-')[1]
		const channel = interaction.guild.channels.cache.find(c => c.id == channelId)
		const user = interaction.member.user
		const userId = user.id
		
		let produto = db.get(`loja.produtos.${channelId}`)[0];
		const valor = (( produto.valor).includes(',') ? produto.valor : produto.valor + ",00");

		console.log(valor.replaceAll(',', '.'))
		const qrCodePix = QrCodePix({
			version: '01',
			key: chavePix,
			name: pixNome,
			city: nomePix,
			message: `FakeStore ${userId+":"+channelId}`,
			value: parseInt(valor.replaceAll(',', '.'))
		})

		let base64_img = await qrCodePix.base64();

		var fav = base64_img.split(",").slice(1).join(",");
		var imageStream = Buffer.from(fav, "base64");
		var attachment = new MessageAttachment(imageStream, "pix.png");

		console.log(produto)

		const embed = new MessageEmbed()
		.setTitle("Pix - Pagamentos")
		.setColor("AQUA")
		.addField('Como pagar?', 'Vá no seu aplicativo de banco favorito, selecione pix, e clique em "Pagar", QR Code e aponte o celular para esta imagem.')
		.setImage('attachment://pix.png')

		await interaction.member.send({embeds: [embed], files: [attachment]})

		const logEmbed = new MessageEmbed()
			.setTitle("Pagamento de produto iniciado")
			.setColor("#00ff00")
			.setDescription(`${user} iniciou um pagamento no canal ${channel}`)
			.addField("Produto", produto.nome)
			.addField("Emoji", `${produto.emoji.length > 1 ? produto.emoji : 'Nenhum'}`)
			.addField("Valor", "R$ " + valor)
			.setImage('attachment://pix.png')
			.setFooter({text: `Pagamento iniciado por: ${user.username} (${userId})`, iconURL: user.avatarURL()});

			interaction.guild.channels.cache.find(c => c.id == staffLogsChannel).send({embeds: [logEmbed], files: [attachment]})
	}
	interaction.deferUpdate();
});

client.login(process.env.TOKEN);
