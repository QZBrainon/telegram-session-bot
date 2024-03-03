const TelegramBot = require("node-telegram-bot-api");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../database.db");
const { startResponse } = require("../responses/start");
const insertUser = require("../queries/insertUser");
const selectUser = require("../queries/selectUser");
// const updateUserTOS = require("../queries/updateUserTOS");
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message. There are different kinds of
// messages.
bot.onText(/^\/start$/, async (msg) => {
  const user = await selectUser(msg.from.id);
  if (user) {
    const now = new Date();
    const currentHour = now.getHours();
    const chatId = msg.chat.id;
    // Define the message based on the current hour
    let greeting;
    if (currentHour < 12) {
      greeting = "Bom dia!";
    } else if (currentHour < 18) {
      greeting = "Boa tarde!";
    } else {
      greeting = "Boa noite!";
    }
    const keyboard = {
      inline_keyboard: [
        [{ text: "Exibir perfil 📱", callback_data: "profile" }],
        [{ text: "Tabelas de valores 📊", callback_data: "values" }],
        [{ text: "Comprar session 📦", callback_data: "buy_session" }],
        [{ text: "Adicionar saldo 🏦", callback_data: "add_funds" }],
        [{ text: "Preciso de ajuda 🧑‍🔧", callback_data: "help" }],
      ],
    };
    bot.sendMessage(
      chatId,
      `${greeting} ${msg.from.first_name}. Como posso ajudar?`,
      {
        reply_markup: keyboard,
      }
    );
  } else {
    await insertUser(msg.from.id, msg.from.first_name)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    const chatId = msg.chat.id;
    const keyboard = {
      inline_keyboard: [
        [{ text: "Concordo ✅", callback_data: "agree" }],
        [{ text: "Não concordo ❌", callback_data: "decline" }],
      ],
    };

    bot.sendMessage(chatId, startResponse, {
      reply_markup: keyboard,
    });
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const option = query.data;
  const date = new Date();
  console.log(query);
  // Format the date to a human-readable string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Create a formatted date string
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  // Respond based on the option clicked
  if (option === "agree") {
    // updateUserTOS(query.from.id);
    bot.sendMessage(
      chatId,
      `Eu, ${query.from.first_name} portador do TELEGRAM ID ${query.from.id} concordei com os termos acima em ${formattedDate}`
    );
  } else if (option === "decline") {
    bot.sendMessage(
      chatId,
      "Você precisa concordar com os termos para prosseguir"
    );
  }
});
