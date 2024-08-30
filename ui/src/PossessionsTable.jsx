import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import Patrimoine from "../../models/Patrimoine.js";
import Personne from "../../models/Personne.js";
import Possession from "../../models/possessions/Possession.js";
import BienMateriel from "../../models/possessions/BienMateriel.js";
import Flux from "../../models/possessions/Flux.js";

const PossessionsTable = () => {
  const [possessions, setPossessions] = useState([]);
  const [dateFin, setDateFin] = useState("");
  const [patrimoine, setPatrimoine] = useState(null);
  const [resultat, setResultat] = useState("");

  useEffect(() => {
    const possesseur = new Personne("John Doe");
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5371/possession");
        const result = await response.json();
        const possessions = result[1].data.possessions;
        const possessionList = [];

        for (const possession of possessions) {
          if (possession.jour == undefined) {
            possessionList.push(
              new Possession(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin,
                possession.tauxAmortissement,
              ),
            );
          } else {
            possessionList.push(
              new Flux(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin,
                possession.tauxAmortissement,
                possession.jour,
              ),
            );
          }
        }

        const patrimoine = new Patrimoine(possesseur, possessionList);
        setPatrimoine(patrimoine);
        setPossessions(possessionList);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message,
        );
        console.error("Détails:", error);
      }
    }

    fetchData();
  }, []);

  const handleCalculate = () => {
    if (patrimoine && dateFin) {
      const date = new Date(dateFin);
      if (isNaN(date.getTime())) {
        setResultat("Format de Date non valide!");
        return;
      }

      // Vérifier si la dateFin est inférieure à la dateDebut pour chaque possession
      const possessionWithInvalidDate = possessions.find(
        (possession) => date < new Date(possession.dateDebut),
      );
      if (possessionWithInvalidDate) {
        setResultat(
          "Le calcul du patrimoine ne peut pas se faire car certaines possessions ne sont pas encore aquis a cette date.",
        );
        return;
      }

      const valeur = patrimoine.getValeur(date);
      if (isNaN(valeur)) {
        setResultat("Les valeurs saisies ne sont pas valides!");
      } else {
        setResultat(
          `Le patrimoine de ${
            patrimoine.possesseur.nom
          } à la date ${date.toLocaleDateString()} est de : ${valeur} Ar`,
        );
      }
    } else {
      setResultat("Date de fin ou patrimoine non défini");
    }
  };

  return (
    <div>
      <h3 id="guy">Propriétaire : {patrimoine?.possesseur.nom}</h3>
      <Table id="table" striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur Initiale</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
            <th>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>
                {possession instanceof Flux
                  ? "0 Ar"
                  : `${possession.valeur} Ar`}
              </td>
              {/**Initialise le flux a 0 et biens materiel a sa valeur iniitiale */}
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>
                {possession.dateFin
                  ? new Date(possession.dateFin).toLocaleDateString()
                  : dateFin}
              </td>
              <td>
                {possession.tauxAmortissement
                  ? `${possession.tauxAmortissement} %`
                  : ""}
              </td>
              <td>{`${possession.getValeur(
                new Date(dateFin || Date.now()),
              )} Ar`}</td>
              {/** récuperera et affichera directement la valeur actuelle
               * en se basant sur la date d'aujourd'hui mais sera modifiée
               * en fonction de dateFin selectionnée  */}
            </tr>
          ))}
        </tbody>
      </Table>
      <div id="dateFinContainer">
        <Form.Group controlId="dateFin">
          <Form.Control
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </Form.Group>
        <Button id="btn" onClick={handleCalculate}>
          Calculer le patrimoine
        </Button>
      </div>

      <Form.Group controlId="resultat">
        <Form.Control
          type="text"
          placeholder="Résultat"
          value={resultat}
          readOnly
        />
      </Form.Group>
    </div>
  );
};

export default PossessionsTable;