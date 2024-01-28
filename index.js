const serverless = require("serverless-http");
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");

const puppeteer = require("puppeteer");
require("dotenv").config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
app.use("/webhook", line.middleware(config));

app.post("/webhook", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  const echo = { type: "text", text: event.message.text };
  return client.replyMessage(event.replyToken, echo);
}

const server = serverless(app);
module.exports.handler = server;
