const express = require('express');
const app = express();
const ejs = require('ejs');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';
const dbName = 'test';

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('UserCollection');
    collection.find().toArray((err, users) => {
      if (err) throw err;
      res.render('app', { users });
      client.close();
    });
  });
});

app.post('/users', (req, res) => {
  const { UserId, Username, Fullname, Address } = req.body;
  const user = { UserId, Username, Fullname, Address };
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('UserCollection');
    collection.insertOne(user, (err) => {
      if (err) throw err;
      res.redirect('/');
      client.close();
    });
  });
});

app.delete('/users/:UserId', (req, res) => {
  const { UserId } = req.params;
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('UserCollection');
    collection.deleteOne({ UserId }, (err) => {
      if (err) throw err;
      res.sendStatus(200);
      client.close();
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});