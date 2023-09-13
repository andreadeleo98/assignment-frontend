import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";

// Definizione degli stili per il componente
const useStyles = makeStyles(() => ({
  headerCell: {
    fontWeight: "bold",
    display: "table-cell",
  },
  dataCell: {
    width: "25%", // Regola questo valore in base alle tue esigenze
  },
}));

// Definizione del componente CustomTable
function CustomTable({ data }) {
  const classes = useStyles();

  // Definizione delle colonne della tabella
  const columns = [
    { id: "distance0", label: "Disease to Distance 0" },
    { id: "distance1", label: "Disease to Distance 1" },
    { id: "drugNames", label: "Drug for Selected Marker" },
  ];

  // Determina la lunghezza massima tra i due array
  const maxLength = Math.max(
    data.distance0 ? data.distance0.length : 0,
    data.distance1 ? data.distance1.length : 0,
    data.drugNames ? data.drugNames.length : 0
  );

  // Rendering del componente
  return (
    // Contenitore della tabella
    <TableContainer>
      {/* Tabella */}
      <Table>
        {/* Corpo della tabella */}
        <TableBody>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} className={classes.headerCell}>
                {/* Etichetta della colonna */}
                {column.label}
              </TableCell>
            ))}
          </TableRow>
          {/* Utilizza un ciclo per creare le righe della tabella */}
          {Array.from({ length: maxLength }, (_, index) => (
            <TableRow key={`row-${index}`}>
              {/* Cella per la colonna "Disease to Distance 0" */}
              <TableCell className={classes.dataCell}>
                {/* Verifica se l'indice è inferiore alla lunghezza dell'array distance0 e mostra il valore corrispondente */}
                {index < data.distance0.length ? data.distance0[index] : ""}
              </TableCell>
              {/* Cella per la colonna "Disease to Distance 1" */}
              <TableCell className={classes.dataCell}>
                {/* Verifica se l'indice è inferiore alla lunghezza dell'array distance1 e mostra il valore corrispondente */}
                {index < data.distance1.length ? data.distance1[index] : ""}
              </TableCell>
              {/* Cella per la colonna "Drug for Selected Marker" */}
              <TableCell className={classes.dataCell}>
                {/* Verifica se l'indice è inferiore alla lunghezza dell'array drugNames e mostra il valore corrispondente */}
                {index < data.drugNames.length ? data.drugNames[index] : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Definizione dei tipi delle proprietà
CustomTable.propTypes = {
  data: PropTypes.shape({
    distance0: PropTypes.arrayOf(PropTypes.string).isRequired,
    distance1: PropTypes.arrayOf(PropTypes.string).isRequired,
    drugNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default CustomTable;
