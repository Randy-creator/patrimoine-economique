import { readFile, writeFile } from "./data/index.js";

export default async function updatePossession(libelle, data) {
    const response = await readFile("./data/data.json");
    const list = response.data;
    const allPossessions = list[1].data.possessions;

    for (const possession of allPossessions) {
        if (possession.libelle == libelle) {
            if (data.libelle != null) {
                possession.libelle = data.libelle;
            }
            possession.dateFin = new Date(data.dateFin);
        }
    }
    await writeFile("./data/data.json", list);
}