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
                    throw new Error('Ooops il y a une erreur !>_<!');
                }
                return response.json();
            })
            .then(data => {
                const patrimoinesTableauFiltrer = data.map(objet => objet.model == "Patrimoine");
                setPatrimoines(patrimoinesTableauFiltrer);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleDateChange = (event, index) => {
        setDateFin(prevDates => ({
            ...prevDates, [index]: event.target.value
        }));
    };

    const handleSubmit = (index) => {
        const date = new Date(dateFin[index]);
        if (isNaN(date.getTime())) {
            alert("Entrez une date valide !");
            return;
        }

        let patrimoine = patrimoines[index];
        let possessions = patrimoine.data.possessions;
        const total = possessions.reduce((sum, possession) => {
            let dateDebut = new Date(possession.dateDebut);
            let valeurActuelle = possession.valeur - (date.getTime() - dateDebut.getTime()) * (possession.tauxAmortissement || 0) / 100 / (1000 * 3600 * 24 * 365);
            return sum + valeurActuelle;
        }, 0);

        setValeursTotales(prevValeurs => ({
            ...prevValeurs, [index]: total
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
                                onChange={(e) => handleDateChange(e, index)}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={() => handleSubmit(index)}>Calculer</Button>
                    </Form>
                    {valeursTotales[index] !== undefined && (
                        <div className="mt-4">
                            <h4>Valeur Totale à la Date Sélectionnée: {valeursTotales[index].toFixed(2)}€</h4>
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

export default TableauPatrimoine;
