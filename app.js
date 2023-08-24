import TelegramBot from "node-telegram-bot-api";
import express from 'express';
const token = '6373300914:AAFsqKHPhJdNmccjyRPpH8zQb1CkwBpi-yQ';
const bot = new TelegramBot(token, {polling: true});

const app = express()
app.get('/', (req, res) => {
    res.send('Hello')
})
app.listen(3336, console.log('server is running'))

bot.setMyCommands([
    {
       command: '/start',
       description: 'Boshlash' 
    },
    {
        command: '/books',
        description: `Yangi kitoblar(pdf)` 
    },
    {
        command: '/bot_info',
        description: `Bot ma'lumotlari` 
    },
])

const books_list = {
    reply_markup : {
        inline_keyboard : [
            [
                {
                    text: `English Grammer In Use Fifth Edition`,
                    callback_data: `English_Grammer`
                },
            ],
            [
                {
                    text: `Essential English Grammer in Use`,
                    callback_data: `Essential_English_Grammer`
                }
            ]
        ],
    }
}

bot.on('message', async msg => {
    const text = msg.text;
    const chatid = msg.chat.id;

    if(text === '/start') {
        return bot.sendMessage(chatid, `Salom ${msg.from.first_name} xush kelibsiz!`)
    }
    if(text === '/bot_info') {
        return bot.sendMessage(chatid, `Bu bot Rayimberdiyev Hojiakbar(XDEV, HOJI) tomonidan yaratilgan GREAT TRANSLATORS ENGLISH CULB o'quvchilarni o'rganish darajasini oshirish uchun yaratilgan. Agarda botga qo'shimcha kiritishni istasangiz tortinmay https://t.me/rayimberdiyev_08 murojot qiling!`)
    }
    if(text === '/books') {
       return bot.sendMessage(chatid, `Yangi kitoblar(pdf)`, books_list)
    }
    return bot.sendMessage(chatid, `Bunday buyuruq yo'q`)
})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatid = msg.message.chat.id; 
    console.log(data)   
    if (data === 'English_Grammer') {
        bot.sendMessage(chatid, 'Iltimos kuting!');
        await bot.sendDocument(chatid, './English_Grammar_5.pdf');
    } else if (data === 'Essential_English_Grammer') {
        bot.sendMessage(chatid, 'Iltimos kuting!');
        await bot.sendDocument(chatid, './Essential-Grammar-in-Use.pdf');
    } 
});

 