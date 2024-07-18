import { Request, Response } from 'express';
import { ObjectId, Db } from 'mongodb';
import connectToDatabase from './db';
import { WebSocketServer } from 'ws';

interface Animation {
  name: string;
  jsonFile: string;
  _id?: ObjectId;
}

let wss: WebSocketServer | null = null;

const createAnimation = async (req: Request, res: Response): Promise<void> => {
  const newAnimation: Animation = {
    name: req.body.name,
    jsonFile: req.body.jsonFile,
  };

  try {
    const db: Db = await connectToDatabase();
    await db.collection('animations').insertOne(newAnimation);
    res.json(newAnimation);
  } catch (error) {
    res.status(500).json({ message: `Could not create animation! ${error}` });
  }
};

const getAnimation = async (req: Request, res: Response): Promise<void> => {
  try {
    const db: Db = await connectToDatabase();
    const animation = await db
      .collection('animations')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!animation) {
      res.status(404).json({ message: 'Animation not found!' });
    } else {
      res.status(200).json(animation);
    }
  } catch (error) {
    res.status(500).json({ message: `Could not retrieve animation! ${error}` });
  }
};

const getAnimationList = async (req: Request, res: Response): Promise<void> => {
  try {
    const db: Db = await connectToDatabase();
    const animations = await db.collection('animations').find().toArray();
    res.json(animations);
  } catch (error) {
    res.status(500).json({ message: `Could not retrieve animations! ${error}` });
  }
};

const updateAnimation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData: Partial<Animation> = {
    name: req.body.name,
    jsonFile: req.body.jsonFile,
  };

  try {
    const db: Db = await connectToDatabase();
    const result = await db.collection('animations').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ message: 'Animation not found!' });
    } else {
      res.json(result);

      // Notify WebSocket clients about the update
      if (wss) {
        wss.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'update', data: result.value }));
          }
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: `Could not update animation! ${error}` });
  }
};

// Set the WebSocket server instance
const setWebSocketServer = (webSocketServer: WebSocketServer) => {
  wss = webSocketServer;
};

export { createAnimation, getAnimation, getAnimationList, updateAnimation, setWebSocketServer };
