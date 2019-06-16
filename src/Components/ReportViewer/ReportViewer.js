import React, { PureComponent } from "react";
import ReportParameters from "./ReportParameters/ReportParameters";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import { getDatasetTypes, getCommonFunctions } from "../../Common/ReportConfig";
import { ViewerContext } from "./Common";
import { compileGroup, compileExpression } from "../../Common/Compiler";
import "./ReportViewer.scss";
import { clone } from "../../Common/HelperFunctions";

class ReportViewer extends PureComponent {
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
        getDataset: id => this.datasets[id],
        compileGroup: group => {
            var {
                commonFunctions,
                myFunctions,
                contextProps: { getDataset: datasets },
                state: { parameterValues: parameters }
            } = this;
            return compileGroup(group, { commonFunctions, myFunctions, datasets, parameters });
        },
        compileExpression: expr => {
            var {
                commonFunctions,
                myFunctions,
                contextProps: { getDataset: datasets },
                state: { parameterValues: parameters }
            } = this;
            return compileExpression(expr, { commonFunctions, myFunctions, datasets, parameters });
        }
    };

    updateParameters = parameterValues => {
        this.setState({ parameterValues, showParameters: false });
        this.resolveDatasets().then(r => this.setState({ dataReady: true }));
    };

    resolveDatasets(refresh) {
        var promises = null;
        if (!this.isAnyDSUnresolved()) {
            promises = [];
        } else {
            promises = this.iterateAndResolveDS(refresh);
            if (!promises || promises.length === 0) {
                throw Error("No datasets to resolve. This could be caused due to the circular dependency!");
            }
        }

        return Promise.all(promises).then(() => {
            // IF their are any dataset which is not yet resolved then reiterate the dataset
            if (this.isAnyDSUnresolved()) {
                return this.resolveDatasets();
            } else {
                return true;
            }
        });
    }

    isAnyDSUnresolved() {
        var { datasetList } = this.definition;
        return datasetList.some(dsId => !this.isDsResolved(dsId));
    }

    isDsResolved(dsId) {
        var data = this.datasets[dsId];
        return !!data || data === false;
    }

    iterateAndResolveDS(refresh) {
        let {
            definition: { datasetList, datasets, parameters }
        } = this;

        let promises = [];

        for (let dsId of datasetList) {
            let dataset = datasets[dsId];
            var dependency = dataset.dependencies || [];
            if (!Array.isArray(dependency)) {
                dependency = [dependency];
            }

            if (~dependency.indexOf(dsId)) {
                throw { message: "A dataset cannot depend on itself. Malformed report definition" };
            }

            // ToDo: Correct following check to loop through dependency in datasetList and see if it is valid
            //if (!~datasetList.indexOf(dsId)) { throw "Invalid dataset dependency specified"; }

            if (dependency.some(d => !this.isDsResolved(d))) {
                continue;
            }
            if (refresh || !this.datasets[dsId]) {
                var props = {
                    dataset,
                    parameters: this.parameterValues,
                    parameterTemplate: parameters,
                    getDataset: dsId => {
                        return datasets[dsId];
                    },
                    commonFunctions: { ...this.commonFunctions },
                    myFunctions: { ...this.myFunctions }
                };

                var resolver = this.datasetTypes[dataset.type].resolve(props, rdsId => this.datasets[rdsId]);

                promises.push(
                    resolver.then(data => {
                        this.datasets[dsId] = data;
                        this.datasets[dataset.name] = data;
                    })
                );
            }
        }
        return promises;
    }

    render() {
        var { showParameters, parameterValues, dataReady } = this.state;
        var { definition } = this;
        //var { } = definition;

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
