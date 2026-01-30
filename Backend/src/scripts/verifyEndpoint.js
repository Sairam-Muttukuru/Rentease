const axios = require('axios');

async function verifyEndpoint() {
    console.log("🌐 Verifying API Endpoint...");
    const loginUrl = "http://localhost:5000/api/auth/login";
    const providersUrl = "http://localhost:5000/api/admin/providers";

    // 1. Login
    try {
        console.log("🔑 Logging in as admin@gmail.com...");
        const loginRes = await axios.post(loginUrl, {
            email: "admin@gmail.com",
            password: "admin123" // Reset via script
        });

        const token = loginRes.data.accessToken;
        console.log("✅ Login successful! Token received.");

        // 2. Fetch Providers
        console.log("📡 Fetching Providers...");
        const providerRes = await axios.get(providersUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`✅ API returned ${providerRes.data.length} providers.`);
        console.log("Data sample:", JSON.stringify(providerRes.data[0], null, 2));

    } catch (err) {
        console.error("❌ API Request Failed:");
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error("Data:", err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

verifyEndpoint();
