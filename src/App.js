import React, { Component } from "react";
import "./App.scss";
import { ReportBuilder, ReportViewer, initReportBuilder } from "./lib";
import "font-awesome/css/font-awesome.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Button from "./Components/Common/Button";
import data, { userDaywiseReport } from "./testdata";

var defaultConfig = {
    parameterTypes: {
        UG: { label: "User group", control: Button }
        //DDL: false // To remove a default param type do this.
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
        getUsersFromGroup: { value: function(group) {} }
    }
};

class App extends Component {
    constructor() {
        super();
        this.state = { preview: false };
    }

    componentDidMount() {
        initReportBuilder(defaultConfig);
    }

    viewPreview = () => {
        var { preview } = this.state;
        this.setState({ preview: !preview });
    };

    render() {
        var { preview } = this.state;
        return (
            <div className="report-builder-container">
                <div style={{ width: "100%", height: "45px" }}>
                    <Button type="success" label={preview ? "View Builder" : "View Preview"} onClick={this.viewPreview} />
                </div>
                <div style={{ width: "100%", height: "calc(100vh - 46px)", overflow: "auto" }}>
                    {!preview && <ReportBuilder definition={userDaywiseReport} />}
                    {preview && <ReportViewer definition={userDaywiseReport} />}
                </div>
            </div>
        );
    }
}

export default App;
