const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 7000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h25va.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db("BlogPost").collection("post");
  const adminCollection = client.db("BlogPost").collection("admin");
  

  app.post('/addBlog', (req, res) => {
    const blog = req.body
    blogCollection.insertOne(blog)
    .then(results => {
      res.send(results.insertedCount > 0)
    })
  })

  app.get('/blogs', (req, res) => {
    blogCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    blogCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount)
    })
  })

  app.post('/addAdmin', (req, res) => {
    const admin = req.body
    adminCollection.insertOne(admin)
    .then( result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email
    adminCollection.find({email: email})
    .toArray((err, admin) => {
      res.send(admin.length > 0)
    })
  })

});


app.listen( process.env.PORT || port)