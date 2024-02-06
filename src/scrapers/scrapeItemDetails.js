async function scrapeItemDetails(page, items) {
  const itemDetails = [];

  for (const item of items) {
    const details = await getItemDetails(page, item);
    itemDetails.push({ ...item, ...details });
  }

  return itemDetails;
}

async function getItemDetails(page, item) {
  await page.goto(item.href);
  const details = await page.evaluate(() => {
    const getTextContent = (selector) =>
      document
        .querySelector(selector)
        ?.textContent.trim()
        .replace("(", "")
        .replace(")", "") || null;

    const kindlePrice = getTextContent(
      "#tmm-grid-swatch-KINDLE .slot-price > span"
    );
    const kindlePoints = getTextContent(
      "#tmm-grid-swatch-KINDLE .slot-buyingPoints > span"
    );

    const paperbackOrHardcoverSelector = document.querySelector(
      "#tmm-grid-swatch-PAPERBACK"
    )
      ? "#tmm-grid-swatch-PAPERBACK"
      : "#tmm-grid-swatch-HARDCOVER";
    const bookPrice = getTextContent(
      `${paperbackOrHardcoverSelector} .slot-price > span`
    );
    const bookPoints = getTextContent(
      `${paperbackOrHardcoverSelector} .slot-buyingPoints > span`
    );

    return { kindlePrice, kindlePoints, bookPrice, bookPoints };
  });

  return details;
}

module.exports = { scrapeItemDetails };
