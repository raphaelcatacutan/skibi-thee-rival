import React, { useState, useEffect } from "react";
import { startBattle } from "../utils/battle_sequence";

type ImageGenerationResponse = {
	success: boolean;
	outputPath: string;
};

const TestPage = () => {
	const [message, setMessage] = useState("Hello World");

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
				setResponseMessage(
					data.outputPath || "Image generated successfully!"
				);
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

	const [imageId, setImageId] = useState<string>("");
	const [generateResponse, setGenerateResponse] = useState<string | null>(
		null
	);
	const [generating, setGenerating] = useState<boolean>(false);

	const handleGenerateScore = async () => {
		setGenerating(true);
		setGenerateResponse(null);
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
	};

	const [base64Image, setBase64Image] = useState<string>("");
	const [imageNameForSave, setImageNameForSave] = useState<string>("");
	const [saveResponse, setSaveResponse] = useState<string | null>(null);
	const [saving, setSaving] = useState<boolean>(false);

	const handleSaveImage = async () => {
		setSaving(true);
		setSaveResponse(null);

		try {
			const res = await fetch("http://localhost:3000/api/preview", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					base64Image,
					imageName: imageNameForSave,
				}),
			});

			const data = await res.json();

			if (data.success) {
				setSaveResponse(`Image saved to: ${data.path}`);
			} else {
				setSaveResponse("Failed to save image.");
			}
		} catch (error) {
			console.error("Save error:", error);
			setSaveResponse("An error occurred while saving the image.");
		} finally {
			setSaving(false);
		}
	};

	const [speech, setSpeech] = useState("");
	function speak(text: string): void {
		listVoices();
		const synth = window.speechSynthesis;

		// Cancel any ongoing speech
		synth.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en-US"; // You can change this to other locales
		utterance.rate = 1; // 0.1 to 10
		utterance.pitch = 1; // 0 to 2
		utterance.volume = 1; // 0 to 1
		const voices = synth.getVoices();

		const voiceName = "Microsoft Diego Online (Natural)";
		const selectedVoice = voices.find((v) => v.name.includes(voiceName));

		if (selectedVoice) {
			utterance.voice = selectedVoice;
		} else {
			console.warn(`Voice "${voiceName}" not found.`);
		}

		synth.speak(utterance);

		synth.speak(utterance);
	}
	function listVoices(): void {
		const voices = window.speechSynthesis.getVoices();
		voices.forEach((voice, index) => {
			console.log(`${index + 1}: ${voice.name} (${voice.lang})`);
		});
	}

	return (
		<div>
			<h1>File Upload Status</h1>
			<p>{message}</p>

			<hr />
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

			<hr />

			<h1>Update Score</h1>
			<div>
				<label>
					Image ID:
					<input
						type="text"
						value={imageId}
						onChange={(e) => setImageId(e.target.value)}
					/>
				</label>
				<button onClick={handleGenerateScore} disabled={generating}>
					{generating ? "Updating..." : "Update Score"}
				</button>
			</div>

			{generateResponse && (
				<div>
					<h2>Score Update:</h2>
					<p>{generateResponse}</p>
				</div>
			)}
			<hr />
			<h1>Save Base64 Image</h1>

			<div>
				<label>
					Base64 Image:
					<textarea
						rows={4}
						cols={80}
						value={base64Image}
						onChange={(e) => setBase64Image(e.target.value)}
						placeholder="data:image/png;base64,..."
					/>
				</label>
			</div>

			<div>
				<label>
					Image Name:
					<input
						type="text"
						value={imageNameForSave}
						onChange={(e) => setImageNameForSave(e.target.value)}
					/>
				</label>
			</div>

			<div>
				<button onClick={handleSaveImage} disabled={saving}>
					{saving ? "Saving..." : "Save Image"}
				</button>
			</div>

			{saveResponse && (
				<div>
					<h2>Save Response:</h2>
					<p>{saveResponse}</p>
				</div>
			)}
			<hr />
			<h1>Text To Speech</h1>

			<div>
				<label>
					Sentence:
					<textarea
						value={speech}
						onChange={(e) => setSpeech(e.target.value)}
						placeholder="Hello World"
					/>
				</label>
			</div>

			<div>
				<button
					onClick={() => {
						speak(speech);
					}}
				>
					{"Speak"}
				</button>
			</div>
		</div>
	);
};

export default TestPage;
