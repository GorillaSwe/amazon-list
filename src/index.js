const serverless = require("serverless-http");
const express = require("express");
const { lineWebhookHandler } = require("./handlers/lineWebhookHandler");
const lineConfig = require("../config/lineConfig");
const app = express();

app.use("/webhook", require("@line/bot-sdk").middleware(lineConfig));
app.post("/webhook", lineWebhookHandler);

module.exports.handler = serverless(app);
