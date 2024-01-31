const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { scrapeAmazonWishlist } = require("../utils/scrapeAmazonWishlist");
const line = require("@line/bot-sdk");
const lineConfig = require("../../config/lineConfig");

const client = new line.Client(lineConfig);

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
    await page.goto(process.env.AMAZON_WISHLIST_URL);

    const itemList = await scrapeAmazonWishlist(page);

    await browser.close();
    const responseText = itemList
      .map((item) => `${item.title}: ${item.price}円`)
      .join("\n");

    const echo = { type: "text", text: responseText };
    return client.replyMessage(event.replyToken, echo);
  } catch (err) {
    console.error(err);
    await browser.close();
    res.status(500).end();
  }
}

module.exports = { handleEvent };
