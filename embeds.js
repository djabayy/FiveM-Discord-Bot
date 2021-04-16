const Discord = require('discord.js');
const config = require('./config.json');
const trans = require('./trans.json');
function sendEmbed(name, chnl) {

    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setAuthor('SynchroV Systems', config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.labels.name, value: name, inline: true },
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url);
    chnl.send(MadePrivateEmbed);
}

function sendPhoneEmbed(phone, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setAuthor(trans.check_player.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.labels.phone, value: phone, inline: true }
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function sendMoneyEmbed(accounts, chnl) {
    const money = JSON.parse(accounts);
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setAuthor(trans.check_player.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.labels.bank, value: formatter.format(money.bank), inline: true },
            { name: trans.labels.money, value: formatter.format(money.money), inline: true },
            { name: trans.labels.black_money, value: formatter.format(money.black_money), inline: true }
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function argEmbed(command, description, usage, usage_2, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(config.embed.command_usage)
        .setAuthor(config.embed.author, config.logo_url)
        .setDescription(description)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: usage_2, value: config.prefix + command + usage, inline: true },
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function permissionEmbed(chnl, command, author) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.log_settings.title)
        .setDescription(trans.log_settings.text)
        .setAuthor(trans.log_settings.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.log_settings.field_1, value: config.prefix + command, inline: true },
            { name: trans.log_settings.field_2, value: `${author}`, inline: true }
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function sendVehicleEmbed(name, sex, phone, plate, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_plate.title)
        .setAuthor(trans.check_plate.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .setDescription(trans.check_plate.description)
        .addFields(
            { name: trans.check_plate.plate, value: plate, inline: false },
            { name: trans.check_plate.name, value: name, inline: true, },
            { name: trans.check_plate.sex, value: sex == 'm' ? trans.sex.male : trans.sex.female, inline: true, },
            { name: trans.check_plate.phone, value: phone, inline: true, },
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function warnEmbed(user, reason, moderator, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
        .setTitle(trans.warnEmbed.title)
        .setAuthor(config.embed.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .setDescription(trans.warnEmbed.description)
        .addFields(
            { name: trans.warnEmbed.field_1, value: '<@'+user+'>', inline: true },
            { name: trans.warnEmbed.field_2, value: reason, inline: true },
            { name: trans.warnEmbed.field_3, value: moderator, inline: true },
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function userWarnEmbed(reason, moderator, warnCount, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
        .setTitle(trans.gotWarned.title)
        .setAuthor(config.embed.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .setDescription(trans.gotWarned.description)
        .addFields(
            { name: trans.gotWarned.field_1, value: reason, inline: true },
            { name: trans.gotWarned.field_2, value: moderator, inline: true },
            { name: trans.gotWarned.field_3, value: warnCount, inline: true },
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function resetWarns(user, moderator, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
        .setTitle(trans.resetWarn.title)
        .setAuthor(config.embed.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .setDescription(trans.resetWarn.description)
        .addFields(
            { name: trans.resetWarn.field_1, value: '<@'+user+'>', inline: true },
            { name: trans.resetWarn.field_2, value: moderator, inline: true },
        )
        .setTimestamp()
        .setFooter(config.embed.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

module.exports = {
    argEmbed, sendEmbed, sendMoneyEmbed, sendPhoneEmbed, sendVehicleEmbed, permissionEmbed, warnEmbed, userWarnEmbed, resetWarns
}