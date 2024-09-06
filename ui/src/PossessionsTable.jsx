import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import Patrimoine from "./models/Patrimoine.js";
import Personne from "./models/Personne.js";
import Possession from "./models/possessions/Possession.js";
import Flux from "./models/possessions/Flux.js";
import CreatePossessionForm from "./components/createPossession.jsx";

const PossessionsTable = () => {
  const [possessions, setPossessions] = useState([]);
  const [patrimoine, setPatrimoine] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPossession, setSelectedPossession] = useState(null);
  const [updateLibelle, setUpdateLibelle] = useState("");
  const [updateDateFin, setUpdateDateFin] = useState("");

  useEffect(() => {
    const possesseur = new Personne("John Doe");

    const fetchData = async () => {
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
                possession.dateFin ? new Date(possession.dateFin) : null,
                possession.tauxAmortissement,
              )
            );
          } else {
            possessionList.push(
              new Flux(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin ? new Date(possession.dateFin) : null,
                possession.tauxAmortissement,
                possession.jour,
              )
            );
          }
        }

        const patrimoineInstance = new Patrimoine(possesseur, possessionList);
        setPatrimoine(patrimoineInstance);
        setPossessions(possessionList);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error.message);
      }
    };

    fetchData();
  }, []);

  
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
    setUpdateDateFin(possession.dateFin ? new Date(possession.dateFin).toISOString().substring(0, 10) : "");
    setShowUpdateModal(true);
  };

  const handleUpdatePossession = async () => {
    if (!selectedPossession) return;

    try {
      const response = await fetch(`http://localhost:3000/possession/${selectedPossession.libelle}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libelle: updateLibelle,
          dateFin: updateDateFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update possession");
      }

      setPossessions((prev) =>
        prev.map((pos) =>
          pos.libelle === selectedPossession.libelle
            ? { ...pos, libelle: updateLibelle, dateFin: updateDateFin }
            : pos
        )
      );
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de la mise à jour de la possession");
    }
  };

  const handleClosePossession = async (libelle) => {
    try {
      const response = await fetch(`http://localhost:3000/possession/${libelle}/close`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to close possession");
      }

      setPossessions((prev) =>
        prev.map((pos) =>
          pos.libelle === libelle ? { ...pos, dateFin: new Date().toISOString().substring(0, 10) } : pos
        )
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de la fermeture de la possession");
    }
  };

  return (
    <div>
      <h3 id="guy">Propriétaire : {patrimoine?.possesseur.nom}</h3>
      <Table id="table" striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Libellé</th>
            <th style={{ width: '10%' }}>Valeur Initiale</th>
            <th style={{ width: '10%' }}>Date Début</th>
            <th style={{ width: '10%' }}>Date Fin</th>
            <th style={{ width: '5%' }}>Amortissement</th>
            <th style={{ width: '15%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{possession instanceof Flux ? "0 Ar" : `${possession.valeur} Ar`}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : "Non défini"}</td>
              <td>{possession.tauxAmortissement ? `${possession.tauxAmortissement} %` : ""}</td>
              <td className="container d-flex justify-content-around">
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

      <Button variant="success" onClick={handleShowCreateModal} className="container d-flex justify-content-center mt-6">
        Ajouter une nouvelle possession
      </Button>

     

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
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="date"
                value={updateDateFin}
                onChange={(e) => setUpdateDateFin(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdatePossession}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PossessionsTable;
