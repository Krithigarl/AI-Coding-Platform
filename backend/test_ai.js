const http = require("http");

function testEndpoint(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("--- Testing /api/ai/hint ---");
  const hintRes = await testEndpoint("/api/ai/hint", {
    code: 'name = "Krithiga"\nage = 22\nprint(name)\nprint(age',
    language: "python",
    error: "SyntaxError: '(' was never closed"
  });
  console.log("Hint Status:", hintRes.status);
  console.log("Hint Result:", JSON.stringify(hintRes.data, null, 2));

  console.log("\n--- Testing /api/ai/analyze ---");
  const analyzeRes = await testEndpoint("/api/ai/analyze", {
    code: 'name = "Krithiga"\nage = 22\nprint(name)\nprint(age',
    language: "python"
  });
  console.log("Analyze Status:", analyzeRes.status);
  console.log("Analyze Result:", JSON.stringify(analyzeRes.data, null, 2));
}

run().catch(console.error);
