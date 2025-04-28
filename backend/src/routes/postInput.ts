import { Router } from 'express';
import { Request, Response } from 'express';
import WebSocket from 'ws';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage: storage }); 
const router = Router();

class UserInput {
  fileName: string
  username: string 

  constructor(filename = "", username = "") {
    this.fileName = filename
    this.username = username
  }
}

const uploadRoutes = (wss: WebSocket.Server) => {
  router.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const username = req.body.username || ""; 
    const filePath = req.file.filename;

    console.log('File received:', req.file);
    console.log('Username received:', username);

    try {
      res.status(200).send('File uploaded successfully');

      const payload = new UserInput(filePath, username);
      const payloadStr = JSON.stringify(payload);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payloadStr);
        }
      });
    } catch (error) {
      console.error('Error:', error);
      if (!res.headersSent) {
        res.status(500).send('Failed to process upload');
      }
    }
  });

  return router;
};


export default uploadRoutes;
