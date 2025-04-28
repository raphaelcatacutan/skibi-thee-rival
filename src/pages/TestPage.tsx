import React, { useState, useEffect } from 'react';

type ImageGenerationResponse = {
  success: boolean;
  outputPath: string;
}

const TestPage = () => {
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


  const [imagePath, setImagePath] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [outputImagePath, setOutputImagePath] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    setResponseMessage(null);

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
  };

  return (
    <div>
    <h1>File Upload Status</h1>
    <p>{message}</p>
      <h1>Image Generation</h1>

      <div>
        <label>
          Image Path:
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Text Content:
          <input
            type="text"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Output Image Path:
          <input
            type="text"
            value={outputImagePath}
            onChange={(e) => setOutputImagePath(e.target.value)}
          />
        </label>
      </div>

      <div>
        <button onClick={handleGenerateImage} disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>

      {responseMessage && (
        <div>
          <h2>Response:</h2>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
