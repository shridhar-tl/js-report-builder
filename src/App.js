import React from "react";
import "./App.scss";
import { ReportBuilder, initReportBuilder } from "./lib";
import "font-awesome/css/font-awesome.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import data from "./testdata";

var defaultConfig = {
    parameterTypes: {
        UG: { label: "User group", control: <div /> },
        DDL: false
    },
    datasetTypes: {
        JQL: { label: "JQL search result", getSchema: name => {}, getData: schema => {} },
        PLS: { label: "Project list", getSchema: name => {}, getData: schema => {} },
        STS: { label: "Status list", getSchema: name => {}, getData: schema => {} },
        ITL: { label: "Issue type list", getSchema: name => {}, getData: schema => {} }
    },
    builtInFields: {
        UserDateFormat: { value: "", helpText: "Provides the date format of the current user" },
        UserTimeFormat: { value: "" },
        UserDateTimeFormat: { value: "" },
        RenderFormat: { value: "" }
    },
    commonFunctions: {
        getDateRange: {
            value: function(from, to) {},
            helpText: "Returns an array with the list of available dates between the provided from and to date"
        },
        getUsersFromGroup: { value: function(group) {} }
    }
};

function App() {
    initReportBuilder(defaultConfig);

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
