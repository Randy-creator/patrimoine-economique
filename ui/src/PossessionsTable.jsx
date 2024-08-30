import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import Patrimoine from "../../models/Patrimoine.js";
import Personne from "../../models/Personne.js";
import Possession from "../../models/possessions/Possession.js";
import Flux from "../../models/possessions/Flux.js";
import CreatePossessionForm from "./components/createPossession.jsx";

const PossessionsTable = () => {
  const [possessions, setPossessions] = useState([]);
  const [dateFin, setDateFin] = useState("");
  const [patrimoine, setPatrimoine] = useState(null);
  const [resultat, setResultat] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPossession, setSelectedPossession] = useState(null);
  const [updateLibelle, setUpdateLibelle] = useState("");
  const [updateDateFin, setUpdateDateFin] = useState("");

  useEffect(() => {
    const possesseur = new Personne("John Doe");
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/possession");
        const result = await response.json();
        const possessions = result[1].data.possessions;
        const possessionList = [];

        for (const possession of possessions) {
          if (possession.jour === undefined) {
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
        console.error("Erreur lors de la récupération des données:", error.message);
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

      const possessionWithInvalidDate = possessions.find(
        (possession) => date < new Date(possession.dateDebut),
      );
      if (possessionWithInvalidDate) {
        setResultat(
          "Le calcul du patrimoine ne peut pas se faire car certaines possessions ne sont pas encore acquises à cette date.",
        );
        return;
      }

      const valeur = patrimoine.getValeur(date);
      if (isNaN(valeur)) {
        setResultat("Les valeurs saisies ne sont pas valides!");
      } else {
        setResultat(
          `Le patrimoine de ${patrimoine.possesseur.nom} à la date ${date.toLocaleDateString()} est de : ${valeur} Ar`,
        );
      }
    } else {
      setResultat("Date de fin ou patrimoine non défini");
    }
  };

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedPossession(null);
    setUpdateLibelle("");
    setUpdateDateFin("");
  };

  const handleShowUpdateModal = (possession) => {
    setSelectedPossession(possession);
    setUpdateLibelle(possession.libelle);
    setUpdateDateFin(possession.dateFin || "");
    setShowUpdateModal(true);
  };

  const handleUpdatePossession = () => {
    if (!selectedPossession) return;

    fetch(`http://localhost:3000/possession/${selectedPossession.libelle}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        libelle: updateLibelle,
        dateFin: updateDateFin
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update possession");
        }
        return response.json();
      })
      .then(() => {
        setPossessions((prev) =>
          prev.map((pos) =>
            pos.libelle === selectedPossession.libelle
              ? { ...pos, libelle: updateLibelle, dateFin: updateDateFin }
              : pos,
          ),
        );
        handleCloseUpdateModal();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Erreur lors de la mise à jour de la possession");
      });
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
            <th>Actions</th>
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
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>
                {possession.dateFin
                  ? new Date(possession.dateFin).toLocaleDateString()
                  : "Non défini"}
              </td>
              <td>
                {possession.tauxAmortissement
                  ? `${possession.tauxAmortissement} %`
                  : ""}
              </td>
              <td>
                <Button
                  onClick={() => handleShowUpdateModal(possession)}
                  variant="success"
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleClosePossession(possession.libelle)}
                  variant="danger"
                >
                  Close
                </Button>
              </td>
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
        <Button variant="success" onClick={handleShowCreateModal}>
          Ajouter une nouvelle possession
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

      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une nouvelle possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreatePossessionForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour la possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPossession && (
            <Form>
              <Form.Group controlId="updateLibelle">
                <Form.Label>Libellé</Form.Label>
                <Form.Control
                  type="text"
                  value={updateLibelle}
                  onChange={(e) => setUpdateLibelle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="updateDateFin">
                <Form.Label>Date de Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={updateDateFin}
                  onChange={(e) => setUpdateDateFin(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdatePossession}>
            update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PossessionsTable;
