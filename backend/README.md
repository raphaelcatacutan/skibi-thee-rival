# Skibi-Thee Rival Backend

## Setup

1. Create a `.env` file in the backend folder and add the following contents:

```
API_KEY="GEMINI_API_KEY"
PORT=5000
```

## Post Input Image and Username

Uploads and return a new image and username to the system. After receiving, the image along with an initial text data is saved to `backend/data` folder.

Post Route: `/upload`

### Return

After saving process, the backend will send a websocket message to notify the front end about the file.

-   Status 200: The file is successfully uploaded
    -   All clients will receive a data containing the input username and the filename saved.
    ```json
    // Example data
    { "fileName": "Raphael-1745842340801.jpg", "username": "Raphael" }
    ```
-   Status 500: Failed to process upload

_Sample Web Front-end Usage_

```tsx
const [message, setMessage] = useState("");

// Set up WebSocket connection on component mount
useEffect(() => {
	const socket = new WebSocket("ws://localhost:5000"); // Connect to WebSocket server

	socket.onopen = () => {
		console.log("WebSocket connection established");
	};

	socket.onmessage = (event) => {
		console.log("Received from backend:", event.data);
		setMessage(event.data);
	};

	socket.onerror = (error) => {
		console.error("WebSocket error:", error);
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

_Mobile Usage_

```kt
val requestBody = MultipartBody.Builder()
    .setType(MultipartBody.FORM)
    .addFormDataPart("username", username)
    .addFormDataPart(
        "image", file.name,
        file.asRequestBody("image/jpeg".toMediaTypeOrNull())
    )
    .build()

val request = Request.Builder()
    .url("http://192.168.1.13:3000/upload")
    .post(requestBody)
    .build()
```

## Get Image List

Gets the list of data saved in the system. It will also return if the file was processed already.

Get Route: `/images`

### Return

-   Status 200: The files are successfully read.
    ```json
    [
    	{
    		"imageFile": "Iwag-1745842314204.jpg",
    		"username": "Iwag",
    		"isSkibidi": false
    	},
    	{
    		"imageFile": "Raphael_James-1745842340801.jpg",
    		"username": "Raphael James",
    		"isSkibidi": true // This image was already processed
    	},
    	{
    		"imageFile": "Hello-1745842437688.jpg",
    		"username": "Hello",
    		"isSkibidi": false
    	}
    ]
    ```
-   Status 500: Error reading files
