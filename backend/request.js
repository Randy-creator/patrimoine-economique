import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Patrimoine from '../models/Patrimoine.js';
import createPossession from './createPossession.js';
import updatePossession from './updatePossession.js';
// fileURLToPath(import.meta.url) converts the module's URL to a file path.
// dirname(__filename) then gives you the directory name of the current file.

// import Patrimoine from '../models/Patrimoine';
// import Possession from '../models/possessions/Possession';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const port = 5173;

app.get("/possession", (req, res) => {
    res.sendFile(__dirname + "/data/data.json");
})

app.post("/possession", (req, res) => {
    createPossession(req.body);
    res.send("200 OK")
})

app.put("/possession/:libelle", (req, res) => {
    const libelle = req.params.libelle;
    updatePossession(libelle, req.body)
    res.send("200 Ok")
})


app.listen(port, () => {
    console.log(`listen to port ${port}...`)
})

//remember my futur self: this is a the link where u found how to do it in the first place : 
// https://dev.to/faraib/how-to-setup-a-local-endpoint-with-express-and-nodejs-54p5