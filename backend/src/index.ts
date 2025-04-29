import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';

import postInput from "./routes/postInput"; 
import getCards from "./routes/getCards"; 
import getExtraction from "./routes/getExtraction"; 
import postGeneration from "./routes/postGeneration"; 
import postScore from "./routes/postScore"; 
import postPreview from "./routes/postPreview"; 

dotenv.config()
const PORT = process.env.PORT;

const app = express();
app.use(cors());
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message) => {
      console.log('Received message:', message);
    });
  });

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API');
});

app.use('/data', express.static("./data"));
app.use('/output', express.static("./output"));
app.use('/assets', express.static("./assets"));

app.use('/api', postInput(wss));
app.use('/api', getCards);
app.use('/api', getExtraction);
app.use('/api', postGeneration)
app.use('/api', postScore)
app.use('/api', postPreview)