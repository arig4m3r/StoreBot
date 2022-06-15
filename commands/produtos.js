const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, MessageActionRow, Message } = require('discord.js');
const { adminRole } = require('../botconfig/serverconfig.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('produtos')
		.setDescription('Criar novo produto'),
	async execute(interaction) {

		if(interaction.member.roles.cache.some(r => r.id == adminRole) < 1){
			interaction.reply("Você não tem permissão para executar este comando!")
			setTimeout((() => interaction.deleteReply()), 3000)
			return;
		}

		const modal = new Modal()
			.setCustomId('ProductCreate')
			.setTitle('Criar novo produto')

		const productNameInput = new TextInputComponent()
			.setCustomId('ProductName')
			.setLabel('Nome do produto')
			.setPlaceholder('Ex: Cargo supremo')
			.setMaxLength(50)
			.setRequired(true)
			.setStyle('SHORT')

		const productDescriptionInput = new TextInputComponent()
			.setCustomId('ProductDescription')
			.setPlaceholder('Ex: Um cargo que dá acesso a funções especiais')
			.setLabel('Descrição do produto')
			.setRequired(true)
			.setMaxLength(150)
			.setStyle('PARAGRAPH')

		const productValueInput = new TextInputComponent()
			.setCustomId('ProductValue')
			.setLabel("Valor do produto")
			.setPlaceholder('Ex: 100,00 (Caso não seja inteiro, use virgula)')
			.setMaxLength(8)
			.setRequired(true)
			.setStyle('SHORT');

		const productEmojiInput = new TextInputComponent()
			.setCustomId('ProductEmoji')
			.setLabel("Emoji do produto")
			.setPlaceholder('Ex: 💎')
			.setMaxLength(5)
			.setRequired(false)
			.setStyle('SHORT');
			
		
			modal.addComponents(
				new MessageActionRow().addComponents(productNameInput),
				new MessageActionRow().addComponents(productDescriptionInput),
				new MessageActionRow().addComponents(productValueInput),
				new MessageActionRow().addComponents(productEmojiInput));

		await interaction.showModal(modal);
	},
};