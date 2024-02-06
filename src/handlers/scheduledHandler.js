const { getWishlistData } = require("../services/wishlistService");
const { sendMessage } = require("../utils/messageSender");

async function handleScheduledEvent() {
  try {
    const responseText = await getWishlistData();
    await sendMessage(responseText, process.env.USER_ID);
  } catch (err) {
    console.error("Failed to handle scheduled event:", err);
  }
}

module.exports = { handleScheduledEvent };
