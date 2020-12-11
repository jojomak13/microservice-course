import mongoose from 'mongoose';
import app from './src/app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('[JWT_KEY] not found');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-service:27017/auth', {
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
