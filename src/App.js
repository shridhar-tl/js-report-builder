import React from "react";
import "./App.scss";
import ReportBuilder from "./Components/ReportBuilder/ReportBuilder";
import "font-awesome/css/font-awesome.min.css";
import "./theme.scss";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import data from "./testdata";

function App() {
    return (
        <div className="report-builder-container">
            <div style={{ width: "100%", height: "45px" }} />
            <div style={{ width: "100%", height: "calc(100vh - 46px)", overflow: "auto" }}>
                <ReportBuilder data={data} />
            </div>
        </div>
    );
}

export default App;
