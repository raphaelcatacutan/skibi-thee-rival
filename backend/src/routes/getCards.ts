import { Router } from "express";
import { Request, Response } from "express";
import fs from "fs";

const router = Router();

router.get("/images", (req: Request, res: Response): void => {
  const filterParam = req.query.filter;
  const isSkibidiParam = req.query.isSkibidi;

  fs.readdir("./data", (err: NodeJS.ErrnoException | null, files: string[]): void => {
    if (err) {
      res.status(500).send("Error reading files");
      return;
    }

    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    let filteredFiles = txtFiles;

    if (filterParam) {
      const filterList = Array.isArray(filterParam) ? filterParam : [filterParam];
      filteredFiles = filteredFiles.filter(file => filterList.some(name => file.startsWith(name.toString())));
    }

    const fileData: { file: string; content: any }[] = [];

    for (const file of filteredFiles) {
      const filePath = `./data/${file}`;
      const rawContent = fs.readFileSync(filePath, "utf-8").trim();

      let data: any = {};
      try {
        data = rawContent ? JSON.parse(rawContent) : {};
      } catch {
        data = {};
      }

      const score = typeof data.score === "number" ? data.score : 0;
      data.score = score;
      data.name = file.split("-")[0].replace("_", " ")

      const isSkibidi = rawContent.length > 0;

      if (isSkibidiParam !== undefined) {
        const check = isSkibidiParam === "true";
        if (check !== isSkibidi) continue;
      }

      fileData.push({ file: file.replace(".txt", ""), content: data });
    }

    // Sort by score descending
    fileData.sort((a, b) => b.content.score - a.content.score);

    // Build final response object
    const result = fileData.reduce((acc, { file, content }) => {
      acc[file] = content;
      return acc;
    }, {} as Record<string, any>);

    res.status(200).json(result);
  });
});

export default router;
