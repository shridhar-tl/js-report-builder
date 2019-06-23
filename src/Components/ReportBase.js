import { PureComponent } from 'react';
import { compileExpression } from '../Common/Compiler';

class ReportBase extends PureComponent {
    constructor(props) {
        super(props);

        this.sharedProps = {
            buildMyFunctions: (script) => {
                var { data } = this.state;
                var { userScript } = data;
                if (script) {
                    userScript = script;
                }
                if (userScript) {
                    var funcScript = userScript + "\n return this;";
                    var funcObj = compileExpression(funcScript, { noWrap: true, $this: {} });
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
                if (this.isDsResolved(dsId)) {
                    return Promise.resolve(this.datasets[dsId]);
                }
                else {
                    return this.resolveDataset(dsId, false, true);
                }
            },
        };
    }

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
        let { definition: { datasetList } } = this;

        let promises = [];

        for (let dsId of datasetList) {
            var resolver = this.resolveDataset(dsId, refresh);
            promises.push(resolver);
        }
        return promises;
    }

    async resolveDataset(dsId, refresh, resolveDependency) {
        let { definition: { datasets, parameters } } = this;

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
            if (resolveDependency) {
                await Promise.all(dependency.map(async d => await this.resolveDataset(d)));
            }
            else {
                return;
            }
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

            var data = await this.datasetTypes[dataset.type].resolve(props, rdsId => this.datasets[rdsId]);
            if (!data) { data = []; }

            this.datasets[dsId] = data;
            this.datasets[dataset.name] = data;

            return data;
        }
    }
}


export default ReportBase;