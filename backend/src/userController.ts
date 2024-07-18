import { Request, Response } from 'express';

interface CustomRequest extends Request {
  userId?: string;
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from './db';
import config from './config';
import { ObjectId } from 'mongodb';

interface User {
  username: string;
  password: string;
  _id?: ObjectId;
}

const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const db = await connectToDatabase();
    const existingUser = await db.collection('users').findOne({ username });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = { username, password: hashedPassword };

    await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error registering user: ${error}` });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, userName: username },
      config.jwtSecret || '',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error}` });
  }
};

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: Function
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const secret: jwt.Secret | jwt.GetPublicKeyOrSecret =
      config.jwtSecret || '';
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authValidate = (req: Request, res: Response): void => {
  res.json({ message: 'Token is valid' });
};

export { register, login, authMiddleware };
