const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const ms = require("ms");
bot.commands = new Discord.Collection();



bot.on("ready", function(){
    bot.user.setGame("En developpement, !help");
    console.log("Le bot a bien été connecté");
})

bot.login(process.env.TOKEN);

// Commandes

bot.on("message", async message => {
	if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

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

    if(cmd === `${prefix}help`){
        message.delete();
        let logEmbed = new Discord.RichEmbed()
        .setColor("#f91509")
        .setAuthor("=-> Aide <-=")
        .addField("!help: ", `T'envoie l'aide du serveur`)
        .addField("!ip", `T'envoie l'ip du serveur`)
        .addField("!boutique", `T'envoie l'ip du serveur`)
        .addField("!site", `T'envoie le lien du site internet`);
        message.author.send(logEmbed);
    }
    if(cmd === `${prefix}modhelp`){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
        message.delete();
        let logEmbed = new Discord.RichEmbed()
        .setColor("#f91509")
        .setAuthor("=-> Moderator Help <-=")
        .addField("!ban @Utilisateur Raison: ", `La raison est obligatoire, permission: "BAN_MEMBERS"`)
        .addField("!kick @Utilisateur Raison", `La raison est obligatoire, permission: "KICK_MEMBER"`)
        .addField("!tempmute @Utilisateur 10<s/min/h/d> Raison", `Le temps et la raison sont obligatoire, permission: "MANAGE_MESSAGES"`)
        .addField("!clear <nombre de 1 a 100>", `Les nombres 1 et 100 ne peuvent pas etre choisis, permission: "MANAGE_MESSAGES"`);
        message.author.send(logEmbed);
    }
    if(cmd === `${prefix}ip`){
        message.delete();
        message.reply("Le serveur est encore en developpement").then(msg => msg.delete(5000));
    }
    if(cmd === `${prefix}boutique`){
        message.delete();
        message.reply("La boutique est encore en developpement.").then(msg => msg.delete(5000));
    }
    if(cmd === `${prefix}site`){
        message.delete();
        message.reply("Le site est encore en developpement").then(msg => msg.delete(5000));
    }

    if(cmd === `${prefix}kick`){

        //kick
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("Je n'ai pas pu trouver cet utilisateur");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGE")) return message.channel.send("Tu n'as pas la permission requise pour executé cette commande")
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Cette personne ne peut pas etre expulsée !");
		if(!kReason) return message.reply("Tu n'as pas specifié la raison");

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("=-> Kick <-=")
        .setColor("#f44242")
        .addField("User expulsé", `${kUser}`)
        .addField("Expulsé par", `${message.author}`)
        .addField("Raison", `${kReason}`);
        
        let rapportsChannel = message.guild.channels.find(`name`, "rapports-de-sanctions");
        if(!rapportsChannel) return message.channel.send("Je ne peux pas trouvé le channel \"rapports de sanctions\"");

        message.guild.member(kUser).kick(kReason);
        rapportsChannel.send(kickEmbed);

        return; 
    }
    if(cmd === `${prefix}ban`){
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("Je n'ai pas pu trouver cet utilisateur");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGE")) return message.channel.send("Tu n'as pas la permission requise pour executé cette commande")
		if(!bReason) return message.reply("Tu n'as pas spécifié la raison");
		if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Cette personne ne peut pas etre bannie !");
        let banEmbed = new Discord.RichEmbed()
        .setDescription("=-> Ban <-=")
        .setColor("#f44242")
        .addField("Utilisateur banni", `${bUser}`)
        .addField("Banni par", `{message.author}`) 
        .addField("Raison", `${bReason}`)
        
        let rapportsChannel = message.guild.channels.find(`name`, "rapports-de-sanctions");
        if(!rapportsChannel) return message.channel.send("Je ne peux pas trouvé le channel \"rapports de sanctions\"");
        
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
		if(!mreason) return message.reply("Tu n'as pas spécifié la raison");

        let muteEmbed = new Discord.RichEmbed()
        .setDescription("=-> Mute <-=")
        .setColor("#f44242")
        .addField("Utilisateur muté", `${tomute} avec l'id ${tomute.id}`)
        .addField("Muté par", `${message.author}`) 
        .addField("Temps:", `${ms(ms(mutetime))}`)
        .addField("Raison", `${mreason}`)

        let rapportsChannel = message.guild.channels.find(`name`, "rapports-de-sanctions");
        if(!rapportsChannel) return message.channel.send("Je ne peux pas trouvé le channel \"rapports de sanctions\"");
        rapportsChannel.send(muteEmbed);
        await(tomute.addRole(muterole.id));
        setTimeout(function(){
            tomute.removeRole(muterole.id);
            rapportsChannel.sendMessage(`<@${tomute.id}> as été démute !`);
        }, ms(mutetime));
        }
        if(cmd === `${prefix}clear`){
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Tu n'as pas la permission d'executé cette commande (MANAGE_MESSAGES)");
    
            if(!args[0]) return message.channel.send("Merci de précisé le nombre de message que tu veux supprimé\nRappel d'utilisation: !clear <nomrbe de messages a supprimés>.");
    
            if(args[0] === "1"){
                message.delete();
                message.reply("Merci de précisé un nombre entre 1 et 100").then(msg => msg.delete(5000));
                return;
            }
            if(args[0] >= 100){
                message.delete(); 
                message.reply("Merci de précisé un nombre entre 1 et 100").then(msg => msg.delete(5000));
                return;
            }
            message.channel.bulkDelete(args[0]).then(() => {
                message.channel.send(`Pooof, je viens de supprimé ${args[0]} messages !`).then(msg => msg.delete(10000));
                
            })
    
        }
  

})

bot.on("member", function (guildMemberAdd){
    message.guild.channels.find(`name`, "bienvenue").sendMessage("Bienvenue a " + member + "passe un bon moment avec nous !")
})
