import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';

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

router.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return; 
  }

  console.log('File received:', req.file);

  try {
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error saving file metadata:', error);
    res.status(500).send('Failed to save file metadata');
  }
}); 

export default router;
