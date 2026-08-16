require("dotenv").config();

const axios = require("axios");

async function testProductHunt() {
  try {
    const response = await axios.post(
      "https://api.producthunt.com/v2/api/graphql",
      {
        query: `
          query {
            posts(first: 5) {
              nodes {
                id
                name
                tagline
                url
              }
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Product Hunt API Connected!");
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log("❌ Product Hunt API Error:");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

testProductHunt();