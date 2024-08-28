import { readFile, writeFile } from "./data/index.js";

export default async function updatePossession(newLibelle, oldLibelle) {
    const response = await readFile("./data/data.json");
    const list = response.data;
    const obj = list[1].data.possessions;

    for (let index = 0; index < obj.length; index++) {
        if (obj[index].libelle == newLibelle) {
            if (oldLibelle.libelle != null) {
                obj[index].libelle = oldLibelle.libelle;
            }
            obj[index].dateFin = new Date(oldLibelle.dateFin);
        }
    }
    await writeFile("./data/data.json")
}