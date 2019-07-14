import React, { PureComponent } from "react";
import Button from "../../Common/Button";
import { Dialog } from "primereact/dialog";
import { RadioButton } from 'primereact/radiobutton';
import { SplitButton } from 'primereact/splitbutton';
import { TabView, TabPanel } from 'primereact/tabview';
import JsonTree from "../../Common/JsonTree";
import array from "../../../Common/linq";
import "./Dataset.scss";
import { MultiSelect } from "primereact/multiselect";
import { UUID } from "../../../Common/HelperFunctions";
import SelectDataset from "../Common/SelectDataset";
import SelectParameter from "../Common/SelectParameter";
import ExpressionList from "../Common/ExpressionList";
import ExpressionEditor from "../Common/ExpressionEditor";
import { getDatasetTypes } from "../../../Common/ReportConfig";
import { getDatasetDefinition } from "../../../Common/DatasetTypes";
import PropertiesDialogBase from "../Common/PropertiesDialogBase";
import NameField from "../Common/NameField";

class Datasets extends PureComponent {
    constructor(props) {
        super(props);
        this.datasetTypes = getDatasetTypes(true);
        this.state = { datasets: props.datasets || {}, datasetList: props.datasetList || [] };
    }

    showPopup = () => {
        this.setState({ showAddDialog: true, editedDataset: {} });
    };

