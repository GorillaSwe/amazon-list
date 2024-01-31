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

module.exports = { scrapeAmazonWishlist };
