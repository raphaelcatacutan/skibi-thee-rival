import { Router } from "express";
import { Request, Response } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";
import * as dotenv from 'dotenv';

const router = Router();
const systemInstruction = fs.readFileSync("./assets/extract_prompt.txt", "utf-8");

dotenv.config()
const API_KEY = process.env.API_KEY;

router.get("/extract", async (req: Request, res: Response): Promise<void> => {
    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        const username = req.query.name as string;
        const imageName = req.query.imagePath as string;

        if (!username || !imageName) {
            res.status(400).json({ error: "Missing 'name' or 'imagePath' query parameter" });
            return;
        }

        const imagePath = `./data/${imageName}`;
        if (!fs.existsSync(imagePath)) {
            res.status(404).json({ error: "Image file not found" });
            return;
        }

        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const contents = [
            { text: username },
            {
                inlineData: {
                    mimeType: "image/png",
                    data: base64Image,
                },
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents,
            config: {
                responseModalities: [Modality.TEXT],
                systemInstruction: [
                    {
                        text: systemInstruction,
                    },
                ],
            },
        });

        try {
            const jsonString = response.text?.replace(/```json\s*([\s\S]*?)\s*```/, "$1");
            console.log(jsonString)
            const parsed = JSON.parse(jsonString ?? "");
            const dynamicKey = Object.keys(parsed)[0];
            const cardPrompt = JSON.stringify(parsed[dynamicKey].card_prompt, null, 4);
            const txtFilePath = imagePath.replace(".jpg", ".txt");
            fs.writeFileSync(txtFilePath, cardPrompt);
            res.status(200).json(parsed);
        } catch (e) {
            console.error("Failed to parse JSON:", e);
            res.status(500).json({ error: "Failed to generate content" });
        }

        response.text?.replace("```json", "").replace("```", "")
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

export default router