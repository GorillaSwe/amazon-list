const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { scrapeAmazonWishlist } = require("./scrapeAmazonWishlist");

async function getWishlistData() {
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
    return itemList.map((item) => `${item.title}: ${item.price}円`).join("\n");
  } catch (err) {
    console.error(err);
    await browser.close();
    throw new Error("Failed to get wishlist data");
  }
}

module.exports = { getWishlistData };
