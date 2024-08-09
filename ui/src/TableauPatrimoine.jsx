import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Form } from 'react-bootstrap';

const TableauPatrimoine = () => {
    const [patrimoines, setPatrimoines] = useState([]);
    const [dateFin, setDateFin] = useState({});
    const [valeursTotales, setValeursTotales] = useState({});

    useEffect(() => {
        fetch('/data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const patrimoinesTableauFiltrer = data.filter(objet => objet.model === "Patrimoine");
                setPatrimoines(patrimoinesTableauFiltrer);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleDateChange = (event, index) => {
        setDateFin(prevDates => ({
            ...prevDates,
            [index]: event.target.value
        }));
    };

    const handleSubmit = (index) => {
        const date = new Date(dateFin[index]);
        if (isNaN(date.getTime())) {
            alert("Entrez une date valide !pls~");
            return;
        }

        const patrimoine = patrimoines[index];
        const possessions = patrimoine.data.possessions;
        const total = possessions.reduce((sum, possession) => {
            const dateDebut = new Date(possession.dateDebut);
            const valeurActuelle = possession.valeur - (date.getTime() - dateDebut.getTime()) * (possession.tauxAmortissement || 0) / 100 / (1000 * 3600 * 24 * 365);
            return sum + valeurActuelle;
        }, 0);

        setValeursTotales(valeurAfficher => ({
            ...valeurAfficher,[index]: total
        }));
    };

    return (
        <div>
            {patrimoines.map((patrimoine, index) => (
                <div key={index} className="container mt-4">
                    <h2 className="mb-4">Patrimoine de {patrimoine.data.possesseur.nom}</h2>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>Libellé</th>
                                <th>Valeur</th>
                                <th>Date Début</th>
                                <th>Taux Amortissement</th>
                                <th>Jour</th>
                                <th>Valeur Constante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patrimoine.data.possessions.map((possession, possessionIndex) => (
                                <tr key={possessionIndex}>
                                    <td>{possession.libelle}</td>
                                    <td>{possession.valeur}</td>
                                    <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                                    <td>{possession.tauxAmortissement !== null ? possession.tauxAmortissement : '0'}</td>
                                    <td>{possession.jour !== undefined ? possession.jour : '0'}</td>
                                    <td>{possession.valeurConstante !== undefined ? possession.valeurConstante : '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Date de Fin</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={dateFin[index] || ''}
                                className='w-25 border border-black'
                                onChange={(e) => handleDateChange(e, index)} 
                            />
                        </Form.Group>
                        <Button variant="success" onClick={() => handleSubmit(index)}>Calculer la valeur totale</Button>
                    </Form>
                    {valeursTotales[index] !== undefined && (
                        <div className="mt-4 d-flex justify-content-center align-items-center">
                            <h4>Valeur Totale à la Date Sélectionnée: {valeursTotales[index].toFixed(2)} mga</h4>
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

export default TableauPatrimoine;
