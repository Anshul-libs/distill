require("dotenv").config();

const axios = require("axios");

async function testTrending() {
  try {
    console.log("\n🔥 TESTING TRENDING API...\n");

    const response = await axios.get(
      "http://localhost:5000/api/trending"
    );

    console.log("✅ API STATUS:", response.status);
    console.log("📊 TOTAL TRENDING TOOLS:", response.data.count);

    console.log("\n🔥 TRENDING PRODUCTS:\n");

    response.data.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.tool_name}`);
      console.log(`   Category: ${tool.category}`);
      console.log(`   Description: ${tool.description}`);
      console.log(`   Source: ${tool.source}`);
      console.log(`   Trending: ${tool.is_trending}`);
      console.log("------------------------------------");
    });

  } catch (error) {
    console.error("\n❌ TRENDING API ERROR:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testTrending();