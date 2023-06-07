const {
  extractAndEncodeHTMLCode,
  fixMarkdownTableInText,
} = require("./modules/parseres");
const { sendMessageToPoe } = require("./modules/poe");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = "6256935640:AAH7V0TjQ6GyGqf0jGvKN00Qofu8qmQEKmw";
const bot = new TelegramBot(BOT_TOKEN, {
  polling: false,
});
const cors = require("cors");
const express = require("express");
//const { json } = require("express");

//const { message } = require("telebot/lib/updates");
const app = express();
const PORT = 5487 || process.env.PORT;

//bot.start();

app.use(cors());
app.get("/keep-alive", async function (req, res) {
  res.json({ ok: "hey sigo aqui" });
});

app.get("/disponible", async function (req, res) {
  try {
    await bot.sendMessage(247812007, "🔥 YA ESTOY DE VUELTA!", {
      parse_mode: "HTML",
    });

    await bot.sendMessage(1835590672, "🔥 YA ESTOY DE VUELTA!", {
      parse_mode: "HTML",
    });
    res.json({ noError: true });
  } catch (err) {
    res.json({ noError: false, message: err.message });
  }
});
app.post("/", express.json(), async function (req, res) {
  try {
    var requestBody = req.body;

    //por si algun perro:
    //await bot.sendMessage(requestBody.message.chat.id, "hey ");
    if (
      !(
        requestBody.message.chat.id === 247812007 ||
        requestBody.message.chat.id === 1835590672
      )
    ) {
      /* await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    }); */
      await bot.sendMessage(
        requestBody.message.chat.id,
        "This is not your bot, get out"
      );

      res.json({ status: "ok" });

      return;
    }

    var clearContext = requestBody.message.text.charAt(0) === "/";

    var messageForPoe = clearContext
      ? requestBody.message.text.slice(1)
      : requestBody.message.text;
    console.log("hola se recibio un mensaje");
    var responseFromPoe = await sendMessageToPoe(messageForPoe, clearContext);
    console.log(responseFromPoe);
    /* res.json({ msg: responseFromPoe }); */
    var textocontablasarregladas = fixMarkdownTableInText(responseFromPoe);
    var encodedMessage = extractAndEncodeHTMLCode(textocontablasarregladas);

    await bot
      .sendMessage(requestBody.message.chat.id, encodedMessage, {
        parse_mode: "HTML",
      })
      .then((r) => {
        // console.log(res);
        res.json({ msg: "This is CORS-enabled for all origins!" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ msg: "This is CORS-enabled for all origins!" });
      });
  } catch (err) {
    await bot.sendMessage(1835590672, "Ocurrio un error\n" + err.message, {
      parse_mode: "HTML",
    });
    await bot.sendMessage(247812007, "Ocurrio un error\n" + err.message, {
      parse_mode: "HTML",
    });
  }
});

app.listen(PORT, function () {
  console.log("CORS-enabled web server listening on port " + PORT);
});

bot
  .sendMessage(1835590672, "<a href='https://google.com'>Google</a>", {
    parse_mode: "HTML",
  })
  .then((res) => {
    //console.log(res)
  })
  .catch((res) => {
    //console.log(res)
  });
console.log(extractAndEncodeHTMLCode);
