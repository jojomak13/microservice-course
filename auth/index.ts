import mongoose from 'mongoose';
import app from './src/app';

const start = async () => {
  const keys = ['JWT_KEY', 'MONGO_URI'];

  for (let key of keys) {
    if (!process.env[key]) throw new Error(`[${key}] not found`);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
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
