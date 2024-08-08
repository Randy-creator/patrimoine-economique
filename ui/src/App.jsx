import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import TableauPatrimoine from './tableauPatrimoine';

const Header = () => {
  return (
    <Container className="bg-success text-light text-center my-4 h-50 w-50 rounded-pill">
      <h1 className='fs-2'>Patrimoine economique</h1>
    </Container>
  );
};


function App() {
  const patrimoineJohn = {
    model: "Patrimoine",
    data: {
      possesseur: { nom: "John Doe" },
      possessions: [
        {
          possesseur: { nom: "John Doe" },
          libelle: "MacBook Pro",
          valeur: 4000000,
          dateDebut: "2023-12-25T00:00:00.000Z",
          dateFin: null,
          tauxAmortissement: 5
        },
        {
          possesseur: { nom: "John Doe" },
          libelle: "Alternance",
          valeur: 0,
          dateDebut: "2022-12-31T21:00:00.000Z",
          dateFin: null,
          tauxAmortissement: null,
          jour: 1,
          valeurConstante: 500000
        }
      ]
    }
  };

  const patrimoineJane = {
    model: "Patrimoine",
    data: {
      possesseur: { nom: "Jane Doe" },
      possessions: [
        {
          possesseur: { nom: "Jane Doe" },
          libelle: "Appartement",
          valeur: 30000000,
          dateDebut: "2020-01-01T00:00:00.000Z",
          dateFin: null,
          tauxAmortissement: 2
        },
        {
          possesseur: { nom: "Jane Doe" },
          libelle: "Voiture",
          valeur: 1500000,
          dateDebut: "2021-05-15T00:00:00.000Z",
          dateFin: null,
          tauxAmortissement: 15
        }
      ]
    }
  };

  return (
    <div>
      <div className='header_container'>
        <Header />
      </div>
      <div>
        <TableauPatrimoine patrimoine={patrimoineJohn} />
        <TableauPatrimoine patrimoine={patrimoineJane} />
      </div>
    </div>
  );
}

export default App
F