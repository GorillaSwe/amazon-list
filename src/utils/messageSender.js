const line = require("@line/bot-sdk");
const lineConfig = require("../../config/lineConfig");
const client = new line.Client(lineConfig);

async function sendMessage(text, recipient) {
  const message = { type: "text", text };
  if (recipient.replyToken) {
    return client.replyMessage(recipient.replyToken, message);
  } else {
    return client.pushMessage(recipient, message);
  }
}

module.exports = { sendMessage };
