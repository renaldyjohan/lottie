import { MongoClient, Db } from 'mongodb';
import config from './config';

let client: MongoClient;

const connectToDatabase = async (): Promise<Db> => {
  if (!client) {
    client = new MongoClient(config.mongoUrl!);
    await client.connect();
  }
  return client.db();
};

export default connectToDatabase;
