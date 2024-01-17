const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xevudqv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    // DataBase Name
    const database = client.db("eduToysDB");
    const productsDB = database.collection("products");

    // API Create
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/cars", async (req, res) => {
      const query = { categoryID: "cars" };
      const result = await productsDB.find(query).toArray();
      res.send(result);
    });

    app.get("/trucks", async (req, res) => {
      const query = { categoryID: "trucks" };
      const result = await productsDB.find(query).toArray();
      res.send(result);
    });

    app.get("/airplane", async (req, res) => {
      const query = { categoryID: "airplanes" };
      const result = await productsDB.find(query).toArray();
      res.send(result);
    });

    app.get("/bikes", async (req, res) => {
      const query = { categoryID: "bikes" };
      const result = await productsDB.find(query).toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsDB.findOne(query);
      res.send(result);
    });

    // Add New Toy
    app.post("/addnewtoy", async (req, res) => {
      const toy = req.body;
      const result = await productsDB.insertOne(toy);
      res.send(result);
    });

    // Total Product
    app.get('/totalproduct', async(req, res) => {
      const total = await productsDB.estimatedDocumentCount();
      res.send({total})
    })

    // All Toys
    app.get("/products", async (req, res) => {
      const {page, limit} = req.query;
      const pageNumber = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 8;
      const skip = (pageNumber - 1) * itemsPerPage;
      const result = await productsDB.find().skip(skip).limit(itemsPerPage).toArray();
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port);
