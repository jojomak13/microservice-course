import mongoose from 'mongoose';
import Password from '../services/Password';

// An interface that describes the properties
// that are required to create new user
interface IUser {
  email: string;
  password: string;
}

// an interface that describe the documnet
// that the user model create
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(user: IUser): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.hash(this.get('password'));
    this.set('password', hashedPassword);
  }

  done(null);
});

userSchema.statics.build = (user: IUser) => {
  return new User(user);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
