import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import express, { Request, Response } from 'express';
import cors from 'cors';
import postImage from "./routes/postImage"; 
import getImage from "./routes/getImage"; 
const path = require('path');

dotenv.config();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API');
});

// Image uploads
app.use('/uploads', express.static("./uploads"));
app.use('/', postImage);
app.use('/', getImage);
