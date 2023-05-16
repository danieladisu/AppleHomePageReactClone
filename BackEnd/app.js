/** @format */

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

// Create a single connection to the MySQL database
const myConnection = mysql.createConnection({
  host: "localhost",
  user: "appledbuser",
  password: "appledbuser",
  database: "appledb",
});

// Connect to the database
myConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Middleware to extract info from the HTML name attribute
app.use(express.urlencoded({ extended: true }));

// Middleware to extract info from the frontend that are sent through JSON
app.use(express.json());

// Configure CORS to allow requests from http://localhost:3000
// const corsOptions = {
//   origin: "http://localhost:3000",
// };
// app.use(cors(corsOptions));
app.use(cors());

// ========== createTable function ===========//
function createTable() {
  // Route: / create-table => To create the tables
  app.get("/createTable", (req, res) => {
    // // putting Query on a variable

    let products = `CREATE TABLE if not exists products(
        product_id int auto_increment,
          product_name  VARCHAR(255) not null,
          product_url VARCHAR(255) not null,
          PRIMARY KEY (product_id)
        )`;

    //

    let ProductPrice = `CREATE TABLE if not exists
  ProductPrice
  (
      price_id int auto_increment,

      product_id int(10) not null,

      starting_price VARCHAR(255) not null,

      price_range VARCHAR(255) not null,

      PRIMARY KEY (Price_id),
      FOREIGN KEY (product_id) REFERENCES products (product_id)
    )`;

    //

    let ProductDescription = `CREATE TABLE if not exists
    ProductDescription(
        description_id int auto_increment,

        product_id  int(11) not null,

        briefDescription VARCHAR(255) not null,

        productDescription VARCHAR(3000) not null,

        imgPath VARCHAR(255) not null,

        product_link VARCHAR(255) not null,

        PRIMARY KEY (description_id),

        FOREIGN KEY (product_id) REFERENCES products(product_id)
      )`;

    // EXEcuting the query's
    Promise.all([
      myConnection.query(products),
      myConnection.query(ProductPrice),
      myConnection.query(ProductDescription),
    ]).then(() => {
      res.end(`Tables Created `);
      console.log("Tables Created");
    });
  });
  // // // ======================= Listener and port ======================//

  const port1 = 1010;
  app.listen(port1, () => {
    console.log(
      "Listening on port ==> http://localhost:" + port1 + "/createTable"
    );
  });
}
createTable();

// =============== Insert Info Dynamically ============= //
function insertProductsInfo() {
  app.post("/insert-product", (req, res) => {
    console.log("Request body:", req.body);
    const {
      product_name,
      product_url,
      StartPrice,
      priceRange,
      briefDescription,
      fullDescription,
      imgPath,
      product_link,
    } = req.body;

    // Insert Product Name and product url
    const insertProduct = `INSERT INTO products (product_name, product_url) VALUES (?, ?)`;
    myConnection.query(
      insertProduct,
      [product_name, product_url],
      (err, results, fields) => {
        if (err) {
          console.log(`Error Found: ${err}`);
          return res.status(500).end();
        }

        console.log("Product Name and product url are inserted Dynamics");

        // ================ Select =========================

        // Select the inserted product to get the product_id
        const selectProduct = `SELECT * FROM products WHERE product_name = ? ORDER BY product_id DESC`;
        myConnection.query(
          selectProduct,
          [product_name],
          (err, rows, fields) => {
            if (err) {
              console.log(`Error Found: ${err}`);
              return res.status(500).end();
            }
            // Check if Product was found
            if (rows && rows.length == 0) {
              console.log("User not found");
              return res.status(404).end();
            }

            const productID = rows[0].product_id;

            // Insert Product Price
            const insertProductPrice = `INSERT INTO productPrice (product_id, starting_price, price_range) VALUES (?, ?, ?)`;
            myConnection.query(
              insertProductPrice,
              [productID, StartPrice, priceRange],
              (err, results, fields) => {
                if (err) {
                  console.log(`Error Found: ${err}`);
                  return res.status(500).end();
                }

                console.log("Product Price inserted Dynamics");

                // Insert Product Description
                const insertProductDescription = `INSERT INTO ProductDescription (product_id, briefDescription, productDescription, imgPath, product_link) VALUES (?, ?, ?, ?, ?)`;
                myConnection.query(
                  insertProductDescription,
                  [
                    productID,
                    briefDescription,
                    fullDescription,
                    imgPath,
                    product_link,
                  ],
                  (err, results, fields) => {
                    if (err) {
                      console.log(`Error Found: ${err}`);
                      return res.status(500).end();
                    }

                    console.log("Product Description inserted Dynamics");
                  }
                );
              }
            );
          }
        );
      }
    );
  });

  // // // ======================= Listener and port ======================//

  const port = 3030;
  app.listen(port, () => {
    console.log(
      "Listening on port ==> http://localhost:" + port + "/insert-product"
    );
  });
}
insertProductsInfo();

// // // ==================== Customers detail info ===================//
function iphones() {
  app.get("/iphones", (req, res) => {
    myConnection.query(
      `SELECT *
    FROM products
    JOIN productDescription ON products.product_id = productDescription.product_id
    JOIN productPrice ON products.product_id = productPrice.product_id`,
      (err, results) => {
        // let iphones = { products: [] };
        // iphones.products = results;
        // let stringiphones = JSON.stringify(iphones);
        if (err) console.log("Error During selection", err);
        res.json({ products: results });
      }
    );
  });
  // // // ======================= Listener and port ======================//

  const port = 200;
  app.listen(port, () => {
    console.log("Listening on port ==> http://localhost:" + port + "/iphones");
  });
}
iphones();
