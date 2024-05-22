const arg = require("arg");
const fs = require("fs");
const fetch = require("node-fetch");
const Papa = require("papaparse");
const { exit } = require("process");
const { MeiliSearch } = require("meilisearch");

// const client = new MeiliSearch({
//   host: "https://ms-b9c345023e52-142.saas.meili.dev/",
//   apiKey: "f6acc25ade8958ecf46469da5e09cabb4812646b",
// });

// const index = client.index("product");

function transform(object) {
  let cleaned_object = {};
  if (object.hasOwnProperty("Uniq Id")) {
    cleaned_object["handle"] = object["Uniq Id"];
  }
  if (object.hasOwnProperty("Product Name")) {
    cleaned_object["title"] = object["Product Name"] || "Product";
  }
  if (object.hasOwnProperty("Product Description")) {
    cleaned_object["description"] = object["Product Description"];
  }
  if (object.hasOwnProperty("Product Contents")) {
    cleaned_object["contents"] = object["Product Contents"];
  }
  if (object.hasOwnProperty("Product Url")) {
    cleaned_object["url"] = object["Product Url"];
  }
  if (
    object.hasOwnProperty("Product Image Url") &&
    object["Product Image Url"] != undefined
  ) {
    const imageArr = object["Product Image Url"].split("|") ?? [];
    cleaned_object["images"] = imageArr.length > 0 ? [imageArr[0]] : [];
  }
  cleaned_object["is_giftcard"] = false;
  cleaned_object["weight"] = 400;
  if (
    object.hasOwnProperty("Product Category") &&
    object["Product Category"] != undefined
  ) {
    const category = object["Product Category"].split(" > ");
    cleaned_object["category"] = category[0];
  }
  if (object.hasOwnProperty("Product Brand")) {
    cleaned_object["brand"] = object["Product Brand"];
  }
  let price_rate = 2200;
  if (object.hasOwnProperty("Product Price")) {
    price_rate = parseInt(object["Product Price"] || "2200");
  }
  cleaned_object["options"] = [
    {
      title: "Size",
      values: ["S"],
    },
    {
      title: "Color",
      values: ["Black"],
    },
  ];
  cleaned_object["price"] = price_rate || 2200;
  cleaned_object["variants"] = [
    {
      title: "S / Black",
      prices: [
        {
          currency_code: "usd",
          amount: new Number(2200),
        },
      ],
      options: [
        {
          value: "S",
        },
        {
          value: "Black",
        },
      ],
      inventory_quantity: 100,
      manage_inventory: true,
    },
  ];
  if (object.hasOwnProperty("Product Tags")) {
    cleaned_object["tag"] = object["Product Tags"]?.split(" ")[0] || "";
  }
  if (object.hasOwnProperty("Product Rating")) {
    cleaned_object["rating"] = object["Product Rating"];
  }
  if (object.hasOwnProperty("Product Reviews Count")) {
    cleaned_object["reviews_count"] = object["Product Reviews Count"];
  }
  return cleaned_object;
}

//var tsv is the TSV file with headers
function tsvJSON(tsv) {
  var lines = tsv.split("\n");
  var result = [];
  var headers = lines[0].split("\t");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split("\t");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

(async () => {
  const args = arg({
    "--dataset-path": String,
    "--server-url": String,
    "--index-name": String,
    "--api-key": String,
    "--chunk-size": Number,
  });

  // await index.delete();

  console.log(args);

  const dataset = fs.readFileSync(args["--dataset-path"], "utf8");
  dataset_json = tsvJSON(dataset);
  // iterate over the dataset and cleanup the data

  let new_list = [];

  for (let i = 0; i < 1000; i++) {
    new_list.push(transform(dataset_json[i]));
  }

  const obj = {
    store: {
      currencies: ["eur", "usd"],
    },
    users: [
      {
        email: "shivaylamba@medusa-test.com",
        password: "supersecret",
      },
    ],
    regions: [
      {
        id: "test-region-eu",
        name: "EU",
        currency_code: "eur",
        tax_rate: 0,
        payment_providers: ["manual"],
        fulfillment_providers: ["manual"],
        countries: ["gb", "de", "dk", "se", "fr", "es", "it"],
      },
      {
        id: "test-region-na",
        name: "NA",
        currency_code: "usd",
        tax_rate: 0,
        payment_providers: ["manual"],
        fulfillment_providers: ["manual"],
        countries: ["us", "ca"],
      },
    ],
    shipping_options: [
      {
        name: "PostFake Standard",
        region_id: "test-region-eu",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        amount: 1000,
      },
      {
        name: "PostFake Express",
        region_id: "test-region-eu",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        amount: 1500,
      },
      {
        name: "PostFake Return",
        region_id: "test-region-eu",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        is_return: true,
        amount: 1000,
      },
      {
        name: "I want to return it myself",
        region_id: "test-region-eu",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        is_return: true,
        amount: 0,
      },
      {
        name: "FakeEx Standard",
        region_id: "test-region-na",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        amount: 800,
      },
      {
        name: "FakeEx Express",
        region_id: "test-region-na",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        amount: 1200,
      },
      {
        name: "FakeEx Return",
        region_id: "test-region-na",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        is_return: true,
        amount: 800,
      },
      {
        name: "I want to return it myself",
        region_id: "test-region-na",
        provider_id: "manual",
        data: {
          id: "manual-fulfillment",
        },
        price_type: "flat_rate",
        is_return: true,
        amount: 0,
      },
    ],

    products: new_list,
  };

  // console.log(dataset_json[2000]);
  // fs.writeFileSync("./test.json", dataset_json[0]);

  fs.writeFileSync("../my-medusa-store/data/m-seed.json", JSON.stringify(obj));

  // let list = [];

  // for (let i = 0; i < dataset_json.length; i++) {
  //   if (list.length > 100) {
  //     await index.addDocuments(list);
  //     console.log("Added");
  //     list = [];
  //   } else {
  //     list.push(transform(dataset_json[i]));
  //   }
  // }

  // console.log(transform(dataset_json[0]));
  // const mapList = dataset_json.map(async (data) => {
  //   await index.addDocuments(transform(data));
  // });

  // await Promise.all(mapList);

  console.log("==========================");
  console.log("Added");
})();
