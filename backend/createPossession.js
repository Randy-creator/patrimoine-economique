import { readFile, writeFile } from "./data/index.js";
import Personne from "../models/Personne.js"
import Possession from "../models/possessions/Possession.js"


export default async function createPossession(req) {
    const possesseur = new Personne("John doe");
    const libelle = req.libelle;
    const valeur = req.valeur;
    const dateDebut = req.dateDebut;
    const dateFin = req.dateFin;
    const taux = req.tauxAmortissement;

    const newPossession = new Possession(possesseur, libelle, valeur, dateDebut, dateFin, taux);
    try {
        const response = await readFile("./data/data.json");
        const list = response.data;
        list[1].data.possessions.push(newPossession);

        await writeFile("./data/data.json", list);

    } catch (error) {
        console.error(error);
    }
}