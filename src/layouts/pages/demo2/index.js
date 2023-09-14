import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table2"; // Importa il componente della tabella
import axios from "axios";
import resultsTableData from "layouts/pages/demo2/data/resultsTableData"; // Importa i dati di esempio

function DataTables() {
  // Definisci lo stato per i dati della tabella
  const [tableData, setTableData] = useState(resultsTableData);

  // Ottieni i parametri di ricerca dall'URL
  const searchParams = new URLSearchParams(document.location.search);
  const markers = searchParams.get("markers");
  const markerArray = markers.split(",");
  const formattedMarkers = markerArray.slice(0, -1).join(",");

  // Effetto di caricamento dei dati dalla chiamata API
  useEffect(() => {
    // Array per le promesse delle chiamate API
    const apiPromises = [];

    // Prima chiamata API
    const apiCall1 = axios.get(
      `http://localhost:8080/api/similaritiesGs/trovaDiseaseName2PerDistance?marcatori=${formattedMarkers}`
    );
    apiPromises.push(apiCall1);

    // Seconda chiamata API
    const apiCall2 = axios.get(
      `http://localhost:8080/api/drugBank/byUniprotIds?uniprotIds=${formattedMarkers}`
    );
    apiPromises.push(apiCall2);

    // Attendi che tutte le chiamate API vengano completate
    Promise.all(apiPromises)
      .then((responses) => {
        // Esegui il parsing delle risposte
        const responseData1 = responses[0].data;
        const responseData2 = responses[1].data;

        // Ottieni l'ultimo elemento di markerArray
        const lastMarker = markerArray[markerArray.length - 1];

        // Rimuovi gli elementi duplicati e l'elemento uguale all'ultimo elemento di markerArray da distance0
        const filteredDistance0 = responseData1.distance0.filter(
          (item, index, self) => self.indexOf(item) === index && item !== lastMarker
        );

        // Rimuovi gli elementi duplicati e l'elemento uguale all'ultimo elemento di markerArray da distance1
        const filteredDistance1 = responseData1.distance1.filter(
          (item, index, self) => self.indexOf(item) === index && item !== lastMarker
        );

        // Rimuovi gli elementi presenti in distance0 da distance1
        const filteredDistance1WithoutDuplicates = filteredDistance1.filter(
          (item) => !filteredDistance0.includes(item)
        );

        // Crea un oggetto con i dati filtrati dalla prima chiamata API
        const filteredData = {
          distance0: filteredDistance0,
          distance1: filteredDistance1WithoutDuplicates,
        };

        // Concatena i dati dalla seconda chiamata API (responseData2) come necessario
        filteredData.drugNames = responseData2;

        // Aggiorna lo stato con i dati combinati
        setTableData(filteredData);
        console.log(filteredData);
      })
      .catch((error) => {
        console.error("Errore nelle chiamate API", error);
      });
  }, [formattedMarkers]); // Dipendenza dell'effetto: viene eseguito quando formattedMarkers cambia

  // Rendering del componente
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1}>
              <MDTypography variant="h4" fontWeight="medium">
                Disease Risk and Possible Drugs
              </MDTypography>
              <MDTypography variant="h6" color="text">
                Selected {markerArray[markerArray.length - 1]} Markers: {formattedMarkers}
              </MDTypography>
            </MDBox>

            {/* Renderizza il componente Table passando i dati */}
            <Table data={tableData} />
          </Card>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;
