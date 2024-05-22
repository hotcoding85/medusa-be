const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: "https://ms-779c6e8ff68f-12.saas-dev.meili.dev",
  apiKey: "0e9e64ec6703ce790cff92279d94fb5c7be490e9",
});

const index = client.index("medusa-product");

const fetch = async () => {
  await index.delete();
  // const product = require("../my-medusa-store/data/seed.json");
  // const productList = product.products.map((p, i) => ({
  //   ...p,
  //   id: i,
  // }));
  // console.log(product.products);
  await index.addDocuments([{ id: 1, name: "shivay" }]);
  console.log("Document Added");
};

fetch();
