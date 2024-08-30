import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";


import createPossession from "./createPossession.js";
import updatePossession from "./updatePossession.js";
import closePossession from "./closePossession.js";
import getValeurPatrimoine from "./getValeurPatrimoine.js";
import getRange from "./getRange.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// fileURLToPath(import.meta.url) converts the module's URL to a file path.
// dirname(__filename) then gives you the directory name of the current file.


const app = express();
const port = 5173;

app.use(express.json());

app.get("/possession", (req, res) => {
  res.sendFile(__dirname + "/data/data.json");
});

app.post("/possession", (req, res) => {
  createPossession(req.body);
  res.status(201).send({
    message: "add new possession",
    possession: { ...req.body, dateFin: null },
  });
});

app.put("/possession/:libelle", (req, res) => {
  const libelle = req.params.libelle;
  try {
    updatePossession(libelle, req.body);
    res.send("200 OK");
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

app.put("/possession/:libelle/close", (req, res) => {
  const libelle = req.params.libelle;
  try {
    closePossession(libelle);
    res.send("200 OK");
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

app.post("/patrimoine/range", (req, res) => {
  const result = getRange(req.body);
  res.status(200).send({ data: result });
});

app.get("/patrimoine/:date", (req, res) => {
  const jour = req.params.date;
  try {
    const result = getValeurPatrimoine(new Date(jour));
    res.status(200).send({ valeurPatrimoine: result });
  } catch (err) {
    res.status(400).send({ status: "failed", error: err });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
