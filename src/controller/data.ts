import * as mongoDb  from 'mongodb';

export const MongoClient = require("mongodb").MongoClient;

//this is a uri pointing to a mongodb atlas on cloud, leave as is.
export const uri = 'mongodb+srv://admin:ZDmk8yYNdiyTrToN@katanadealer.zms1w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//would've put all this info in a configuration file but running out of time
export const dbName = 'CardGames';

export const collections: { Decks?: mongoDb.Collection } = {}

export async function initializeDb()
{
    const client: mongoDb.MongoClient = new MongoClient(uri); 
    await client.connect();

    const db: mongoDb.Db = client.db(dbName);

    collections.Decks = db.collection("Decks");
    collections.Decks.deleteMany({}); //to have a clear collection everytime the app starts
}