const { getWishlistData } = require("../services/wishlistService");
const { sendMessage } = require("../utils/messageSender");

exports.lineWebhookHandler = async (req, res) => {
  try {
    const responsePromises = req.body.events.map(async (event) => {
      if (event.type !== "message") return null;
      const responseText = await getWishlistData();
      return await sendMessage(responseText, { replyToken: event.replyToken });
    });

    const results = await Promise.all(responsePromises);
    res.json({ success: true, results });
  } catch (err) {
    console.error("Error handling webhook event:", err);
    res.status(500).send("Error processing request");
  }
};
