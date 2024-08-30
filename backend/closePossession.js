import { readFile, writeFile } from "./data/index.js";

export default async function closePossession(newLibelle, oldLibelle) {
    const response = await readFile("./data/data.json");
    const list = response.data;
    const allPossessions = list[1].data.possessions;

    const today = new Date();
    for (const possession of allPossessions) {
        if (possession.libelle == newLibelle && oldLibelle != null) {
            possession.dateFin = today;
        }
    }
    await writeFile("./data/data.json", list);
}
