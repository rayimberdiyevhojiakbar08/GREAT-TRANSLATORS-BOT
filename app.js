import TelegramBot from "node-telegram-bot-api";
import http from 'http';
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()
http.createServer((_, res) => res.end("Alive!")).listen(3349);

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const commands = [
    {
        command: '/start',
        description: 'Boshlash'
    },
    {
        command: '/books',
        description: `Yangi kitoblar(pdf)`
    },
    {
        command: '/save_my_id',
        description: `Bot yangiliklaridan habardor bo'lish uchun bosing`
    },
    {
        command: '/bot_info',
        description: `Bot ma'lumotlari`
    }
];

bot.setMyCommands(commands);

const booksList = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: `English Grammar In Use Fifth Edition`,
                    callback_data: `English_Grammar`
                },
            ],
            [
                {
                    text: `Essential English Grammar in Use`,
                    callback_data: `Essential_English_Grammar`
                }
            ]
        ]
    }
};

const takeIdsButton = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: `Chat IDni kiriting!`,
                    callback_data: `take_id`
                },
            ]
        ]
    }
};

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        return bot.sendMessage(chatId, `Salom ${msg.from.first_name} xush kelibsiz!`, takeIdsButton);
    } else if (text === '/bot_info') {
        return bot.sendMessage(chatId, `Bu bot Rayimberdiyev Hojiakbar (XDEV, HOJI) tomonidan yaratilgan GREAT TRANSLATORS ENGLISH CLUB o'quvchilarni o'rganish darajasini oshirish uchun yaratilgan. Agar botga qo'shimcha ma'lumot qo'shmoqchi bo'lsangiz,  https://t.me/rayimberdiyev_08 ga murojaat qiling!`, takeIdsButton);
    } else if (text === '/books') {
        return bot.sendMessage(chatId, `Yangi kitoblar (pdf)`, booksList);
    } else if (text === '/save_my_id') {
        saveId(chatId);
    } else if (text.startsWith('/sendmessagetoall ')) {
        if (chatId === 5234170961) {
            const messageToSend = text.replace('/sendmessagetoall ', '');
            sendMessageAll(messageToSend);
        } else {
            bot.sendMessage(chatId, 'Sizga bunday buyruqni berishga ruxsat yo\'q.', takeIdsButton);
        }
    } else {
        if (chatIds.includes(chatId)) {
            // Foydalanuvchidan kelgan chat ID bo'lsa
        } else {
            bot.sendMessage(chatId, `Bunday buyruq mavjud emas.`, takeIdsButton);
        }
    }
});

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    
    if (data === 'English_Grammar') {
        await bot.sendDocument(chatId, 'https://library.samdu.uz/files/8dce2388e8dd7fae08609ded2ce3477e_English%20Grammar.pdf');
    } else if (data === 'Essential_English_Grammar') {
        await bot.sendDocument(chatId, 'https://hasanboy.uz/wp-content/uploads/2017/11/Essential-Grammar-in-Use.pdf');
    } else if (data === 'take_id') {
        saveId(chatId);
    }
});

const chatIds = [6014213737,6207716858,5234170961];
async function saveId(chatId) {
    if (!chatIds.includes(chatId)) {
        chatIds.push(chatId);
        const chatIdsString = JSON.stringify(chatIds);
        fs.writeFile('chatIds.txt', chatIdsString, err => {
            if (err) {
                console.error('Chat ID larni saqlashda xatolik yuz berdi:', err);
            } else {
                console.log('Chat ID lar faylga saqlandi.');
            }
        });
        console.log(chatIds);

        const duplicateIds = chatIds.filter(id => chatIds.indexOf(id) !== chatIds.lastIndexOf(id));
        if (duplicateIds.length > 0) {
            await bot.sendMessage(chatId, 'Sizning chat IDingiz ro\'yxatda mavjud.');
        } else {
            await bot.sendMessage(chatId, 'Chat IDingiz muvaffaqiyatli saqlandi.');
        }
    } else {
        await bot.sendMessage(chatId, 'Sizning chat IDingiz allaqachon saqlangan.');
    }
}

async function sendMessageAll(message) {
    chatIds.forEach(id => {
        bot.sendMessage(id, message);
    });
}
