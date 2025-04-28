import { Router } from "express";
import { Request, Response } from "express";
const fs = require("fs");

const router = Router();


router.get("/images", (req: Request, res: Response): void => {
	fs.readdir(
		"./data",
		(err: NodeJS.ErrnoException | null, files: string[]): void => {
			if (err) {
				res.status(500).send("Error reading files");
				return;
			}
			const imageFiles: string[] = files.filter((file) =>
				file.match(/\.(txt)$/)
			);
			res.json(imageFiles);
		}
	);
});

export default router;
