# Skibi-Thee Rival Backend

## Setup

1. Create a `.env` file in the backend folder and add the following contents:

```
API_KEY="GEMINI_API_KEY"
PORT=5000
```

## Post Input Image and Username

Uploads and return a new image and username to the system. After receiving, the image along with an initial text data is saved to `backend/data` folder. To access, use: `http://localhost:5000/data/{fileName.jpg}`

Post Route: `/api/upload`

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
    .url("http://{local_ip}:3000/api/upload")
    .post(requestBody)
    .build()
```

## Get Cards

Gets the list of data saved in the system. It can take multiple optional arguments `filter` to filter out data with the specified ids or `isSkibidi` boolean to filter processed data. All return values are sorted in descending score, if score is not present in the saved data, default to 0.

Get Route: `/api/images?filter={id1}&filter={id2}&isSkibidi=true`

### Return

-   Status 200: The files are successfully read.
    ```json
    {
    	"Iwag-1745842437688": {
    		"cardTitle": "21dsdad",
    		"hpValue": "2300",
    		"damageValue": "180",
    		"critRateValue": "x1.8",
    		"skillNames": [
    			"Tarsier Punch",
    			"Coffee Bonk",
    			"Tarsierquake",
    			"Delulu Tarsier",
    			"Gyatt Tarsier",
    			"Zucc Tarsier",
    			"Self-Care Tarsier"
    		],
    		"description": "RaphaelTarsier is here to make a cheer, he's always near, ready to give you gear! With a HP of 2300 and damage 180, his critical hits will give you so much glee!",
    		"borderColor": "GREEN",
    		"overlay": "Holographic",
    		"imageSrc": "Image_RaphaelTarsierNoSpaces.jpeg",
    		"score": 3,
    		"name": "Iwag"
    	},
    	"Raphael-1745842340801": {
    		"cardTitle": "123",
    		"hpValue": "2300",
    		"damageValue": "180",
    		"critRateValue": "x1.8",
    		"skillNames": [
    			"Tarsier Punch",
    			"Coffee Bonk",
    			"Tarsierquake",
    			"Delulu Tarsier",
    			"Gyatt Tarsier",
    			"Zucc Tarsier",
    			"Self-Care Tarsier"
    		],
    		"description": "RaphaelTarsier is here to make a cheer, he's always near, ready to give you gear! With a HP of 2300 and damage 180, his critical hits will give you so much glee!",
    		"borderColor": "GREEN",
    		"overlay": "Holographic",
    		"imageSrc": "Image_RaphaelTarsierNoSpaces.jpeg",
    		"score": 1,
    		"name": "Raphael"
    	},
    	"Hello-1745842522941": {
    		// If isSkibidi is not provided, it will also list unprocessed cards
    		// These information are default
    		"score": 0,
    		"name": "Hello"
    	}
    }
    ```
-   Status 500: Error reading files

## Get Image Extraction

Takes an image path and name as arguments. This get request extracts the image details using Gemini. Before returning the `card_prompt` data will be saved to the text file corresponding to the image.

Get Route: `/api/extract?imagePath={imageFile.jpg}&name={username}`

### Return

-   Status 400: Missing 'name' or 'imagePath' query parameter
-   Status 404: Image file not found
-   Status 500: Failed to generate content
-   Status 200: Extracted and saved image data.
    ```json
    {
    	"RaphaelDuhat": {
    		"log_information": {
    			"chosen_animal/fruit": "Duhat",
    			"reason_for_chosen_animal/fruit": "The dark color of the drink in the cup reminded me of the dark purple of a Duhat fruit",
    			"referenced_name": "Tung Tung Tung Sahur",
    			"reason_for_referenced_name": "It has a similar rhythm and syllable structure, and the uncanny creepy vibe matches the unsettling nature of mixing a person's face with a dark-colored fruit."
    		},
    		"image_prompt": "Modify the image without replacing the person, retain facial features and render it as: A surreal, 3D render portrait with warm, muted tones and a rustic nighttime atmosphere. The subject is an anthropomorphic character (Duhat log figure with limbs), with a distinct Duhat skin texture. Lighting is warm artificial light, creating defined shadows. Background is a slightly blurred rustic outdoor setting at night. Colors are dark purples, tans, and warm yellows, textured, with deep shadows and slightly stylized detail. A wooden bat accessory adds a slightly unnerving look. Dimensions: 275×385 px (2.5×3.5 in – 110 ppi)",
    		"card_prompt": {
    			"cardTitle": "RaphaelDuhat",
    			"hpValue": "2300",
    			"damageValue": "180",
    			"critRateValue": "x1.7",
    			"skillNames": [
    				"Duhat Punch",
    				"Duhat Bonk",
    				"Duhatquake",
    				"Delulu Duhat",
    				"Gyatt Duhat",
    				"Zucc Duhat",
    				"Self-Care Duhat"
    			],
    			"description": "RaphaelDuhat, RaphaelDuhat, he's a fruity kind of guy, some say he gives you buffs and the enemy will cry, but he is more famous with his hp that is really high!",
    			"borderColor": "GREEN",
    			"overlay": "Holographic",
    			"imageSrc": "Image_RaphaelDuhat.jpeg"
    		}
    	}
    }
    ```

## Post Image Generation

Takes an image path, text contents, and an output image path as arguments. This post request generates a skibidi image using Gemini. The image will be stored in `backend/output` folder. To access, use: `http://localhost:5000/output/{fileName.jpg}`

Post Route: `api/generate?imagePath={inputPath}&contents={prompt}&outputImagePath={outputPath}`

### Return

-   Status 400: Missing required fields: imagePath, textContent, outputImagePath
-   Status 500: No content parts returned from the model or Internal Server Error
-   Status 200: Image generation successful
    ```json
    { "success": true, "outputPath": "abc.jpg" }
    ```

_Sample Web Front-end Usage_

```tsx
const body = {
	imagePath,
	textContent,
	outputImagePath,
};

try {
	const res = await fetch("http://localhost:3000/api/generate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	const data: ImageGenerationResponse = await res.json();

	if (data.success) {
		setResponseMessage(data.outputPath || "Image generated successfully!");
	} else {
		setResponseMessage("Image generation failed");
	}
} catch (error) {
	console.error("Error:", error);
	setResponseMessage("An error occurred while generating the image.");
} finally {
	setLoading(false);
}
```

## Post Score

Takes an imageId as an argument. This post request will increment 1 score to the data file of that image id.

Post Route: `api/score?imageId={imageId}`

### Return

-   Status 400: Missing required fields: imageId
-   Status 500: Internal Server Error
-   Status 200: Score successful changed
    ```json
    { "success": true, "score": 2 }
    ```

_Sample Web Front-end Usage_

```tsx
try {
	const res = await fetch("http://localhost:3000/api/score", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ imageId }),
	});
	const data = await res.json();
	if (data.success) {
		setGenerateResponse(`Score updated. New score: ${data.score}`);
	} else {
		setGenerateResponse("Failed to update score");
	}
} catch (error) {
	console.error("Error:", error);
	setGenerateResponse("An error occurred while updating score.");
} finally {
	setGenerating(false);
}
```
