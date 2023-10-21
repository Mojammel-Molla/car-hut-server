const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xljmjxf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();
    const productCollection = client.db('productDB').collection('product');

    const cartCollection = client.db('productDB').collection('cart');

    // post data of product
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // add data to cart
    app.post('/cart', async (req, res) => {
      const cartData = req.body;
      console.log(cartData);
      const result = await cartCollection.insertOne(cartData);
      res.send(result);
    });

    // app.get('/cart/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const result = await cartCollection.findOne({
    //     _id: id,
    //   });
    //   res.send(result);
    // });
    app.get('/cart', async (req, res) => {
      const result = await cartCollection.find({}).toArray();
      res.send(result);
    });

    // // Product delete from cart
    // app.delete('/cart/id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await cartCollection.deleteOne(query);
    //   res.send(result);
    // });

    // get single product by id
    app.get('/product/:id', async (req, res) => {
      const result = await productCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    // get data for update product
    app.get('/update/:id', async (req, res) => {
      const result = await productCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // update product data
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const product = {
        $set: {
          brand: updatedProduct.name,
          model: updatedProduct.model,
          photo: updatedProduct.photo,
          price: updatedProduct.price,
          category: updatedProduct.category,
          rating: updatedProduct.rating,
          description: updatedProduct.description,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });
    // get data of brands
    app.get('/products', async (req, res) => {
      const cursor = await productCollection.find({}).toArray();
      res.send(cursor);
    });

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Car brands server is running');
});

app.listen(port, () => {
  console.log(`Car brand server port is  ${port}`);
});
