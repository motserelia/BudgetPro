const functions = require("firebase-functions");
const admin = require("firebase-admin");
const webPush = require("web-push");
const cors = require("cors");

admin.initializeApp();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webPush.setVapidDetails(
    process.env.VAPID_CONTACT_EMAIL || "mailto:change-me@example.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey,
  );
}

const corsHandler = cors({ origin: "https://motserelia.github.io" });

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      return res.status(500).send("Push is not configured");
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { subscription, title, body, icon, tag, vibrate } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).send("Invalid subscription");
    }

    const payload = JSON.stringify({
      title: title || "БюджетPRO",
      body: body || "Напоминание",
      icon: icon || "/favicon-96x96.png",
      tag: tag || "budget-reminder",
      requireInteraction: true,
      vibrate: vibrate || [200, 100, 200, 100, 200],
      data: { url: "/" },
    });

    try {
      await webPush.sendNotification(subscription, payload);
      console.log("Push notification sent successfully");
      return res.status(200).send("OK");
    } catch (error) {
      console.error("Push notification failed:", error);
      return res.status(500).send("Error sending notification");
    }
  });
});
