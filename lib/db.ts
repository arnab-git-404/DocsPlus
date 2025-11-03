// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// interface MongooseCache {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// }

// declare global {
//   var mongoose: MongooseCache;
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts);
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default dbConnect;




import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'Slip_Generator';

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare a global cache (to avoid multiple connections in serverless environments)
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached!.conn) {
    // ✅ Log reused connection
    console.log(`⚡ Reusing existing MongoDB connection to: ${cached!.conn.connection.name}`);
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      dbName: MONGO_DB_NAME,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached!.conn = await cached!.promise;

    // ✅ Log successful connection
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📦 Database: ${cached!.conn.connection.name}`);
    console.log(`🌐 Host: ${cached!.conn.connection.host}`);

    // Optional connection status logs
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    return cached!.conn;
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    cached!.promise = null;
    throw error;
  }
}
