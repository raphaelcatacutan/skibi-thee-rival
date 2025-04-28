import { Router } from 'express';
import { Request, Response } from 'express';
import WebSocket from 'ws';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './data/');
  },
  filename: (req, file, cb) => {
    const username = req.body.username || "";
    const sanitizedUsername = username.replace(/\s+/g, '_'); // Replace spaces with underscores
    const baseName = Date.now() + path.extname(file.originalname); 
    cb(null, `${sanitizedUsername}-${baseName}`);
  },
});
const upload = multer({ storage: storage });
const router = Router();

type UserInput = {
  fileName: string,
  username: string
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
      const txtFilePath = path.join('./data', `${path.basename(filePath, path.extname(filePath))}.txt`);
      fs.writeFileSync(txtFilePath, '');

      res.status(200).send('File uploaded successfully');

      const payload: UserInput = {
        username: username,
        fileName: filePath
      };
      const payloadStr = JSON.stringify({payload});

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
