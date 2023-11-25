import { MongoClient } from "mongodb";

export const mongo: any = {};

const dbName = "template-db";

export const connect = async (url: string) => {
  try {
    if (!url) {
      throw new Error("Missing url");
    }
    const client = new MongoClient(url);
    await client.connect();
    mongo.db = client.db(dbName);
    console.log("Mongodb connected to db:", dbName);
  } catch (err) {
    throw new Error(err);
  }
};
