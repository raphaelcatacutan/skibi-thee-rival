import { Request, Response } from "express";
import { Router } from "express";
import * as fs from "node:fs";

const router = Router();

router.post("/preview", async (req: Request, res: Response): Promise<void> => {
  try {
    const { base64Image, imageName } = req.body;

    if (!base64Image || !imageName) {
      res.status(400).json({ success: false, message: "Missing required fields: base64Image, imageName" });
      return;
    }
    const base64Data = base64Image.replace("data:image/png;base64,", "");
    const buffer = Buffer.from(base64Data, "base64");

    const imagePath = `./output/${imageName}-preview.png`;

    fs.writeFileSync(imagePath, buffer);

    res.status(200).json({
      success: true,
      message: "Image saved successfully.",
      path: imagePath,
    });
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