    onHide = () => {
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
                    datasetId = this.updateDataset(editedDataset, datasetId);
                });
            }).then(data => {
                editedDataset.definition = getDatasetDefinition(data);
                datasetId = this.updateDataset(editedDataset, datasetId);
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
        return editIndex;
    };

    isNameUnique = (name) => {
        var { datasetList, datasets } = this.state;
        name = name.toLowerCase();
        return !datasetList.some(dn => datasets[dn].name.toLowerCase() === name);
    }

    render() {
        var { datasets, datasetList, showAddDialog, editedDataset } = this.state;

        return (
            <div className="set-list">
                {datasetList.map(d => {
                    var ds = datasets[d];
                    var { definition, name, type } = ds;
                    var { label, allowEdit } = this.datasetTypes[type];

                    return (
                        <div key={d} className="set">
                            <div className="title">
                                <div className="pull-left" title={label}>{name}</div>
                                <div className="pull-right">
                                    {allowEdit !== false && <Button icon="fa fa-edit" type="default" title="Edit this dataset" onClick={() => this.editDataset(d)} />}
                                    <Button icon="fa fa-times" type="danger" onClick={() => this.deleteDataset(d)} title="Remove this dataset" />
                                </div>
                            </div>
                            <div>{definition && <JsonTree items={definition} />}</div>
                        </div>
                    )
                })}
                <div style={{ clear: "both" }} />

                {showAddDialog && (!editedDataset || !editedDataset.type) && (
                    <DatasetType parameter={editedDataset} onHide={this.onHide} onChange={this.typeSelected} isNameUnique={this.isNameUnique} />
                )}

                {showAddDialog && (editedDataset && editedDataset.type === "EXP") && (
                    <ExpressionDataset
                        datasets={datasets}
                        datasetList={datasetList}
                        dataset={editedDataset}
                        onHide={this.onHide}
                        onChange={this.saveDataset}
                    />
                )}

                {showAddDialog && (editedDataset && editedDataset.type === "FLT") && (
                    <FlatternDataset
                        datasets={datasets}
                        datasetList={datasetList}
                        dataset={editedDataset}
                        onHide={this.onHide}
                        onChange={this.saveDataset}
                    />
                )}

                {showAddDialog && (editedDataset && editedDataset.type === "HTP") && (
                    <HttpDataset
                        definition={editedDataset}
                        onHide={this.onHide}
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

    onHide = () => {
        this.props.onHide();
        this.setState({ showDialog: false });
    };

    updateValue = event => {
        var ctl = event.currentTarget;
        var field = ctl.getAttribute("field");
        var value = ctl.value;
        this.updateFieldValue(field, value);
    };

    updateFieldValue = (field, value) => {
        var { duplicateName } = this.state;
        if (field === "name") { duplicateName = false; }

        this.setState({ [field]: value, duplicateName }, () => {
            this.setState({ isPropsValid: !duplicateName && !!(this.state.name && this.state.type && this.state.name.length > 3) });
        });
    };

    done = () => {
        var { type, name } = this.state;

        if (!this.props.isNameUnique(name)) {
            this.setState({ duplicateName: true, isPropsValid: false });
            return;
        }

        this.setState({ showDialog: false });
        this.props.onChange(type, name);
    };

    render() {
        var { showDialog, isPropsValid, duplicateName } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.onHide} label="Cancel" />
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
                onHide={this.onHide}>
                <div className="padding-15">
                    <div className="padding-v-10">
                        <label>Dataset name:</label>
                        <NameField field="name" onChange={val => this.updateFieldValue("name", val)} />
                        {duplicateName && <span className="error-message">Dataset name must be unique</span>}
                    </div>
                    {this.datasetTypes.map((ds, i) => (
                        <div key={i} className="padding-5">
                            <RadioButton inputId={"rbDSType_" + ds.type} value={ds.type} name="datasetType" disabled={ds.disabled}
                                onChange={e => this.updateFieldValue("type", e.value)} checked={this.state.type === ds.type} />
                            <label htmlFor={"rbDSType_" + ds.type}>{ds.label}</label>
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

    onHide = () => {
        this.props.onHide();
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
        var { expression, dependencies, paramDependency } = this.state;
        var { dataset } = this.props;
        dataset = { ...dataset, expression, paramDependency, dependencies: dependencies.map(d => d.id) };
        this.setState({ showDialog: false });
        this.props.onChange(dataset);
    };

    render() {
        var { showDialog, isPropsValid, expression, datasets, dependencies, paramDependency } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.onHide} label="Cancel" />
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
                onHide={this.onHide}>
                <div className="field-collection">
                    <div>
                        <label>Dataset dependencies:</label>
                        <MultiSelect
                            optionLabel="name"
                            value={dependencies}
                            options={datasets}
                            onChange={e => this.updateFieldValue("dependencies", e.value)}
                            placeholder="Choose one or more datasets"
                        />
                    </div>
                    <div>
                        <label>Parameter dependencies</label>
                        <SelectParameter value={paramDependency} multiselect={true} onChange={val => this.updateFieldValue("paramDependency", val)} />
                    </div>
                    <div>
                        <label>Expression:</label>
                        <ExpressionEditor
                            expression={expression}
                            isStrict={true}
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

    onHide = () => {
        this.props.onHide();
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
                <Button type="default" icon="fa fa-times" onClick={this.onHide} label="Cancel" />
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
                onHide={this.onHide}>
                <div className="field-collection">
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

class HttpDataset extends PropertiesDialogBase {
    constructor(props) {
        super(props, "HTTP dataset properties", null, true);
        this.state.definition.method = this.state.definition.method || "GET";
    }

    httpVerbs = [
        { label: "GET", command: () => this.setValue("method", "GET") },
        { label: "POST", command: () => this.setValue("method", "POST") }
    ];

    validateField(definition) {
        var isPropsValid = true;
        return { definition, isPropsValid };
    }

    render() {
        var { setValue, state: { definition: { url, paramDependency, method, body, params, headers } } } = this;

        return super.renderBase(
            <div className="field-collection">
                <div>
                    <label>Parameter dependencies</label>
                    <SelectParameter value={paramDependency} multiselect={true} onChange={val => setValue("paramDependency", val)} />
                </div>
                <div>
                    <label>Request method & url</label>
                    <div>
                        <SplitButton appendTo={document.body} className="p-button-secondary pull-left" label={method} model={this.httpVerbs}></SplitButton>
                        <ExpressionEditor
                            className="pull-left"
                            expression={url}
                            autoDetect={true}
                            onChange={expr => setValue("url", expr)}
                        />
                    </div>
                </div>
                <div>
                    <TabView>
                        <TabPanel header="Params">
                            <ExpressionList autoDetect={true} value={params} nameField="name" valueField="value" onChange={list => setValue("params", list)} />
                        </TabPanel>
                        <TabPanel header="Body" disabled={method === "GET"}>
                            <ExpressionEditor
                                expression={body}
                                wordWrap={true}
                                autoDetect={true}
                                onChange={expr => setValue("body", expr)}
                            />
                        </TabPanel>
                        <TabPanel header="Header">
                            <ExpressionList autoDetect={true} value={headers} nameField="name" valueField="value" onChange={list => setValue("headers", list)} />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        );
    }
}