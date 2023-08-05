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
        const { definition } = props;
        let { parameterValues: defaultParameters } = props;
        const { datasets, parameters, datasetList, userScript, reportState } = definition;
        let { reportItems, } = definition;
        reportItems = clone(reportItems, true);
        this.definition = { datasets, reportItems, parameters, datasetList, userScript, reportState };
        this.commonFunctions = getCommonFunctions(true);
        this.myFunctions = {}; /* ToDo: Need to implement */

        if (typeof defaultParameters !== "object") {
            defaultParameters = {};
        }

        this.state = { hasParameters: false, defaultParameters, parameterValues: { ...defaultParameters } };
        this.reportStateChanged = new EventEmitter();
    }

    componentDidMount() {
        const { api } = this.props;
        if (api) {
            api(this.externalApi);
        }
        this.initParameters();
    }

    externalApi = {
        showParameters: () => {
            const { hasParameters } = this.state;
            if (hasParameters) {
                this.setState({ showParameters: true });
            }
        },
        getParameters: () => this.state.parameterValues,
        canShowParams: () => this.state.hasParameters && !this.state.showParameters,
        isParamsMode: () => this.state.showParameters,
        hasParameters: () => this.state.hasParameters
    };

    initParameters() {
        const { parameters } = this.definition;
        let { parameterValues } = this.state;

        if (parameters && parameters.length > 0) {
            const newParamValues = parameters.reduce((prms, p) => {
                if (prms[p.name] === undefined) {
                    prms[p.name] = p.defaultValue;
                }
                return prms;
            }, parameterValues);
            parameterValues = { ...newParamValues };

            this.setState({ hasParameters: true, showParameters: true, dataReady: false });
        } else {
            this.updateParameters();
        }
    }

    contextProps = {
        ...this.sharedProps,
        getDataset: id => this.datasets[id],
        compileGroup: (group, getReportState) => {
            const {
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
        trackState: this.trackState.bind(this),
        getMenuItems: (menuId) => {
            const { reportItems } = this.definition;
            const menuModel = reportItems.filter(r => r.type === "MNU" && r.data.id === menuId)[0];
            if (!menuModel) {
                return [];
            }
            const { items } = menuModel.data;
            return items;
        }
    };

    trackState(callback) {
        const stateList = [];
        const reportState = (name) => {
            const value = this.getReportState(name);
            if (stateList.indexOf(name) === -1) {
                stateList.push(name);
            }
            return value;
        };
        callback(reportState);

        if (!stateList.length) { return; }

        const newCallback = (arg) => {
            if (arg.some(sl => stateList.indexOf(sl) > -1)) {
                callback(reportState);
            }
        };

        this.reportStateChanged.on("stateChanged", newCallback);

        return () => this.reportStateChanged.off("stateChanged", newCallback);
    }

    // #region expression parser

    compileExpression(expr, stateTracker) {
        const {
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
        if (!this.reportState) { throw new Error("Report state is not available in this scope"); }

        const changedStates = [];

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
            this.setReportStateValue(name, value);
        }

        if (changedStates.length) {
            this.reportStateChanged.emit("stateChanged", changedStates);
        }
    }

    setReportStateValue(name, value) {
        if (!~this.reportStateKeys.indexOf(name)) { throw new Error("Invalid report state item: ", name); }
        const oldValue = this.reportState[name];
        if (oldValue !== value) {
            this.reportState[name] = value;
            return true;
        }
    }

    getReportState = (name) => {
        if (!this.reportState) { throw new Error("Report state is not available in this scope"); }
        this.reportStateRequested(name);
        return this.reportState[name];
    };

    reportStateRequested(name) {
        // ToDo: track and use for re-render call
    }

    async tryParseExpression(item) {
        if (typeof item !== "object") { return item; }
        if (item.expression) {
            const pfunc = await this.parseExpr(item.expression);
            if (typeof pfunc === "function") {
                return pfunc();
            }
            else {
                return pfunc;
            }
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
        this.setState({ parameterValues, showParameters: false }, () => {
            this.resolveDatasets().then(async r => {
                await this.initReportState();
                this.initCustomFunctions();
                this.setState({ dataReady: true });
            });
        });
    };

    initCustomFunctions() {
        this.myFunctions = this.compileMyFunctions(this.definition.userScript);
    }

    async initReportState() {
        const { reportState } = this.definition;
        if (!reportState) { this.reportState = {}; this.reportStateKeys = []; return; }
        if (!Array.isArray(reportState)) { throw new Error("Report definition is invalid. Report state corrupted"); }
        if (!reportState.length) { this.reportState = {}; this.reportStateKeys = []; return; }
        const newReportState = await reportState.reduce(async (stt, val) => {
            stt = await stt;
            const value = await this.tryParseExpression(val.value);
            stt[val.name] = value;
            return stt;
        }, Promise.resolve({}));
        this.reportState = newReportState;
        this.reportStateKeys = Object.keys(newReportState);
    }

    render() {
        const { showParameters, parameterValues, dataReady } = this.state;
        const { definition } = this;

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
