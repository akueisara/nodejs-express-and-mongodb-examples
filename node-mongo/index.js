const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017';
const dbname = 'conFusion';
const dishCollectionName = 'dishes';

MongoClient.connect(url, (err, client) => {
    assert.equal(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    dboper.insertDocument(db, {name: "Vadonut", description: 'Test'}, dishCollectionName, (result) => {
        console.log('Insert Document:\n', result.ops);

        dboper.findDocuments(db, dishCollectionName, (docs) => {
           console.log('Found Documents:\n', docs);

           dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated Test'}, dishCollectionName, (result) => {
               console.log('Updated Document:\n', result.result);

               dboper.findDocuments(db, dishCollectionName, (docs) => {
                   console.log('Found Documents:\n', docs);

                   db.dropCollection(dishCollectionName, (result) => {
                       console.log('Dropped Collection: ', result);

                       client.close();
                   });
               });
           });
        });
    });
});