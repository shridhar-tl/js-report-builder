import React, { PureComponent } from "react";
import Button from "../../Common/Button";
import { Dialog } from "primereact/dialog";
import JsonTree from "../../Common/JsonTree";
import array from "../../../Common/linq";
import "./Dataset.scss";
import { MultiSelect } from "primereact/multiselect";
import { UUID } from "../../../Common/HelperFunctions";
import SelectDataset from "../Common/SelectDataset";
import ExpressionList from "../Common/ExpressionList";
import ExpressionEditor from "../Common/ExpressionEditor";
import { getDatasetTypes } from "../../../Common/ReportConfig";
import { getDatasetDefinition } from "../../../Common/DatasetTypes";

class Datasets extends PureComponent {
    constructor(props) {
        super(props);
        this.datasetTypes = getDatasetTypes(true);
        this.state = { datasets: props.datasets || {}, datasetList: props.datasetList || [] };
    }

    showAddPopup = () => {
        this.setState({ showAddDialog: true, editedDataset: {} });
    };

    hideAddPopup = () => {
        this.setState({ showAddDialog: false, editedDataset: null, editIndex: null });
    };

    editDataset(datasetId) {
        var { datasets } = this.state;
        var editedDataset = datasets[datasetId];
        this.setForEditing(editedDataset, datasetId);
    }

    setForEditing(editedDataset, datasetId) {
        var dsType = this.datasetTypes[editedDataset.type];

        if (dsType.resolveSchema) {
            new Promise((resolve, reject) => {
                dsType.resolveSchema(editedDataset.name, editedDataset.props, { resolve, reject }).then(props => {
                    editedDataset.props = props;
                    this.updateDataset(editedDataset, datasetId);
                });
            }).then(data => {
                editedDataset.definition = getDatasetDefinition(data);
                this.updateDataset(editedDataset, datasetId);
            });
        } else {
            this.setState({ showAddDialog: true, editedDataset, editIndex: datasetId });
        }
    }

    deleteDataset(datasetId) {
        var { datasets } = this.state;
        delete datasets[datasetId];
        var datasetList = Object.keys(datasets);
        this.setState({
            datasets,
            datasetList
        });

        this.props.onChange(datasets, datasetList);
    }

    typeSelected = (type, name) => {
        this.setForEditing({ type, name })
    };

    saveDataset = dataset => {
        var { editIndex } = this.state;

        this.updateDataset(dataset, editIndex);
    };

    updateDataset = (dataset, editIndex) => {
        if (!editIndex) {
            editIndex = UUID.generate();
        }

        var { datasets } = this.state;
        datasets[editIndex] = dataset;
        datasets = { ...datasets };
        var datasetList = Object.keys(datasets);
        this.setState({
            showAddDialog: false,
            editedDataset: null,
            editIndex: null,
            datasets,
            datasetList
        });

        this.props.onChange(datasets, datasetList);
    };

    render() {
        var { datasets, datasetList, showAddDialog, editedDataset } = this.state;

        return (
            <div className="set-list">
                {datasetList.map(d => (
                    <div key={d} className="set">
                        <div className="title">
                            <div className="pull-left">{datasets[d].name}</div>
                            <div className="pull-right">
                                <Button icon="fa fa-edit" type="default" onClick={() => this.editDataset(d)} />
                                <Button icon="fa fa-times" type="danger" onClick={() => this.deleteDataset(d)} />
                            </div>
                        </div>
                        <div>{datasets[d].definition && <JsonTree items={datasets[d].definition} />}</div>
                    </div>
                ))}
                <div style={{ clear: "both" }} />

                {showAddDialog && (!editedDataset || !editedDataset.type) && (
                    <DatasetType parameter={editedDataset} hideAddPopup={this.hideAddPopup} onChange={this.typeSelected} />
                )}

                {showAddDialog && (editedDataset && editedDataset.type === "EXP") && (
                    <ExpressionDataset
                        datasets={datasets}
                        datasetList={datasetList}
                        dataset={editedDataset}
                        hideAddPopup={this.hideAddPopup}
                        onChange={this.saveDataset}
                    />
                )}

                {showAddDialog && (editedDataset && editedDataset.type === "FLT") && (
                    <FlatternDataset
                        datasets={datasets}
                        datasetList={datasetList}
                        dataset={editedDataset}
                        hideAddPopup={this.hideAddPopup}
                        onChange={this.saveDataset}
                    />
                )}
            </div>
        );
    }
}

export default Datasets;

class DatasetType extends PureComponent {
    constructor() {
        super();
        this.datasetTypes = getDatasetTypes();
        this.state = { showDialog: true };
    }

    hideAddPopup = () => {
        this.props.hideAddPopup();
        this.setState({ showDialog: false });
    };

    updateValue = event => {
        var ctl = event.currentTarget;
        var field = ctl.getAttribute("field");
        var value = ctl.value;
        this.updateFieldValue(field, value);
    };

