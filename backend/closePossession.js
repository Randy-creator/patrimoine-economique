import { readFile, writeFile } from "./data/index.js";

export default async function closePossession(libelle) {
  const response = await readFile("./data/data.json");
  const data = response.data;
  const possessions = data[1].data.possessions;
  for (const possession of possessions) {
    if (possession.libelle == libelle) {
      possession.dateFin = new Date();
    }
  }
  const status = await writeFile("./data/data.json", data);
  return status;
}
