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
        let title = "";
        let href = "";
        if (titleElement) {
          title = titleElement.textContent.trim();
          href = titleElement.href;
        }

        if (title && href) {
          itemList.push({ title, href });
        }
      }
    );

    return itemList;
  });
}

module.exports = { scrapeAmazonWishlist };
