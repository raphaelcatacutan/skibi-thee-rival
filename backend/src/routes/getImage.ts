import { Router } from 'express';
import { Request, Response } from 'express';
const fs = require('fs');

const router = Router();

router.get('/images', (req: Request, res: Response): void => {
    fs.readdir('tests/web_receiver/uploads', (err: NodeJS.ErrnoException | null, files: string[]): void => {
      if (err) {
        res.status(500).send('Error reading files');
        return
      }
      const imageFiles: string[] = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/));
      res.json(imageFiles);  // Send back the list of image filenames
    });
  });

export default router;
