import axios from "axios";
import { debounce } from "lodash";
import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";

// Data
import resultsTableData from "layouts/pages/demo/data/resultsTableData";

function DataTables() {
  const [tableData, setTableData] = useState(resultsTableData);

  const handleKeyDown = async (event) => {
    const searchTerm = event.target.value;
    const { data } = await axios.get(
      `http://localhost:8080/api/drugbank/aggregation?searchTerm=${searchTerm}`
    );
    setTableData({ ...tableData, rows: data });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Aggregated Results
            </MDTypography>
          </MDBox>
          <MDInput label="Type here..." onKeyDown={debounce(handleKeyDown, 300)} />
          <DataTable table={tableData} />
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DataTables;
