const { getWishlistData } = require("../utils/getWishlistData");
const { sendMessage } = require("../utils/messageSender");
const USER_ID = process.env.USER_ID;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

async function handleScheduledEvent() {
  try {
    const responseText = await getWishlistData();
    await sendMessage(responseText, USER_ID);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { handleScheduledEvent };
