import { readFile, writeFile } from "./data/index.js";

export default async function updatePossession(newLibelle, oldLibelle) {
    const response = await readFile("./data/data.json");
    const list = response.data;
    const allPossessions = list[1].data.possessions;

    for (const possession of allPossessions) {
        if (possession.libelle == newLibelle) {
            if (oldLibelle.libelle != null) {
                possession.libelle = oldLibelle.libelle;
            }
            possession.dateFin = new Date(oldLibelle.dateFin);
        }
    }
    await writeFile("./data/data.json");
}