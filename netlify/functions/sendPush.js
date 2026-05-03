exports.handler = async (event) => {
  // Разрешаем CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Ответ на предзапрос OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Принимаем только POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    // Пока просто записываем запрос в лог Netlify и возвращаем OK
    console.log("Push notification requested:", body);
    return { statusCode: 200, headers, body: "Function is alive! Push not sent yet." };
  } catch (error) {
    console.error("Error parsing body:", error);
    return { statusCode: 500, headers, body: "Invalid JSON" };
  }
};
