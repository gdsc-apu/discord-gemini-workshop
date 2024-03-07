require('dotenv').config();

// global import
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'reply with hey!',
    },
    {
        name: 'yesno',
        description: 'reply with a random yes or no answer',
        options: [
            {
                name: 'question',
                description: 'ask a yes or no question',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
    },
    {
        name: 'calculate',
        description: 'perform basic math operations',
        options: [
            {
                name: 'operator',
                description: 'type of math operation',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'add',
                        value: '+',
                    },
                    {
                        name: 'subtract',
                        value: '-',
                    },
                    {
                        name: 'multiply',
                        value: '*',
                    },
                    {
                        name: 'divide',
                        value: '/',
                    },
                ],
            },
            {
                name: 'first-number',
                description: 'enter your first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'second-number',
                description: 'enter your second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ],
    },
];

const rest = new REST({version: '10'}).setToken(process.env.BOT_TOKEN);

// IIFE
( async () => {
    try {
        console.log('Registering commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.BOT_ID, process.env.SERVER_ID),
            { body: commands },
        );
        console.log('successfully registered slash commands!')
    } catch (error) {
        console.log(error);
    }
})();