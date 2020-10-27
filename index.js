const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const querystring = require('querystring');
require('dotenv').config();



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('service'))

app.get('/', (req, res) => {
  res.send('everything is ok')
})

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.zfkd7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } );

client.connect(err => {
  const userOrderedCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_USER_ORDERED_FOOD_COLLECTION}`);

  app.post('/addUserFood', (req, res) => {
    const data = req.body
    userOrderedCollection.insertOne(data)
    .then(result => {
      res.send(result)
    })
    .catch(err => console.log(err))
  })

  app.get('/getOrderedFood', (req, res) => {
    userOrderedCollection.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    } )
  })
});







app.listen(process.env.PORT || 5000)