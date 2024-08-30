import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PossessionList = () => {
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    async function fetchPossessions() {
      const response = await fetch("http://localhost:3000/possession");
      const data = await response.json();
      setPossessions(data);
    }

    fetchPossessions();
  }, []);

  return (
    <div>
      <h2>Liste des Possessions</h2>
      <Link to="/possession/creatingPossession" className="btn btn-primary mb-3">
        Créer une Possession
      </Link>
      <Link to="/" className="btn btn-primary mb-3">
        Retourner a l'acceuil
      </Link>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((p, index) => (
            <tr key={index}>
              <td>{p.libelle}</td>
              <td>{p.valeur} Ar</td>
              <td>{new Date(p.dateDebut).toLocaleDateString()}</td>
              <td>
                {p.dateFin
                  ? new Date(p.dateFin).toLocaleDateString()
                  : "En cours"}
              </td>
              <td>{p.tauxAmortissement}%</td>
              <td>
                <Link
                  to={`/possession/${p.libelle}/update`}
                  className="btn btn-warning mr-2"
                >
                  Modifier
                </Link>
                <Button
                  onClick={() => {
                    fetch(
                      `http://localhost:5173/possession/${p.libelle}/close`,
                      { method: "PUT" },
                    );
                    // Reload after close
                    setPossessions((prev) =>
                      prev.map((pos) =>
                        pos.libelle === p.libelle
                          ? {
                            ...pos,
                            dateFin: new Date().toISOString().split("T")[0],
                          }
                          : pos,
                      ),
                    );
                  }}
                  variant="danger"
                >
                  Clôturer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PossessionList;
