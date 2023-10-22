const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 501;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.it2xzvi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db('productDB').collection('product');
        const cartDataCollection = client.db("productDB").collection("cart")

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //product related post
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            console.log(newProducts);
            const result = await productCollection.insertOne(newProducts)
            res.send(result);
        })

        //product related get
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

// name, brandName, type, description, price, rating, image

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateProduct = req.body;
            const newProduct = {
              $set: {
                name: updateProduct.name,
                image: updateProduct.image,
                brandName: updateProduct.brandName,
                description: updateProduct.description,
                price: updateProduct.price,
                rating: updateProduct.rating,
                type: updateProduct.type,
              },
            }
            const result = await productCollection.updateOne(query, newProduct, options)
            res.send(result)
          })

          //cart operation
          app.post("/cart", async(req, res)=> {
            const cart = req.body;
            const result = await cartDataCollection.insertOne(cart)
            res.send(result)
      
          })
          app.get("/cart", async(req, res) => {
            const cursor = cartDataCollection.find()
            const result = await cursor.toArray()
            res.send(result);
      
          })

          app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await cartDataCollection.deleteOne(query)
            console.log(id);
            res.send(result)
          })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Assignment server is running");
})


app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})

