const webPush = require("web-push");

const vapidKeys = {
  publicKey: "BP3G45BX8XQI3DxEsYYyu4lKm5l-gpoJbuEWfYfdYGwdDGocfryIR9wZrz7ztmDxZ_-AQJpOLyjIJ2yHgIQJjjk",
  privateKey: "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg1Xbq89vPY4cSTyVPtdJ7Hl4DI4FrudSPBOJLV0me_z2hRANCAAT9xuOQV_F0CNw8RLGGMruJSpuZfoKaCW7hFn2H3WBsHQxqHH68iEfcGa8-87Zg8Wf_gECaTi8oyCdsh4CECY45"
};

webPush.setVapidDetails(
  "mailto:motserelia92@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { subscription, title, body: msgBody, icon, tag, vibrate } = body;

    if (!subscription || !subscription.endpoint) {
      return { statusCode: 400, headers, body: "Invalid subscription" };
    }

    const payload = JSON.stringify({
      title: title || "БюджетPRO",
      body: msgBody || "Напоминание",
      icon: icon || "/favicon-96x96.png",
      tag: tag || "budget-reminder",
      requireInteraction: true,
      vibrate: vibrate || [200, 100, 200, 100, 200],
      data: { url: "/" }
    });

    await webPush.sendNotification(subscription, payload);
    console.log("Push notification sent successfully");
    return { statusCode: 200, headers, body: "OK" };
  } catch (error) {
    console.error("Push notification failed:", error);
    return { statusCode: 500, headers, body: "Error sending notification" };
  }
};