    updateFieldValue = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.setState({ isPropsValid: !!(this.state.name && this.state.type && this.state.name.length > 3) });
        });
    };

    done = () => {
        this.setState({ showDialog: false });
        var { type, name } = this.state;
        this.props.onChange(type, name);
    };

    render() {
        var { showDialog, isPropsValid, name } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hideAddPopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.done} disabled={!isPropsValid} label="Next" />
            </div>
        );

        return (
            <Dialog
                header="Choose dataset type"
                visible={showDialog}
                footer={footer}
                style={{ width: "50vw" }}
                modal={true}
                onHide={this.hideAddPopup}>
                <div>
                    <div>
                        <label>Dataset name:</label>
                        <input type="text" field="name" value={name} onChange={this.updateValue} />
                    </div>
                    {this.datasetTypes.map((ds, i) => (
                        <div map={i}>
                            <label>
                                <input type="radio" name="datasetType" value={ds.type} field="type" onChange={this.updateValue} />{" "}
                                {ds.label}
                            </label>
                        </div>
                    ))}
                </div>
            </Dialog>
        );
    }
}

class ExpressionDataset extends PureComponent {
    constructor(props) {
        super(props);
        var { datasets, datasetList, dataset } = props;

        var datasetsArr = array(datasetList.map(ds => datasets[ds]))
            .sortBy("name")
            .toArray();

        var { expression, dependencies } = dataset;

        if (dependencies) {
            dependencies = dependencies.map(d => datasets[d]);
        }

        this.state = {
            showDialog: true,
            datasets: datasetsArr,
            expression,
            dependencies
        };
    }

    hideAddPopup = () => {
        this.props.hideAddPopup();
        this.setState({ showDialog: false });
    };

    updateValue = event => {
        var ctl = event.currentTarget;
        var field = ctl.getAttribute("field");
        var value = ctl.value;
        this.updateFieldValue(field, value);
    };

    updateFieldValue = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.setState({
                isPropsValid: !!(this.state.expression && this.state.dependencies && this.state.dependencies.length > 0)
            });
        });
    };

    done = () => {
        var { expression, dependencies } = this.state;
        var { dataset } = this.props;
        dataset = { ...dataset, expression, dependencies: dependencies.map(d => d.id) };
        this.setState({ showDialog: false });
        this.props.onChange(dataset);
    };

    render() {
        var { showDialog, isPropsValid, expression, datasets, dependencies } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hideAddPopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.done} disabled={!isPropsValid} label="Save" />
            </div>
        );

        return (
            <Dialog
                header="Expression dataset properties"
                visible={showDialog}
                footer={footer}
                style={{ width: "50vw" }}
                modal={true}
                onHide={this.hideAddPopup}>
                <div>
                    <div>
                        <label>Dependencies:</label>
                        <MultiSelect
                            optionLabel="name"
                            value={dependencies}
                            options={datasets}
                            onChange={e => this.updateFieldValue("dependencies", e.value)}
                        />
                    </div>
                    <div>
                        <label>Expression:</label>
                        <ExpressionEditor
                            style={{ height: "100px" }}
                            expression={expression}
                            onChange={expr => this.updateFieldValue("expression", expr)}
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}

class FlatternDataset extends PureComponent {
    constructor(props) {
        super(props);
        var { datasets, datasetList, dataset } = props;
        console.log(props);

        var datasetsArr = array(datasetList.map(ds => datasets[ds]))
            .sortBy("name")
            .toArray();

        var { dependencies, colProps, variables, filter } = dataset;

        this.state = {
            showDialog: true,
            datasets: datasetsArr,
            colProps,
            dependencies,
            variables,
            filter
        };
    }

    hideAddPopup = () => {
        this.props.hideAddPopup();
        this.setState({ showDialog: false });
    };

    updateValue = event => {
        var ctl = event.currentTarget;
        var field = ctl.getAttribute("field");
        var value = ctl.value;
        this.updateFieldValue(field, value);
    };

    updateFieldValue = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.setState({
                isPropsValid: !!(this.state.dependencies && this.state.colProps)
            });
        });
    };

    done = () => {
        var { dependencies, variables, filter, colProps } = this.state;
        var { dataset } = this.props;
        dataset = { ...dataset, dependencies, variables, filter, colProps };
        this.setState({ showDialog: false });
        this.props.onChange(dataset);
    };

    render() {
        var { showDialog, isPropsValid, colProps, datasets, dependencies, variables, filter } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hideAddPopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.done} disabled={!isPropsValid} label="Save" />
            </div>
        );

        return (
            <Dialog
                header="Flattern dataset properties"
                visible={showDialog}
                footer={footer}
                style={{ width: "50vw" }}
                modal={true}
                onHide={this.hideAddPopup}>
                <div>
                    <div>
                        <label>Source dataset:</label>
                        <SelectDataset
                            value={dependencies}
                            options={datasets}
                            onChange={e => this.updateFieldValue("dependencies", e.value)}
                        />
                    </div>
                    <div>
                        <label>Filter constants:</label>
                        <ExpressionList
                            nameField="key"
                            valueField="expr"
                            value={variables}
                            onChange={value => {
                                this.updateFieldValue("variables", value);
                            }}
                        />
                    </div>
                    <div>
                        <label>Filter expression:</label>
                        <ExpressionEditor expression={filter} onChange={expr => this.updateFieldValue("filter", expr)} />
                    </div>
                    <div>
                        <label>Properties list:</label>
                    </div>
                    <div>
                        <textarea
                            field="colProps"
                            value={colProps}
                            onChange={this.updateValue}
                            style={{ width: "100%", height: "200px" }}
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}
