import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), "src/mock/db.json");
    const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (req.method === "GET") {
        res.status(200).json(db.patients);
    } else {
        res.status(405).end();
    }
}