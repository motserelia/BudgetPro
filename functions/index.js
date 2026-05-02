const functions = require("firebase-functions");
const admin = require("firebase-admin");
const webPush = require("web-push");

admin.initializeApp();

// Настройка VAPID-ключей (публичный и приватный)
const vapidKeys = {
  publicKey: "BP3G45BX8XQI3DxEsYYyu4lKm5l-gpoJbuEWfYfdYGwdDGocfryIR9wZrz7ztmDxZ_-AQJpOLyjIJ2yHgIQJjjk",
  privateKey: "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg1Xbq89vPY4cSTyVPtdJ7Hl4DI4FrudSPBOJLV0me_z2hRANCAAT9xuOQV_F0CNw8RLGGMruJSpuZfoKaCW7hFn2H3WBsHQxqHH68iEfcGa8-87Zg8Wf_gECaTi8oyCdsh4CECY45"
};

webPush.setVapidDetails(
  "mailto:motserelia92@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Функция с ЯВНЫМИ CORS-заголовками и обработкой OPTIONS
exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
  // Разрешаем запросы со всех источников
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // На предзапрос OPTIONS сразу отвечаем 204 (No Content)
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
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
    icon: icon || "/BudgetPro/favicon-96x96.png",
    tag: tag || "budget-reminder",
    requireInteraction: true,
    vibrate: vibrate || [200, 100, 200, 100, 200],
    data: {
      url: "/BudgetPro/"
    }
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
