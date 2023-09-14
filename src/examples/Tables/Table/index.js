import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";

const useStyles = makeStyles(() => ({
  headerCell: {
    fontWeight: "bold",
    display: "table-cell",
  },
  dataCell: {
    width: "25%",
  },
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "15px",
  },
  itemsPerPage: {
    marginRight: "20px",
  },
}));

function CustomTable({ data, onButtonClick }) {
  const classes = useStyles();

  const [itemsPerPage, setItemsPerPage] = useState(10); // Impostazione predefinita per il numero di elementi per pagina
  const [page, setPage] = useState(1);

  const handleChangeItemsPerPage = (event) => {
    setItemsPerPage(event.target.value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const columns = [
    { id: "drugBankId", label: "Drug ID" },
    { id: "drugName", label: "Drug Name" },
    { id: "custom", label: "Show Proteins" },
  ];

  return (
    <>
      <div className={classes.pagination}>
        <div className={classes.itemsPerPage}>
          <Select
            value={itemsPerPage}
            onChange={handleChangeItemsPerPage}
            style={{ width: "50px", height: "30px" }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
        <Pagination
          count={Math.ceil(data.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} className={`${classes.headerCell} ${classes.dataCell}`}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
          <TableBody>
            {currentPageData.map((row) => (
              <TableRow key={row.drugBankId}>
                <TableCell className={classes.dataCell}>{row.drugBankId}</TableCell>
                <TableCell className={classes.dataCell}>{row.drugName}</TableCell>
                <TableCell className={classes.dataCell}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onButtonClick(row.uniprotId)}
                    style={{ color: "white" }}
                  >
                    Proteins
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

CustomTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      drugBankId: PropTypes.string.isRequired,
      drugName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default CustomTable;
