# Skibi-Thee Rival Backend

## Setup
1. Create a `.env` file in the backend folder and add the following contents:
```
API_KEY="GEMINI_API_KEY"
PORT=5000
```

## Post / Get Input
1. Mobile app will make a post request to the port 3000 with the username and image
2. The backend will receive the image and save it along with an intial text data to `backend/data` folder
3. The backend will send a websocket message to notify the front end about the file.
    - Status 200: The file is successfully uploaded
        - All clients will receive a data containing the input username and the filename saved.
        ```json
        // Example data
        {"fileName":"Raphael-1745842340801.jpg","username":"Raphael"}
        ```
    - Status 500: Failed to process upload

*Example Front-end Usage*

```tsx
const [message, setMessage] = useState('');

// Set up WebSocket connection on component mount
useEffect(() => {
const socket = new WebSocket('ws://localhost:5000'); // Connect to WebSocket server

socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
    console.log('Received from backend:', event.data);
    setMessage(event.data); 
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

return () => {
    socket.close();
};
}, []);

return (
<div>
    <h1>File Upload Status</h1>
    <p>{message}</p>
</div>
);
```

## Get Image List
