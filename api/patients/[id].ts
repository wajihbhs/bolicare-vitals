import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { query: { id } } = req;

    const filePath = path.join(process.cwd(), "src/mock/db.json");
    const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const patientIndex = db.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
        return res.status(404).json({ message: "Patient not found" });
    }

    if (req.method === "GET") {
        res.status(200).json(db.patients[patientIndex]);
    } else if (req.method === "PUT") {
        const updated = req.body;
        db.patients[patientIndex] = updated;
        res.status(200).json(updated);
    } else {
        res.status(405).end();
    }
}
