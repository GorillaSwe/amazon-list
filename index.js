const serverless = require("serverless-http");
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");

const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

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

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  try {
    await page.goto(
      "https://www.amazon.co.jp/hz/wishlist/ls/3CKVTKBS6QK6F/ref=nav_wishlist_lists_1"
    );

    const itemList = await scrapeAmazonWishlist(page);
    console.log("Sending itemList:", itemList);

    await browser.close();
    const responseText = itemList
      .map((item) => `${item.title}: ${item.price}円`)
      .join("\n");
    console.log("Sending responseText:", responseText);

    const echo = { type: "text", text: responseText };
    console.log("Sending message:", echo);
    return client.replyMessage(event.replyToken, echo);
  } catch (err) {
    console.error(err);
    await browser.close();
    res.status(500).end();
  }
}

async function scrapeAmazonWishlist(page) {
  return await page.evaluate(async () => {
    const distance = 500;
    const delay = 100;

    while (!document.querySelector("#endOfListMarker")) {
      document.scrollingElement.scrollBy(0, distance);
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }

    const itemList = [];

    [...document.querySelectorAll('div[id^="itemMain_"]')].forEach(
      (detailDiv) => {
        const titleElement = detailDiv.querySelector('a[id^="itemName_"]');
        if (titleElement) {
          title = titleElement.textContent.trim();
        }
        let price = -1;
        const priceElement = detailDiv.querySelector("span.a-offscreen");
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          price = Number(priceText.replace("￥", "").replace(",", ""));
        }

        if (title && price !== -1) {
          itemList.push({ title, price });
        }
      }
    );

    return itemList;
  });
}

const server = serverless(app);
module.exports.handler = server;
