'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const pnut = require('./lib/pnut');

const url = 'mongodb://localhost:27017/enutbot';
const connection = MongoClient.connect(url);

connection.then(db => {
  console.log('Connected to MongoDB server…');

  const collection = db.collection('documents');
  const insertDocuments = (db, callback) => {
    collection.insertMany([
      {}
    ], (err, result) => {
      assert.equal(err, null);
      console.log('Inserted documents into the collection.');
      callback(result);
    })
  }

  insertDocuments(db, () => {
    db.close();
  })
}).catch(err => {
  console.error(err);
})
