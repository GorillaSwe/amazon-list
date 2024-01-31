const serverless = require("serverless-http");
const express = require("express");
const app = express();
const { handleEvent } = require("./handlers/webhookHandler");
const lineConfig = require("../config/lineConfig");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use("/webhook", require("@line/bot-sdk").middleware(lineConfig));
app.post("/webhook", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const server = serverless(app);
module.exports.handler = server;
