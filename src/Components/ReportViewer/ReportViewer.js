import React from "react";
import ReportParameters from "./ReportParameters/ReportParameters";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import { getCommonFunctions } from "../../Common/ReportConfig";
import { ViewerContext } from "./Common";
import { compileGroup, compileExpression } from "../../Common/Compiler";
import "./ReportViewer.scss";
import { clone } from "../../Common/HelperFunctions";
import ReportBase from "../ReportBase";
import { EventEmitter } from "events";

class ReportViewer extends ReportBase {
    datasets = {};
    commonFunctions;
    reportStateChanged;

    constructor(props) {
        super(props);
        var { defaultParameters = {}, definition } = props;
        var { datasets, reportItems, parameters, datasetList, userScript, reportState } = definition;
        reportItems = clone(reportItems, true);
        this.definition = { datasets, reportItems, parameters, datasetList, userScript, reportState };
        this.commonFunctions = getCommonFunctions(true);
        this.myFunctions = {}; /* ToDo: Need to implement */
        this.state = { hasParameters: false, defaultParameters, parameterValues: { ...defaultParameters } };
        this.reportStateChanged = new EventEmitter();
    }

    componentDidMount() {
        var { api } = this.props;
        if (api) {
            api(this.externalApi);
        }
        this.initParameters();
    }

    externalApi = {
        showParameters: () => {
            var { hasParameters } = this.state;
            if (hasParameters) {
                this.setState({ showParameters: true });
            }
        },
        canShowParams: () => this.state.hasParameters && !this.state.showParameters,
        isParamsMode: () => this.state.showParameters,
        hasParameters: () => this.state.hasParameters
    };

    initParameters() {
        var {
            definition: { parameters }
        } = this;
        if (parameters && parameters.length > 0) {
            this.setState({ hasParameters: true, showParameters: true, dataReady: false });
        } else {
            this.updateParameters();
        }
    }

    contextProps = {
        ...this.sharedProps,
        getDataset: id => this.datasets[id],
        compileGroup: (group, getReportState) => {
            var {
                commonFunctions,
                myFunctions,
                contextProps: { getDataset: datasets },
                state: { parameterValues: parameters }
            } = this;

            return compileGroup(group, { commonFunctions, myFunctions, datasets, parameters, getReportState });
        },
        compileExpression: this.compileExpression.bind(this),
        parseExpr: this.parseExpr.bind(this),
        setReportState: this.setReportState.bind(this),
        trackState: this.trackState.bind(this)
    };

    trackState(callback) {
        var stateList = [];
        var reportState = (name) => {
            var value = this.getReportState(name);
            if (stateList.indexOf(name) === -1) {
                stateList.push(name);
            }
            return value;
        }
        callback(reportState);

        if (!stateList.length) { return; }

        var newCallback = (arg) => {
            if (arg.some(sl => stateList.indexOf(sl) > -1)) {
                callback(reportState);
            }
        };

        this.reportStateChanged.on("stateChanged", newCallback);

        return () => this.reportStateChanged.off("stateChanged", newCallback);
    }

    // #region expression parser

    compileExpression(expr, stateTracker) {
        var {
            commonFunctions,
            myFunctions,
            contextProps: { getDataset: datasets },
            state: { parameterValues: parameters },
            setReportState, getReportState
        } = this;

        return compileExpression(expr, {
            commonFunctions, myFunctions, datasets, parameters, setReportState, getReportState: stateTracker || getReportState
        });
    }

    setReportState(name, value) {
        if (!this.reportState) { throw Error("Report state is not available in this scope"); }

        var changedStates = [];

        if (Array.isArray(name)) {
            name.forEach((k) => {
                if (this.setReportStateValue(k.name, k.value) && changedStates.indexOf(k.name) === -1) { changedStates.push(k.name); }
            });
        }
        else if (typeof key === "object") {
            Object.keys().forEach(n => {
                if (this.setReportStateValue(n, name[n]) && changedStates.indexOf(n) === -1) { changedStates.push(n); }
            });
        }
        else if (typeof name === "string") {
            this.setReportStateValue(name, value)
        }

        if (changedStates.length) {
            this.reportStateChanged.emit("stateChanged", changedStates);
        }
    }

    setReportStateValue(name, value) {
        if (!~this.reportStateKeys.indexOf(name)) { throw Error("Invalid report state item: ", name); }
        var oldValue = this.reportState[name];
        if (oldValue !== value) {
            this.reportState[name] = value;
            return true;
        }
    }

    getReportState = (name) => {
        if (!this.reportState) { throw Error("Report state is not available in this scope"); }
        this.reportStateRequested(name);
        return this.reportState[name];
    }

    reportStateRequested(name) {
        // ToDo: track and use for re-render call
    }

    tryParseExpression(item) {
        if (typeof item !== "object") { return item; }
        if (item.expression) {
            var pfunc = this.parseExpr(item.expression);
            return pfunc();
        }
    }

    parseExpr(expr, stateTracker) {
        if (!expr) { return expr; }

        if (typeof expr === "boolean") { return expr; }
        if (typeof expr !== "string") { return; }

        if (expr === "true") { return true; }
        else if (expr === "false") { return false; }

        return this.compileExpression(expr, stateTracker);
    }

    // #endregion

    updateParameters = parameterValues => {
        this.setState({ parameterValues, showParameters: false });
        this.resolveDatasets().then(r => {
            this.initCustomFunctions();
            this.initReportState();
            this.setState({ dataReady: true });
        });
    };

    initCustomFunctions() { }

    initReportState() {
        var { reportState } = this.definition;
        if (!reportState) { this.reportState = {}; this.reportStateKeys = []; return; }
        if (!Array.isArray(reportState)) { throw Error("Report definition is invalid. Report state corrupted"); }
        if (!reportState.length) { this.reportState = {}; this.reportStateKeys = []; return; }
        var newReportState = reportState.reduce((stt, val) => {
            var value = this.tryParseExpression(val.value);
            stt[val.name] = value;
            return stt;
        }, {});
        this.reportState = newReportState;
        this.reportStateKeys = Object.keys(newReportState);
    }

    render() {
        var { showParameters, parameterValues, dataReady } = this.state;
        var { definition } = this;

        return (
            <ViewerContext.Provider value={this.contextProps}>
                {showParameters && (
                    <ReportParameters definition={definition} values={parameterValues} onChange={this.updateParameters} />
                )}
                {!showParameters && !dataReady && <div>Loading...</div>}
                {!showParameters && dataReady && <ReportDisplay definition={definition} parameterValues={parameterValues} />}
            </ViewerContext.Provider>
        );
    }
}

export default ReportViewer;
