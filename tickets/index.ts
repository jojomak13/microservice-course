import mongoose from 'mongoose';
import app from './src/app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('[JWT_KEY] not found');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('[MONGO_URI] not found');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('DB Connection Done!!');
  } catch (err) {
    console.log(err);
  }

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`[Auth Service] Running on port ${port}`);
  });
};

start();
