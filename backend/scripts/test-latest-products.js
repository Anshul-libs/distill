require("dotenv").config();

const { getLatestProducts } = require("../services/productHuntService");

async function test() {
  try {
    const products = await getLatestProducts(10);

    console.log("\n🔥 LATEST PRODUCT HUNT PRODUCTS\n");
    
    products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Tagline: ${product.tagline}`);
  console.log(`   Product Hunt: ${product.productHuntUrl}`);
  console.log(`   Website: ${product.websiteUrl}`);
  console.log(`   Created: ${product.createdAt}`);
  console.log("------------------------------------");
});

  } catch (error) {
    console.error("❌ Error fetching products:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

test();