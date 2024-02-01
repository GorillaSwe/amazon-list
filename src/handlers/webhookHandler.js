const { getWishlistData } = require("../utils/getWishlistData");
const { sendMessage } = require("../utils/messageSender");

async function handleWebhookEvent(event) {
  if (event.type !== "message") return Promise.resolve(null);

  try {
    const responseText = await getWishlistData();
    await sendMessage(responseText, { replyToken: event.replyToken });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { handleWebhookEvent };
