const env = require('dotenv');
env.config();
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const trans = require('./trans.json');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
})


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function sendEmbed(name, chnl) {

    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setURL('https://synchrov.eu')
        .setAuthor('SynchroV Systems', config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.labels.name, value: name, inline: true },
        )
        .setTimestamp()
        .setFooter('SynchroV Systems', config.logo_url);
    chnl.send(MadePrivateEmbed);
}

function sendPhoneEmbed(phone, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setURL(trans.check_player.url)
        .setAuthor(trans.check_player.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.labels.phone, value: phone, inline: true }
        )
        .setTimestamp()
        .setFooter(trans.check_player.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function sendMoneyEmbed(accounts, chnl) {
    const money = JSON.parse(accounts);
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setURL(trans.check_player.url)
        .setAuthor(trans.check_player.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: trans.labels.bank, value: formatter.format(money.bank), inline: true },
            { name: trans.labels.money, value: formatter.format(money.money), inline: true },
            { name: trans.labels.black_money, value: formatter.format(money.black_money), inline: true }
        )
        .setTimestamp()
        .setFooter(trans.check_player.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

function argEmbed(command, usage, usage_2, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_player.title)
        .setURL(trans.check_player.url)
        .setAuthor(trans.check_player.author, config.logo_url)
        .setThumbnail(config.logo_url)
        .addFields(
            { name: usage_2, value: config.prefix + command + usage, inline: true },
        )
        .setTimestamp()
        .setFooter(trans.check_player.footer, config.logo_url)
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
        .setFooter(trans.log_settings.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);

}

function sendVehicleEmbed(name, sex, phone, plate, chnl) {
    const MadePrivateEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(trans.check_plate.title)
        .setURL(trans.check_plate.url)
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
        .setFooter(trans.check_plate.footer, config.logo_url)
    chnl.send(MadePrivateEmbed);
}

client.once('ready', () => {
    console.log('Loaded version ' + process.env.VERSION + ' of FiveM Bot by nightstudios.eu');
})

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === `checkplayer`) {
        if (config.delete_command_usage) message.delete();

        if (args.length < 2) {
            message.channel.send(`Du hast keine Argumente angegeben, ${message.author}. Bitte nutze den Befehl wie folgt.`).then(msg => {
                setTimeout(() => msg.delete(), 4000)
            })
            return argEmbed('checkPlayer', trans.check_player.usage_2, trans.check_player.usage_1, message.channel);
        } else {
            if (message.member.roles.cache.has(config.staff_role_id)) {
                con.query("SELECT firstname, lastname, phone_number, accounts FROM users WHERE `firstname` = '" + args[0] + "' AND `lastname` = '" + args[1] + "';", function (err, result) {
                    if (result.length == 0) {
                        return message.channel.send(trans.messages.not_found_user).then(msg => {
                            setTimeout(() => msg.delete(), 4000);
                        });
                    } else {
                        sendEmbed(result[0].firstname + ' ' + result[0].lastname, message.channel);
                        sendPhoneEmbed(result[0].phone_number, message.channel);
                        return sendMoneyEmbed(result[0].accounts, message.channel);
                    }
                });
            } else {
                permissionEmbed(client.channels.cache.get(config.log_channel), 'checkplayer', message.author);
                return message.channel.send(trans.messages.insuficient_permissions).then(msg => {
                    setTimeout(() => msg.delete(), 4000)
                })
            }
        }
    } else if (command === `checkplate`) {
        if (config.delete_command_usage) message.delete();

        if (args.length < 1) {
            message.channel.send(`Du hast kein Argument angegeben, ${message.author}. Bitte nutze den Befehl wie folgt.`).then(msg => {
                setTimeout(() => msg.delete(), 4000)
            });
            return argEmbed('checkplate', trans.plate_check.usage_2, trans.plate_check.usage_1, message.channel);
        } else {
            if (message.member.roles.cache.has(config.staff_role_id)) {
                con.query('SELECT owner FROM owned_vehicles WHERE `plate` = "' + args[0] + '";', function (err, result) {
                    if (result.length == 0) {
                        return message.channel.send(trans.messages.not_found_plate).then(msg => {
                            setTimeout(() => msg.delete(), 4000);
                        });
                    } else {
                        con.query("SELECT firstname, lastname, sex, phone_number FROM users WHERE `identifier` = '"+result[0].owner+"';", function(err, result) {
                            return sendVehicleEmbed(result[0].firstname+' '+result[0].lastname, result[0].sex, result[0].phone_number, args[0], message.channel);
                        });
                    }
                })
            } else {
                permissionEmbed(client.channels.cache.get(config.log_channel), 'checkplate', message.author);
                return message.channel.send(trans.messages.insuficient_permissions).then(msg => {
                    setTimeout(() => msg.delete(), 4000)
                })
            }
        }
    }
})

client.login(process.env.TOKEN);
