import React, { PureComponent } from "react";
import "./App.scss";
import { ReportBuilder, ReportViewer, initReportBuilder } from "./lib";
import "font-awesome/css/font-awesome.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Button from "./Components/Common/Button";
import axios from "axios";
import { userDaywiseReport, datasets, userList, projects, issuetypes, customfields, rapidview, tempData } from './testdata'

var subReports = [
    { id: 1, name: "User daywise report", definition: userDaywiseReport },
    { id: 2, name: "Temp report", definition: tempData }
];

// This is the default configuration object to be passed to "initReportBuilder" function.
var defaultConfig = {
    compiler: function (code, sandbox) { return Function(...sandbox, code)(); },
    parameterTypes: {
        UG: {
            label: "User group",
            control: function (props) {
                console.log("Props received for User group control", props);
                return React.createElement(
                    "span",
                    {
                        onClick: () => {
                            props.onChange(props.definition, userList);
                            alert("This is dummy parameter");
                        },
                        className: "ctl-ug"
                    },
                    "Select users"
                );
            }
        }
        //DDL: false // To remove a default param type do this.
    },
    datasetTypes: {
        JQL: {
            label: "JQL search result",
            resolveSchema: (name, props, promise) => {
                promise.resolve(datasets.JQL);
                return Promise.resolve(props);
            },
            resolveData: props => {
                return Promise.resolve(datasets.JQL);
            }
        },
        PLS: {
            label: "Project list", allowEdit: false,
            resolveSchema: (name, props, promise) => {
                promise.resolve(projects);
                return Promise.resolve(props);
            },
            resolveData: props => Promise.resolve(projects)
        },
        ITL: {
            label: "Issue type list", allowEdit: false,
            resolveSchema: (name, props, promise) => {
                promise.resolve(issuetypes);
                return Promise.resolve(props);
            },
            resolveData: props => Promise.resolve(issuetypes)
        },
        RPV: {
            label: "Rapid view list (sprint board list)", allowEdit: false,
            resolveSchema: (name, props, promise) => {
                promise.resolve(rapidview);
                return Promise.resolve(props);
            },
            resolveData: props => Promise.resolve(rapidview)
        },
        CUF: {
            label: "Custom fields list", allowEdit: false,
            resolveSchema: (name, props, promise) => {
                promise.resolve(customfields);
                return Promise.resolve(props);
            },
            resolveData: props => Promise.resolve(customfields)
        },
        STS: {
            label: "Status list", allowEdit: false,
            resolveSchema: (name, props, promise) => {
                promise.resolve(projects);
                return Promise.resolve(props);
            },
            resolveData: props => { Promise.resolve(null) }
        },
        HTP: true,
        FIL: true,
        STC: true
    },
    builtInFields: {
        UserDateFormat: { value: "", helpText: "Provides the date format of the current user" },
        UserTimeFormat: { value: "" },
        UserDateTimeFormat: { value: "" },
        RenderFormat: { value: "" }
    },
    commonFunctions: {
        getUsersFromGroup: { value: function (group) { } },
        getJiraIssueUrl: { value: function (jiraIssueKey) { } },
        getUserProfileUrl: { value: function (userName) { } },
        getTicketDetails: { value: function (ticketsList, fields) { } },
        executeJQL: { value: function (jql, fields) { } },
        bookmarkTicket: { value: function (jiraIssueKey) { } },
        addWorklog: {
            value: function (jiraIssueKey, defaultValues) {
                // date, comment, hours
            }
        },
        editWorklog: {
            value: function (jiraIssueKey, defaultValues) {
                // date, comment, hours
            }
        },
        saveAsFile: {
            value: function (content, filename) {
                // content can be string or byte array
            }
        }
    },
    subReports,
    resolveReportDefinition: (reportId) => {
        return Promise.resolve((subReports.filter(r => r.id === reportId)[0] || {}).definition);
    },
    resolveHttpRequest: (method, url, data, headers) => {
        var params = data;
        if ((method || "GET").toUpperCase() === "GET") { data = undefined; }
        else { params = undefined; }

        return axios({ method, url, params, data, headers }).then(d => d.data);
    }
};

class App extends PureComponent {
    constructor() {
        super();
        this.state = { preview: false, reportDefinition: tempData || userDaywiseReport };
    }

    componentWillMount() {
        initReportBuilder(defaultConfig);
    }

    copyDefinition = () => {
        this.copyStringToClipboard(JSON.stringify(this.builderAPI.getReportDefinition()));
    }

    copyStringToClipboard(str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }

    viewPreview = () => {
        var { preview } = this.state;
        var newState = { preview: !preview };

        if (!preview) {
            newState.reportDefinition = this.builderAPI.getReportDefinition();
        }

        this.setState(newState);
    };

    render() {
        var { preview, reportDefinition } = this.state;
        return (
            <div className="report-builder-container">
                <div style={{ width: "100%", height: "45px" }}>
                    <Button type="success" label={preview ? "View Builder" : "View Preview"} onClick={this.viewPreview} />
                    {!preview && <Button className="pull-right" type="success" label="Copy Definition" onClick={this.copyDefinition} />}
                </div>
                <div style={{ width: "100%", height: "calc(100vh - 46px)", overflow: "auto" }}>
                    {!preview && (
                        <ReportBuilder
                            definition={reportDefinition}
                            api={api => (this.builderAPI = api)}
                            onChange={data => {
                                this.setState({ reportDefinition: data });
                                console.log("Report definition modified: ", data);
                            }}
                        />
                    )}
                    {preview && <ReportViewer definition={reportDefinition} parameterValues={{ userList }} />}
                </div>
            </div>
        );
    }
}

export default App;
