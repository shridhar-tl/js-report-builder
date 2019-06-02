import React from "react";
import "./App.scss";
import ReportBuilder from "./Components/ReportBuilder/ReportBuilder";
import "font-awesome/css/font-awesome.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import data from "./testdata";

function App() {
    return (
        <div className="report-builder-container">
            <ReportBuilder data={data} />
        </div>
    );
}

export default App;
