import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Button } from "@mui/material";

import Card from "@mui/material/Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import MDInput from "components/MDInput";
import resultsTableData from "layouts/pages/demo/data/resultsTableData";

function DataTables() {
  // Stati per gestire i dati e le interazioni del componente
  const [tableData, setTableData] = useState(resultsTableData);
  const [currentProteins, setCurrentProteins] = useState([]);
  const [currentDisease, setCurrentDisease] = useState({});
  const [openProteins, setOpenProteins] = useState(false);
  const [openMarkers, setOpenMarkers] = useState(false);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  // Gestisce l'evento di pressione del tasto nella barra di ricerca
  const handleKeyDown = async (event) => {
    const searchTerm = event.target.value;
    if (!searchTerm) return;
    const { data: drugsData } = await axios.get(
      `http://localhost:8080/api/aggregatedResult/searchTerm?diseaseParam=${searchTerm}`
    );
    const { data: diseaseData } = await axios.get(
      `http://localhost:8080/api/diseaseBank/byDisease?diseaseIdentifier=${searchTerm}`
    );
    setTableData(drugsData);
    setCurrentDisease(diseaseData);
  };

  // Apre la modale per visualizzare le proteine
  const handleOpen = (uniprotId) => {
    setCurrentProteins(uniprotId);
    setOpenProteins(true);
  };

  // Apre la modale per visualizzare i marker
  const openCurrentDiseases = () => {
    setOpenMarkers(true);
  };

  // Chiude le modali
  const handleClose = () => {
    setOpenMarkers(false);
    setOpenProteins(false);
  };

  // Gestisce il cambiamento di stato delle checkbox dei marker
  function handleMarkerChange(event) {
    const markerValue = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      const mergedMarkers = [...selectedMarkers, markerValue];
      // Se la casella è stata selezionata, aggiungi il marker alla lista dei markers selezionati
      setSelectedMarkers(mergedMarkers);
    } else {
      // Se la casella è stata deselezionata, rimuovi il marker dalla lista dei markers selezionati
      setSelectedMarkers(selectedMarkers.filter((marker) => marker !== markerValue));
    }
  }

  // Gestisce la conferma dei marker selezionati
  const handleConfirmMarkers = async () => {
    // Esegui una richiesta GET al tuo controller e passa i marker selezionati come parametri di query
    const markersQueryString = `markers=${selectedMarkers
      .map((marker) => encodeURIComponent(marker))
      .join(",")}`;

    // Creare la nuova URL con la query string
    const newURL = `http://localhost:3000/pages/demo2?${markersQueryString},${currentDisease.diseaseName}`;

    // Navigare alla nuova pagina
    window.location.href = newURL;

    // Chiudi la modale dei marker dopo aver eseguito la richiesta GET
    setOpenMarkers(false);
  };

  // Effetto che logga gli stati aggiornati dei marker selezionati
  useEffect(() => {
    console.log(selectedMarkers);
    // Chiamata HTTP Axios
  }, [selectedMarkers]);

  // Stile per le modali
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Rendering del componente DataTables
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Modale per visualizzare i marker */}
        <Modal
          open={openMarkers}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              ...style,
              overflowY: "auto", // Abilita lo scroll verticale
              maxHeight: "80vh", // Imposta un'altezza massima per la modale
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Markers
            </Typography>
            {/* Mappa e renderizza i marker disponibili */}
            {currentDisease?.markers?.map((marker, index) => (
              <div key={marker}>
                <input
                  type="checkbox"
                  id={`option-marker-${index}`}
                  value={marker}
                  onChange={handleMarkerChange}
                  checked={selectedMarkers.includes(marker)}
                />
                &nbsp;
                <label htmlFor={`option-marker-${index}`}>{marker}</label>
              </div>
            ))}
            <Button onClick={handleConfirmMarkers}>Conferma</Button>
          </Box>
        </Modal>

        {/* Modale per visualizzare le proteine */}
        <Modal
          open={openProteins}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              ...style,
              overflowY: "auto", // Abilita lo scroll verticale
              maxHeight: "80vh", // Imposta un'altezza massima per la modale
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Proteins
            </Typography>
            {/* Mappa e renderizza le proteine correnti */}
            {currentProteins.map((protein) => (
              <Typography key={protein} className="modal-modal-description" sx={{ mt: 2 }}>
                {protein}
              </Typography>
            ))}
          </Box>
        </Modal>

        {/* Card principale del componente */}
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h4" fontWeight="medium">
              Search disease
            </MDTypography>
          </MDBox>
          <MDInput label="Type here..." onKeyDown={debounce(handleKeyDown, 300)} />
          {/* Renderizza i dettagli sulla malattia solo se esistono */}
          {Object.keys(currentDisease).length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <MDTypography variant="h5" fontWeight="medium">
                  Disease details
                </MDTypography>
              </AccordionSummary>
              <AccordionDetails>
                <MDBox p={1} lineHeight={2}>
                  <p>
                    <strong>Disease Name:</strong> {currentDisease.diseaseName}
                  </p>
                  <p>
                    <strong>Disease ID:</strong> {currentDisease.diseaseId}
                  </p>
                  <p>
                    <strong>Markers:</strong> {currentDisease.markers.length} known markers
                    <Button onClick={openCurrentDiseases}>Show all</Button>
                  </p>
                </MDBox>
              </AccordionDetails>
            </Accordion>
          )}
          {/* Renderizza la tabella con i dati e gestisce il click sul pulsante */}
          <Table data={tableData} onButtonClick={handleOpen} />
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;
