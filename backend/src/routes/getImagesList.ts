import { Router } from "express";
import { Request, Response } from "express";
const fs = require("fs");

const router = Router();

type ImageList = {
  imageFile: string,
  username: string,
  isSkibidi: boolean
}

router.get("/images", (req: Request, res: Response): void => {
	fs.readdir(
		"./data",
		(err: NodeJS.ErrnoException | null, files: string[]): void => {
			if (err) {
				res.status(500).send("Error reading files");
				return;
			}
			const dataFile: string[] = files.filter((file) =>
				file.match(/\.(txt)$/)
			);
      const result = dataFile.map((file) => {
        const filePath = `./data/${file}`;
        const content = fs.readFileSync(filePath, "utf-8");
        const username = file.split("-")[0].replace("_", " ")

        const imageItem: ImageList = {
          imageFile: file.replace(".txt", ".jpg"),
          username: username,
          isSkibidi: content.trim().length !== 0,
        }
        return imageItem;

      });
      res.status(200).json(result);
		}
	);
});

export default router;
