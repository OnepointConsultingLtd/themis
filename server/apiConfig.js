const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
// Mongo Connection URL
const dbUrl = 'mongodb://localhost:27017/';

const app = express();

// parse application/json
app.use(bodyParser.json());

/** GET Configuration tables
 * @param branch: CRUD-table's redux-branch = MongoCollection name
*/
app.get('/api/:branch/load', (req, res) => {
  const { branch } = req.params;
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    console.log(`Connected to MongoDB. Fetching ${branch} settings.`);
    const db = client.db('rulems');
    // CRUD-table's redux-branch = MongoCollection name !!
    db.collection(branch.toLowerCase()).find({}).toArray((error, result) => {
      if (error) throw error;
      res.send(result);
      client.close();
    });
  });
});

/** Keep adding : update, delete, create */

/** CREATE */
app.post('/api/:branch/create', (req, res) => {
  const { branch } = req.params;
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) throw error;
    console.log('Connected to MongoDB. Creating new records for: ', branch);
    const db = client.db('rulems');

    // Importing the record
    db.collection(branch.toLowerCase()).insertOne(req.body, (err, result) => {
      if (err) {
        res.status(404).send({
          message: 'Record could not be imported'
        });
      }
      client.close();
      res.status(200).send({ message: 'Record has been imported succesfully: ', insertedId: result.insertedId });
    });
  });
});

/** UPDATE */
app.post('/api/:branch/update/:id', (req, res) => {
  const { branch, id } = req.params;
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, async (error, client) => {
    if (error) throw error;
    console.log(`Connected to MongoDB. Updating record ${id} for ${branch}`);
    const db = client.db('rulems');

    // Importing the record
    const response = await db.collection(branch.toLowerCase()).replaceOne({ _id: ObjectId(id) }, req.body);
    if (response.error) {
      res.status(404).send({
        message: 'Record could not be updated'
      });
    } else { res.status(200).send({ message: 'Record has been updated succesfully: ', upsertedId: response.result.upsertedId }); }
    client.close();
  });
});

/** DELETE */
app.post('/api/:branch/delete/:id', (req, res) => {
  const { branch, id } = req.params;
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) throw error;
    console.log(`Connected to MongoDB. Removing record ${id} from ${branch}`);
    const db = client.db('rulems');

    // Importing the record
    db.collection(branch.toLowerCase()).deleteOne({ _id: ObjectId(id) }, (err, result) => {
      if (err) {
        res.status(404).send({
          message: 'Record could not be deleted'
        });
      }
      client.close();
      res.status(200).send({ message: 'The record was deleted succesfully', count: result.deletedCount });
    });
  });
});


module.exports = app;
