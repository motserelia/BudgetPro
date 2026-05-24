const webPush = require("web-push");

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
    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      return { statusCode: 500, headers, body: "Push is not configured" };
    }

    const body = JSON.parse(event.body);
    const { subscription, title, body: msgBody, icon, tag, vibrate } = body;

    if (!subscription || !subscription.endpoint) {
      return { statusCode: 400, headers, body: "Invalid subscription" };
    }

    const payload = JSON.stringify({
      title: title || "БюджетPRO",
      body: msgBody || "Напоминание",
      icon: icon || "/BudgetPro/favicon-96x96.png",
      tag: tag || "budget-reminder",
      requireInteraction: true,
      vibrate: vibrate || [200, 100, 200, 100, 200],
      data: { url: "/BudgetPro/" },
    });

    await webPush.sendNotification(subscription, payload);
    console.log("Push notification sent successfully");
    return { statusCode: 200, headers, body: "OK" };
  } catch (error) {
    console.error("Push notification failed:", error);
    return { statusCode: 500, headers, body: "Error sending notification" };
  }
};
