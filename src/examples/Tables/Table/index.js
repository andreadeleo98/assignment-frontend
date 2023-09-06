import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  headerCell: {
    fontWeight: "bold",
    minWidth: "100px", // Adjust this value as needed
  },
}));

function CustomTable({ data }) {
  const classes = useStyles();

  // Define your table columns
  const columns = [
    { id: "drugBankId", label: "ID" },
    { id: "drugName", label: "Name" },
    { id: "uniprotId", label: "Proteins" },
    { id: "custom", label: "Actions" }, // Custom column for buttons
  ];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} className={classes.headerCell}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.drugBankId}>
              <TableCell>{row.drugBankId}</TableCell>
              <TableCell>{row.drugName}</TableCell>
              <TableCell>{row.uniprotId.join(", ")}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary">
                  Action
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      drugBankId: PropTypes.string.isRequired,
      drugName: PropTypes.string.isRequired,
      uniprotId: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default CustomTable;
