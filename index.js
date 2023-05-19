const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Pass}@cluster11.9w9o26r.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    const database = client.db("Toys");
    const toysCollection = database.collection("toysCollection");

    app.get('/allToys', async(req, res)=>{
      const body =  toysCollection.find();
      const result = await body.toArray();
      res.send(result)
    })
    app.get('/myToys/:email', async(req, res)=>{
        
      const data = await toysCollection.find({email: req.params.email}).toArray();
      res.send(data)
    })
    app.get('/allToys/:name', async(req, res)=>{
        
      const data = await toysCollection.find({name: req.params.name}).toArray();
      res.send(data)
    })
    app.get('/home/:category', async(req, res)=>{
        
      const data = await toysCollection.find({category: req.params.category}).toArray();
      res.send(data)
    })
    app.get('/details/:id', async(req, res)=>{
      const query = {_id: new ObjectId(req.params.id)}
      const data = await toysCollection.findOne(query);
      res.send(data)
    })
    app.get('/update/:id', async(req, res)=>{
      const query = {_id: new ObjectId(req.params.id)}
      const data = await toysCollection.findOne(query);
      res.send(data)
    })
    app.patch('/update/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)};
      const body = req.body;
      const option = {upsert: true};
      const updateToys = {
        $set:{...body}
      }
      const result = await toysCollection.updateOne(query,updateToys, option )
      res.send(result)
    })

    app.post('/addToys',async (req, res)=>{
        const body = req.body;
        const result = await toysCollection.insertOne(body);
        res.send(result);
    })
    app.delete('/delete/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query)
      res.send(result);
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);





// this is home page data
app.get('/', (req, res)=>{
    console.log(process.env.User_Name)
    res.send('hello bangla')
    
})

app.listen(port, ()=>{
    console.log(`this is the port ${port}`)
})