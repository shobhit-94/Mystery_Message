import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
  //readyState type in Mongoose is number, not string Thats why we use number .
};
const connection: ConnectionObject = {};

/*

Next.js automatically loads environment variables for you.

So you do NOT need:

import dotenv from "dotenv";
dotenv.config();


That is required in plain Node / Express, but not in Next.js.
readyState type in Mongoose is number, not string.
0 = disconnected
1 = connected
2 = connecting
3 = disconnecting

*/
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    //OR ye bhi if (connection.isConnected === 1) {
    console.log("Already connected to database");
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log("DB = ", db);
    console.log("DB Connected = ", db.connections);

    connection.isConnected = db.connections[0].readyState;
    console.log("DB connection successfully");
  } catch (error) {
    console.log("DB connection failure");
    process.exit(1);
  }
}

export default dbConnect;
