const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const ms = require("ms");
bot.commands = new Discord.Collection();

bot.on("ready", async () => {
    console.log(`${bot.user.username} est online`);
})

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = "!"
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}help`){
        let helpembed = new Discord.RichEmbed()
        .setDescription("=-> Aide <-=")
        .setColor("#15f153")
        .addField("Commandes:", "voici les commandes du serveur ")
        .addField("!help", "affiche l'aide du serveur")
        .addField("!discord", "t'envoie un lien du discord")
        .addField("!ip", "t'affiche l'ip du serveur")

        message.author.sendMessage(helpembed);
    }

    if(cmd === `${prefix}discord`){
        message.reply("Le lien du discord est: Soon");
    }
    if(cmd === `${prefix}ip`){
        message.reply("Le serveur est en développement !");
    }

    if(cmd === `${prefix}serverinfo`){
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Information du serveur")
        .setColor("#15f153")
        .setThumbnail(sicon)
        .addField("Nom du serveur", message.guild.name)
        .addField("Crée le", message.guild.createdAt)
        .addField("Tu as rejoint le serveur le", message.member.joinedAt)
        .addField("Membre totaux", message.guild.memberCount);

        return message.channel.send(serverembed);
    }

    if(cmd === `${prefix}kick`){

        //kick
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("Je n'ai pas pu trouver cet utilisateur");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGE")) return message.channel.send("Tu n'as pas la permission requise pour executé cette commande")
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Cette personne ne peut pas etre expulsée !")

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("=-> Kick <-=")
        .setColor("#f44242")
        .addField("User expulsé", `${kUser} avec l'id ${kUser.id}`)
        .addField("Expulsé par", `<@${message.author.id}> avec l'id ${message.author.id}`)
        .addField("Raison", `${kReason}`);
        
        let rapportsChannel = message.guild.channels.find(`name`, "rapport-de-sanction");
        if(!rapportsChannel) return message.channel.send("Je ne peux pas trouvé le channel \"rapport de sanction\"");

        message.guild.member(kUser).kick(kReason);
        rapportsChannel.send(kickEmbed);

        return; 
    }
    if(cmd === `${prefix}ban`){
                let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
                if(!bUser) return message.channel.send("Je n'ai pas pu trouver cet utilisateur");
                let bReason = args.join(" ").slice(22);
                if(!message.member.hasPermission("MANAGE_MESSAGE")) return message.channel.send("Tu n'as pas la permission requise pour executé cette commande")
                if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Cette personne ne peut pas etre bannie !")
        
                let banEmbed = new Discord.RichEmbed()
                .setDescription("=-> Ban <-=")
                .setColor("#f44242")
                .addField("User expulsé", `${bUser} avec l'id ${bUser.id}`)
                .addField("Expulsé par", `<@${message.author.id}> avec l'id ${message.author.id}`) 
                .addField("Raison", `${bReason}`)
                
                let rapportsChannel = message.guild.channels.find(`name`, "rapport-de-sanction");
                if(!rapportsChannel) return message.channel.send("Je ne peux pas trouvé le channel \"rapport de sanction\"");
        
                message.guild.member(bUser).ban(bReason);
                rapportsChannel.send(banEmbed);
        
                return;
    }

    if(cmd === `${prefix}tempmute`){
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tomute) return message.reply("Je n'ai pas pu trouvé cet utilisateur ");
        if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Je ne peux pas mute cet utilisateur");
        let muterole = message.guild.roles.find(`name`, "Muet");
        if(!muterole) return message.reply("Le role \"Muet\" n'existe pas, merci de le créer");
        let mutetime = args[1];
        let mreason = args[2]
        if(!mutetime) return message.reply("Tu n'as pas specifié le temps");

        let muteEmbed = new Discord.RichEmbed()
        .setDescription("=-> Mute <-=")
        .setColor("#f44242")
        .addField("Utilisateur muté", `${tomute} avec l'id ${tomute.id}`)
        .addField("Muté par", `<@${message.author.id}> avec l'id ${message.author.id}`) 
        .addField("Temps:", `${ms(ms(mutetime))}`)
        .addField("Raison", `${mreason}`)

        let rapportsChannel = message.guild.channels.find(`name`, "rapport-de-sanction");
        if(!rapportsChannel) return message.channel.send("Je ne peux pas trouvé le channel \"rapport de sanction\"");
        rapportsChannel.send(muteEmbed);
        await(tomute.addRole(muterole.id));
        setTimeout(function(){
            tomute.removeRole(muterole.id);
            rapportsChannel.sendMessage(`<@${tomute.id}> as été démute !`);
        }, ms(mutetime));
        }
  

})

bot.login(process.env.TOKEN);

