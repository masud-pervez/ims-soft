/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import jwt from "jsonwebtoken";

async function verifyUsersApi() {
  console.log("🔍 Verifying Users API...");

  // 1. Mock Authentication
  const secret = process.env.JWT_SECRET || "default_secret_please_change";
  // The API expects a token with at least { userId, role }
  const token = jwt.sign(
    { userId: "seed-user-id", role: "SUPER_ADMIN" },
    secret
  );

  console.log(`🔑 Generated Test Token: ${token.substring(0, 20)}...`);

  // 2. Call the API
  const url = "http://localhost:3000/api/users";
  console.log(`📡 Fetching ${url}...`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API call successful!");
      console.log(`📦 Received ${data.length} users.`);
      if (data.length > 0) {
        console.log("👤 Sample User:", {
          name: data[0].name,
          email: data[0].email,
          role: data[0].role,
        });
      }
    } else {
      console.error(
        `❌ API call failed: ${response.status} ${response.statusText}`
      );
      const text = await response.text();
      console.error(`   Response: ${text}`);
    }
  } catch (error: any) {
    console.error("❌ Network error:", error.message);
    console.log("⚠️  Make sure 'npm run dev' is running on port 3000.");
  }
}

verifyUsersApi();
