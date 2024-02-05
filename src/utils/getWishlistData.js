const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { scrapeAmazonWishlist } = require("./scrapeAmazonWishlist");
const { scrapeItemDetail } = require("./scrapeItemDetail");

async function getWishlistData() {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(process.env.AMAZON_WISHLIST_URL);

    const itemList = await scrapeAmazonWishlist(page);
    const itemDetails = await scrapeItemDetail(page, itemList);

    await browser.close();

    const formattedItems = itemDetails.map(formatItemDetails).join("\n\n");
    return formattedItems;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get wishlist data");
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
