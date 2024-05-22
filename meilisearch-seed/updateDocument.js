const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: "https://ms-b9c345023e52-142.saas.meili.dev",
  apiKey: "f6acc25ade8958ecf46469da5e09cabb4812646b",
});

(async () => {
  // const index = client.index("products");
  // const index1 = client.index("product");
  // await index.delete();
  // await index1.delete();
  const index = client.index("products");
  const docs = await index.getDocuments({ limit: 1000 });
  console.log(docs[0].variants[0].prices);
  console.log(docs[0].variants[0].options);
  // const docList = docs.map((doc) => {
  //   return {
  //     id: doc.id,
  //     price:
  //       doc.variants[0]?.prices[0]?.amount === '""'
  //         ? new Number(1)
  //         : new Number(doc.variants[0]?.prices[0]?.amount),
  //   };
  // });
  // await index.updateDocuments(docList);
  console.log("Document Updated ");
})();
