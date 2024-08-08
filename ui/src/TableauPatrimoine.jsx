import React from 'react';

const TableauPatrimoine = ({ patrimoine }) => {
    const { possesseur, possessions } = patrimoine.data;

    return (
        <div>
            <h2>Patrimoine de {possesseur.nom}</h2>
            <table border="2" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    {possessions.map((possession, index) => (
                        <tr key={index}>
                            <td>{possession.libelle}</td>
                            <td>{possession.valeur}</td>
                            <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                            <td>{possession.tauxAmortissement !== null ? possession.tauxAmortissement : 'N/A'}</td>
                            <td>{possession.jour !== undefined ? possession.jour : 'N/A'}</td>
                            <td>{possession.valeurConstante !== undefined ? possession.valeurConstante : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableauPatrimoine;
