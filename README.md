# StoreBot - Gerenciamento de lojas no Discord!

### Um bot criado com um intuito de testar a nova api do [Discord.JS](https://discord.js.org/), [v13](https://discordjs.guide/additional-info/changes-in-v13.html#before-you-start)

**O que é?**

Este bot compõe uma lista de elementos para gerenciar uma loja simples dentro da plataforma [Discord](https://discord.com/)

**TO-DO**

- [x] Gerenciamento de produtos
  
- [x] Criação de produtos
  
- [x] Base de dados
  
- [x] Utilizar novas funções da Api do Discord
  
- [x] Criar pix de maneira não-dependente
  
- [x] Utilizar slash commands
  
- [x] Criar canais com base nos produtos
  
- [x] Anuncio de pix criado
  
- [ ] Confirmação de realização de vendas
  

**Como instalar?**

```bash
# Clonar o projeto
git clone https://github.com/arig4m3r/storebot
# Navegar até a pasta do projeto
cd storebot
# Instalar pacotes
npm install
```

**Como preparar o bot?**

- Na pasta root (Principal) do projeto, edite o arquivo **.env** e altere o seu TOKEN, para o token de seu bot criado em [Discord Developer Portal](https://discord.com/developers)
  
- Altere o nome do arquivo **.env.example** para **.env**
  
- Dentro de config.json, altere o ID do seu cliente *(Bot criado no Painel de desenvolvedores do Discord)*, e o GuildID *(ID do servidor de sua loja)*
  
- Dentro da pasta **botconfig**, altere as informações de **serverconfig.json** para suprir as suas necessidades, com os seus respectivos ID's e informações de seu PIX.
  
- Altere o nome do arquivo **serverconfig.json.example** para **serverconfig.json**
  

**Como iniciar o bot?**

```bash
# Registre os comandos para o seu servidor no Discord
node deploy-commands.js
# Inicie o bot
node .
```
