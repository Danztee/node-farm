const fs = require("fs");
const http = require("http");
const url = require("url");

//---- blocking sync way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${new Date().toLocaleString()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");

// const hello = "Hello World";
// console.log(hello);

// ----blocking async way
// fs.readFile("./txt/start.txt", "utf-8", async (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", async (err, data2) => {
//     console.log(data2);
//   });
// });

// console.log("will read file");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

////////////////////////////////////
// SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%PRODUCT_FROM%}/g, product.from);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC %}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //   overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-Type": "text.html" });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    res.end(output);

    // product page
  } else if (pathName === "/product") {
    res.end("This is the product");

    // API
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    // });

    // not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log(`Listening to request on port 8000`);
});