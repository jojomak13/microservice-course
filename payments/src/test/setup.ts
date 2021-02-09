import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../natsWrapper');

let mongo: MongoMemoryServer;

// Configure MongoMemoryServer
// before starting
beforeAll(async () => {
  process.env.JWT_KEY = 'jojo';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Create jwt token
  const token = jwt.sign(
    {
      id: id || new mongoose.Types.ObjectId().toHexString(),
      email: 'jojo@test.com',
    },
    process.env.JWT_KEY!
  );

  // Build session Object and convert it to JSON
  const session = JSON.stringify({ jwt: token });

  // Convert to base64
  const base64Session = Buffer.from(session).toString('base64');

  return [`express:sess=${base64Session}`];
};
