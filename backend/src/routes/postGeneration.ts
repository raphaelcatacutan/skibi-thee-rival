import { GoogleGenAI, Modality } from "@google/genai";
import { Request, Response } from "express";
import { Router } from 'express';
import * as dotenv from 'dotenv';
import * as fs from "node:fs";

dotenv.config()
const API_KEY = process.env.API_KEY;
const router = Router();

router.post("/generate", async (req: Request, res: Response): Promise<void> => {
    try {
        const { imagePath, textContent, outputImagePath } = req.body;

        if (!imagePath || !textContent || !outputImagePath) {
            res.status(400).json({ error: "Missing required fields: imagePath, textContent, outputImagePath" });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: API_KEY });

        const imageData = fs.readFileSync(`./data/${imagePath}.jpg`);
        const base64Image = imageData.toString("base64");

        const contents = [
            { text: textContent },
            {
                inlineData: {
                    mimeType: "image/png",
                    data: base64Image,
                },
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp-image-generation",
            contents: contents,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];
        const parts = candidate?.content?.parts;

        if (!parts) {
            res.status(500).json({ error: "No content parts returned from the model." });
            return;
        }

        let textResult: string | undefined;

        for (const part of parts) {
            if ("text" in part) {
                textResult = part.text;
                console.log("Text Response:", textResult);
            } else if (part.inlineData?.data) {
                const buffer = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync(`./output/${outputImagePath}`, buffer);
                console.log(`Image saved at ${outputImagePath}`);
            }
        }

        res.status(200).json({
            success: true,
            outputPath: outputImagePath
        });
    } catch (err) {
        console.error("Error in image generation:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
