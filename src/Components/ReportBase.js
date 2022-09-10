import { PureComponent } from 'react';
import { compileExpression } from '../Common/Compiler';
import { getDatasetTypes } from '../Common/ReportConfig';

class ReportBase extends PureComponent {
    constructor(props) {
        super(props);

        this.datasetTypes = getDatasetTypes(true);

        this.sharedProps = {
            buildMyFunctions: (script) => {
                const { data = this.definition } = this.state;
                let { userScript } = data;

                if (script) {
                    userScript = script;
                }

                if (userScript) {
                    const funcObj = this.compileMyFunctions(userScript);

                    data.myFunctions = Object.keys(funcObj);
                    data.userScript = userScript;
                    this.setState({ data: { ...data } });
                    this.myFunctions = funcObj;
                } else {
                    delete data.myFunctions;
                    delete data.userScript;
                    this.setState({ data: { ...data } });
                    this.myFunctions = {};
                }
                return this.myFunctions;
            },
            resolveDataset: (dsId) => {
                this.datasets = this.datasets || {};
                if (this.isDsResolved(dsId)) {
                    return Promise.resolve(this.datasets[dsId]);
                }
                else {
                    return this.resolveDataset(dsId, false, true);
                }
            },
        };
    }

    compileMyFunctions(userScript) {
        if (!userScript) { return {}; }

        const {
            commonFunctions,
            contextProps: { getDataset: datasets } = {},
            state: { parameterValues: parameters, reportState }
        } = this;

        const funcScript = `${userScript}\n return this;`;

        const funcObj = compileExpression(funcScript, {
            noWrap: true, $this: {},
            commonFunctions, datasets, parameters,
            reportState,
            setReportState: this.setReportState ? this.setReportState.bind(this) : () => { console.log("Report state is not available currently"); }
        });

        return funcObj;
    }

    resolveDatasets(refresh) {
        let promises = null;
        if (!this.isAnyDSUnresolved()) {
            promises = [];
        } else {
            promises = this.iterateAndResolveDS(refresh);
            if (!promises || promises.length === 0) {
                throw new Error("No datasets to resolve. This could be caused due to the circular dependency!");
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
        const { datasetList } = this.definition;
        if (!datasetList || !datasetList.length) { return false; }
        return datasetList.some(dsId => !this.isDsResolved(dsId));
    }

    isDsResolved(dsId) {
        const data = this.datasets[dsId];
        return !!data || data === false;
    }

    iterateAndResolveDS(refresh) {
        const { definition: { datasetList } } = this;

        const promises = [];

        for (const dsId of datasetList) {
            const resolver = this.resolveDataset(dsId, refresh);
            promises.push(resolver);
        }
        return promises;
    }

    async resolveDataset(dsId, refresh, resolveDependency) {
        const { definition: { datasets, parameters } = this.state.data } = this;

        let parameterTemplate = {};
        if (parameters && Array.isArray(parameters)) {
            parameterTemplate = parameters.reduce((tmpl, param) => {
                tmpl[param.name] = param;
                return tmpl;
            }, parameterTemplate);
        }

        const dataset = datasets[dsId];
        let dependency = dataset.dependencies || [];
        if (!Array.isArray(dependency)) {
            dependency = [dependency];
        }

        if (~dependency.indexOf(dsId)) {
            throw new Error("A dataset cannot depend on itself. Malformed report definition");
        }

        // ToDo: Correct following check to loop through dependency in datasetList and see if it is valid
        //if (!~datasetList.indexOf(dsId)) { throw "Invalid dataset dependency specified"; }

        if (dependency.some(d => !this.isDsResolved(d))) {
            if (resolveDependency) {
                await Promise.all(dependency.map(async d => await this.resolveDataset(d)));
            }
            else {
                return;
            }
        }

        // ToDo: loop through paramDependency and return if not available

        if (refresh || !this.datasets[dsId]) {
            const props = {
                dataset,
                parameters: this.state.parameterValues,
                parameterTemplate,
                getDataset: dsId => datasets[dsId],
                commonFunctions: { ...this.commonFunctions },
                myFunctions: { ...this.myFunctions }
            };

            let data = await this.datasetTypes[dataset.type].resolve(props, rdsId => this.datasets[rdsId]);
            if (!data) { data = []; }

            this.datasets[dsId] = data;
            this.datasets[dataset.name] = data;

            return data;
        }
    }
}


export default ReportBase;