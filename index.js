const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const trans = require('./trans.json');
var embeds = require('./embeds.js');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: config.ingame_database.host,
    port: config.ingame_database.port,
    user: config.ingame_database.user,
    password: config.ingame_database.password,
    database: config.ingame_database.database
})

var con2 = mysql.createConnection({
    host: config.main_database.host,
    port: config.main_database.port,
    user: config.main_database.user,
    password: config.main_database.password,
    database: config.main_database.database
})


con.connect(function (err) {
    if (err) throw err;
    console.log("Ingame database connection established!");
});

con2.connect(function (err) {
    if (err) throw err;
    console.log('Main database connection established!');
})

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});



client.once('ready', () => {
    console.log('Welcome to the FiveM Discord bot made by nightstudios! I hope you like it and have fun :D');
})

client.on("ready", () => {
    client.user.setPresence({
        activity: {
            name: config.activity.activity,
            type: config.activity.type
        },
        status: "online"
    })
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === `checkplayer`) {
        if (config.delete_command_usage) message.delete();

        if (args.length < 2) {
            return embeds.argEmbed('checkPlayer', trans.messages.no_args, trans.check_player.usage_2, trans.check_player.usage_1, message.channel);
        } else {
            if (message.member.roles.cache.has(config.staff_role_id, { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride }) || message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride })) {
                if (config.useName) {
                    var query = "SELECT name, phone_number, accounts FROM users WHERE `firstname` = '" + args[0] + "' AND `lastname` = '" + args[1] + "';";
                } else {
                    var query = "SELECT firstname, lastname, phone_number, accounts FROM users WHERE `firstname` = '" + args[0] + "' AND `lastname` = '" + args[1] + "';";
                }
                con.query(query, function (err, result) {
                    if (result.length == 0) {
                        return message.channel.send(trans.messages.not_found_user).then(msg => {
                            setTimeout(() => msg.delete(), 4000);
                        });
                    } else {
                        if (config.useName) {
                            embeds.sendEmbed(result[0].name, message.channel);
                        } else {
                            embeds.sendEmbed(result[0].firstname + ' ' + result[0].lastname, message.channel);
                        }
                        embeds.sendPhoneEmbed(result[0].phone_number, message.channel);
                        return embeds.sendMoneyEmbed(result[0].accounts, message.channel);
                    }
                });
                con.end()
            } else {
                embeds.permissionEmbed(client.channels.cache.get(config.log_channel), 'checkplayer', message.author);
                return message.channel.send(trans.messages.insuficient_permissions).then(msg => {
                    setTimeout(() => msg.delete(), 4000)
                })
            }
        }
    } else if (command === `checkplate`) {
        if (config.delete_command_usage) message.delete();

        if (args.length < 1) {
            return embeds.argEmbed('checkplate', trans.messages.no_args, trans.plate_check.usage_2, trans.plate_check.usage_1, message.channel);
        } else {
            if (message.member.roles.cache.has(config.staff_role_id, { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride }) || message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride })) {
                con.query('SELECT owner FROM owned_vehicles WHERE `plate` = "' + args[0] + '";', function (err, result) {
                    if (result.length == 0) {
                        return message.channel.send(trans.messages.not_found_plate).then(msg => {
                            setTimeout(() => msg.delete(), 4000);
                        });
                    } else {
                        if (config.useName) {
                            var query = "SELECT name, sex, phone_number FROM users WHERE `identifier` = '" + result[0].owner + "';";
                        } else {
                            var query = "SELECT firstname, lastname, sex, phone_number FROM users WHERE `identifier` = '" + result[0].owner + "';";
                        }
                        con.query(query, function (err, result) {
                            if (config.useName) {
                                return embeds.sendVehicleEmbed(result[0].name, result[0].sex, result[0].phone_number, args[0], message.channel);
                            } else {
                                return embeds.sendVehicleEmbed(result[0].firstname + ' ' + result[0].lastname, result[0].sex, result[0].phone_number, args[0], message.channel);
                            }
                        });
                    }
                })
                con.end()
            } else {
                embeds.permissionEmbed(client.channels.cache.get(config.log_channel), 'checkplate', message.author);
                return message.channel.send(trans.messages.insuficient_permissions).then(msg => {
                    setTimeout(() => msg.delete(), 4000)
                })
            }
        }
    } else if (command === `warn`) {
        if (config.delete_command_usage) message.delete();

        if (args.length < 2) {
            return embeds.argEmbed('warn', trans.messages.no_args, trans.warn.usage_2, trans.warn.usage_1, message.channel);
        }
        if (message.member.roles.cache.has(config.staff_role_id, { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride }) || message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride })) {

            let user = message.mentions.members.first();
            if (user.hasPermission('ADMINISTRATOR', { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride })) {
                message.channel.send(trans.messages.is_admin);
            } else { 
                args.shift()
                const reason = args.join(' ')
                con2.query("INSERT INTO warns (discord_id, reason) VALUES ('" + message.mentions.users.first().id + "', '" + reason + "');");
                con2.query("SELECT COUNT(*) AS count FROM warns WHERE `discord_id` = '" + message.mentions.users.first().id + "';", function (err, countWarns) {
                    embeds.userWarnEmbed(reason, message.author, countWarns[0].count, client.users.cache.get(message.mentions.users.first().id));
                    embeds.warnEmbed(message.mentions.users.first().id, reason, message.author, message.channel);

                    if (countWarns[0].count >= config.maximalWarns) {
                        let user = message.mentions.members.first();
                        let role = message.guild.roles.cache.get(config.muteRole);
                        user.roles.add(role);

                        message.mentions.users.first().send(trans.messages.user_muted);
                    }
                });
                con2.end()
            }
        }
    } else if (command === 'resetwarn') {
        if (config.delete_command_usage) message.delete();

        if (args.length < 1) {
            return embeds.argEmbed('resetwarn', trans.messages.no_args, trans.resetwarn.usage_2, trans.resetwarn.usage_1, message.channel);
        }
        if (message.member.roles.cache.has(config.staff_role_id, { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride }) || message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: config.adminOverride, checkOwner: config.ownerOverride })) {
            con2.query("DELETE FROM warns WHERE `discord_id` = '" + message.mentions.users.first().id + "';");
            con.end()
            embeds.resetWarns(message.mentions.users.first().id, message.author, message.channel);

            let user = message.mentions.members.first();
            let role = message.guild.roles.cache.get(config.muteRole);
            user.roles.remove(role);

        }
    }
})

client.login(config.token);
