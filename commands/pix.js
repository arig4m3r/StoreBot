const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
let { QrCodePix } = require('qrcode-pix');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pix')
		.setDescription('Cria um pix!')
		.addNumberOption(option => option.setName('valor').setRequired(true).setDescription('Valor do pix.'))
		.addStringOption(option => option.setName('mensagem').setRequired(false).setDescription('Mensagem do pix.'))
		.addStringOption(option => option.setName('chave').setRequired(false).setDescription('Chave pix, se não definida do dono')),
	async execute(interaction) {
		const valor = interaction.options.getNumber('valor');
		const message = interaction.options.getString('mensagem') || "Você me deve";
		const chave = interaction.options.getString('chave') || '+5518981367211';

		console.log(valor)
		const qrCodePix = QrCodePix({
			version: '01',
			key: chave,
			name: 'Fulano de Tal',
			city: 'PRESIDENTE PRUDENTE',
			message: message,
			value: valor,
		})

		let base64_img = await qrCodePix.base64();
		const sfbuff = new Buffer.from(base64_img.split(","), "base64");
		new MessageAttachment({ attachment: sfbuff, name: "pix.png"});


		var fav = base64_img.split(",").slice(1).join(",");
		var imageStream = Buffer.from(fav, "base64");
		var attachment = new MessageAttachment(imageStream, "pix.png");


		const embed = new MessageEmbed()
		.setTitle("Pix - Pagamentos")
		.setColor("AQUA")
		.addField('Como pagar?', 'Vá no seu aplicativo de banco favorito, selecione pix, e clique em "Pagar", QR Code e aponte o celular para esta imagem.')
		.setImage('attachment://pix.png')

		await interaction.deferReply();
		await interaction.editReply({embeds: [embed], files: [attachment]});
	},
};