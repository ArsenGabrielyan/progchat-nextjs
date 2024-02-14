import {MongoClient} from "mongodb"
if(!process.env.DB_URL) throw new Error("Database Is Missing. That's Because You Forgot to add The Link")
const url = process.env.DB_URL, options = {};
let client, clientPromise: Promise<MongoClient>;

if(process.env.NODE_ENV==='development'){
     const globalObj = global as any;
     if(!globalObj._dbPromise){
          client = new MongoClient(url,options);
          globalObj._dbPromise = client.connect();
     }
     clientPromise = globalObj._dbPromise
} else {
     client = new MongoClient(url,options);
     clientPromise = client.connect();
}

export default clientPromise