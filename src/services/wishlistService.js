const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { scrapeWishlistItems } = require("../scrapers/scrapeWishlistItems");
const { scrapeItemDetails } = require("../scrapers/scrapeItemDetails");

async function getWishlistData() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(process.env.AMAZON_WISHLIST_URL);

    const itemList = await scrapeWishlistItems(page);
    const itemDetails = await scrapeItemDetails(page, itemList);

    return itemDetails.map(formatItemDetails).join("\n\n");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get wishlist data");
  } finally {
    await browser.close();
  }
}

function formatItemDetails(item) {
  return (
    `・${item.title}\n` +
    `Kindle Price: ${item.kindlePrice}\n` +
    `Kindle Points: ${item.kindlePoints}\n` +
    `Book Price: ${item.bookPrice}\n` +
    `Book Points: ${item.bookPoints}`
  );
}

module.exports = { getWishlistData };
