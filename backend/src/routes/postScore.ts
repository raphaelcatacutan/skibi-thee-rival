import { Request, Response } from "express";
import { Router } from 'express';
import * as fs from "node:fs";

const router = Router();

router.post("/score", async (req: Request, res: Response): Promise<void> => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            res.status(400).json({ error: "Missing required fields: imageId" });
            return;
        }

        const txtFilePath = `./data/${imageId}.txt`;

        // Ensure the file exists
        if (!fs.existsSync(txtFilePath)) {
            fs.writeFileSync(txtFilePath, '');
        }

        const raw = fs.readFileSync(txtFilePath, "utf-8").trim();

        let data: any = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch {
            data = {};
        }

        data.score = typeof data.score === "number" ? data.score + 0.5 : 1;

        fs.writeFileSync(txtFilePath, JSON.stringify(data, null, 4));

        res.status(200).json({
            success: true,
            score: data.score,
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
