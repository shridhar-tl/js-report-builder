import React from "react";
import ReportParameters from "./ReportParameters/ReportParameters";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import { getDatasetTypes, getCommonFunctions } from "../../Common/ReportConfig";
import { ViewerContext } from "./Common";
import { compileGroup, compileExpression } from "../../Common/Compiler";
import "./ReportViewer.scss";
import { clone } from "../../Common/HelperFunctions";
import ReportBase from "../ReportBase";

class ReportViewer extends ReportBase {
    datasets = {};
    commonFunctions;
    constructor(props) {
        super(props);
        var { defaultParameters = {}, definition } = props;
        var { datasets, reportItems, parameters, datasetList, userScript } = definition;
        reportItems = clone(reportItems, true);
        this.definition = { datasets, reportItems, parameters, datasetList, userScript };
        this.datasetTypes = getDatasetTypes(true);
        this.commonFunctions = getCommonFunctions(true);
        this.myFunctions = {}; /* ToDo: Need to implement */
        this.state = { defaultParameters, parameterValues: { ...defaultParameters } };
    }

    componentDidMount() {
        this.initParameters();
    }

    initParameters() {
        var {
            definition: { parameters }
        } = this;
        if (parameters && parameters.length > 0) {
            this.setState({ hasParameters: true, showParameters: true, dataReady: false });
        }
    }

    contextProps = {
        ...this.sharedProps,
        getDataset: id => this.datasets[id],
        compileGroup: group => {
            var {
                commonFunctions,
                myFunctions,
                contextProps: { getDataset: datasets },
                state: { parameterValues: parameters }
            } = this;
            return compileGroup(group, {
                commonFunctions, myFunctions, datasets, parameters,
                reportState: this.state.reportState
            });
        },
        compileExpression: expr => {
            var {
                commonFunctions,
                myFunctions,
                contextProps: { getDataset: datasets },
                state: { parameterValues: parameters }
            } = this;
            return compileExpression(expr, {
                commonFunctions, myFunctions, datasets, parameters
            });
        }
    };

    updateParameters = parameterValues => {
        this.setState({ parameterValues, showParameters: false });
        this.resolveDatasets().then(r => this.setState({ dataReady: true }));
    };

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
