require("dotenv").config();

// global imports
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const path = require('path');
const fs = require('fs');
const https = require('https');

// local imports
const { cheer, waitingForGemini } = require('./features/random');
const { math } = require('./features/math');
const { getYesNo } = require('./features/yesno');
const { runGeminiPro, splitText, runGeminiProVision } = require('./features/gemini');

// create a new bot
const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// login to the bot
bot.login(process.env.BOT_TOKEN);

// notify us when bot is online
bot.on('ready', (b) => {console.log(`✅ ${b.user.username} is online!`)});

// listen for messages
bot.on('messageCreate', async (msg) => {
    // if the message is from a bot, ignore it
    if (msg.author.bot) return;

    if (msg.content === 'good boy') {
        msg.reply(cheer());
    }

    if (msg.mentions.has(bot.user.id)) {
        msg.reply(waitingForGemini());
        try {
            // UNIVERSAL
            let prompt = msg.content.replace(/<@!?\d+>/g, '').trim();
            let localPath = null;
            let mimeType = null;

            if (msg.attachments.size > 0) {
                // IF GOT IMAGE, RUN GEMINI PRO VISION
                let attachment = msg.attachments.first();
                let url = attachment.url;
                mimeType = attachment.contentType;
                let fileName = attachment.name;

                localPath = path.join(__dirname, '..', 'images', fileName);
                let file = fs.createWriteStream(localPath);
                https.get(url, (response) => {
                    response.pipe(file);
                    file.on('finish', async() => {
                        file.close(async() => {
                            try {
                                const response = await runGeminiProVision(prompt, localPath, mimeType);
                                if (response.length > 2000) {
                                    let chunks = splitText(response);
                                    chunks.forEach((chunk) => {
                                        msg.reply(chunk);                
                                    });
                                } else {
                                    msg.reply(response);
                                }
                            } catch (error) {
                                console.log(error);
                                msg.reply("Sorry, I couldn't process the image.")
                            }
                        })
                    })
                })

            } else {
                // IF NO IMAGE, RUN GEMINI PRO
                let response = await runGeminiPro(prompt);
                if (response.length > 2000) {
                    let chunks = splitText(response);
                    chunks.forEach((chunk) => {
                        msg.reply(chunk);                
                    });
                } else {
                    msg.reply(response);
                }
            }
            
        } catch (error) {
            console.log(error);
        }
    }
});

// listen for slash commands
bot.on('interactionCreate', (interaction) => {

    // if the interaction is not a command, ignore it
    if (!interaction.isChatInputCommand()) return;

    // if the command is 'hey', reply with 'hey!'
    if (interaction.commandName === 'hey') {
        interaction.reply('hey!');
    };

    // if the command is 'calculate', reply with the result of the operation
    if (interaction.commandName === 'calculate') {
        let operation = interaction.options.getString('operator');
        let num1 = interaction.options.getNumber('first-number');
        let num2 = interaction.options.getNumber('second-number');
        let result = math(operation, num1, num2);
        interaction.reply(`The result of ${num1} ${operation} ${num2} = ${result}`);
    };

    // if the command is 'yesno', reply with the result of the yesno api
    if (interaction.commandName === 'yesno') {
        let user = interaction.user.globalName;
        let question = interaction.options.getString('question');
        getYesNo()
            .then((data) => {
                const embed = new EmbedBuilder()
                    .setTitle(`${user} asked: ${question}`)
                    .setDescription(`Simon says ${data.answer}!`)
                    .setImage(data.image);
      
                    try {
                        interaction.reply({ embeds: [embed] });
                    } catch (error) {
                        console.log(error);
                    }
                })
            .catch((error) => {
                console.error('Error:', error);
            }
        );
    }
});