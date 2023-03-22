/**
 * Database connection
 */
const mongoose = require('mongoose');
const config = require('../config');
const dbURI = config.dbURI;
const dbOptions = config.dbOptions;
const MongoClient = require('mongodb').MongoClient;

exports.connection = mongoose.createConnection(dbURI, dbOptions);

exports.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI);
});

exports.connection.on('error', err => {
    console.log('Mongoose connection error: ' + err);
});

exports.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// List DBs
exports.listDatabases = async() => {
    let client = await MongoClient.connect(dbURI, dbOptions);
    let dbs = await client.db().admin().listDatabases();
    console.log(dbs);
    client.close();
}

// List Collections
exports.listCollections = async() => {
    let client = await MongoClient.connect(dbURI, dbOptions);
    let collections = await client.db().listCollections().toArray();
    console.log(collections);
    client.close();
}

// List Documents
exports.listDocuments = async() => {
    let client = await MongoClient.connect(dbURI, dbOptions);
    let documents = await client.db().collection('users').find().toArray();
    console.log(documents);
    client.close();
}