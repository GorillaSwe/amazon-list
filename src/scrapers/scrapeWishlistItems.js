async function scrapeWishlistItems(page) {
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
    document.querySelectorAll('div[id^="itemMain_"]').forEach((detailDiv) => {
      const titleElement = detailDiv.querySelector('a[id^="itemName_"]');
      if (titleElement) {
        const title = titleElement.textContent.trim();
        const href = titleElement.href;
        itemList.push({ title, href });
      }
    });

    return itemList;
  });
}

module.exports = { scrapeWishlistItems };
