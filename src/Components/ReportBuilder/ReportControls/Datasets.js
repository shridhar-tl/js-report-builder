import React, { PureComponent } from "react";
import Button from "../../Common/Button";
import { Dialog } from "primereact/dialog";
import JsonTree from "../../Common/JsonTree";
import array from "../../../Common/linq";
import "./Dataset.scss";
import { MultiSelect } from "primereact/multiselect";
import { UUID } from "../../../Common/HelperFunctions";

class Datasets extends PureComponent {
    constructor(props) {
        super(props);
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
        this.setState({ showAddDialog: true, editedDataset: datasets[datasetId], editIndex: datasetId });
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
        this.setState({ showAddDialog: true, editedDataset: { type, name } });
    }

    saveDataset = dataset => {
        var { datasets, editIndex } = this.state;

        if (!editIndex) {
            editIndex = UUID.generate();
        }

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
    }

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
            </div>
        );
    }
}

export default Datasets;

var datasetTypes = [
    /*{ type: 'JQL', label: 'JQL search result' },
    { type: 'PLS', label: 'Project list' },
    { type: 'STS', label: 'Status list' },
    { type: 'ITL', label: 'Issue type list' },*/
    { type: "HTP", label: "Online dataset (http request)" },
    { type: "FIL", label: "File dataset (CSV, EXCEL or JSON files)" },
    { type: "FLT", label: "Flatern dataset (generate dataset by flatening other dataset)" },
    { type: "EXP", label: "Expression dataset (generate dataset using other dataset)" }
];

class DatasetType extends PureComponent {
    constructor() {
        super();
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
                    {datasetTypes.map((ds, i) => (
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
        var { datasets, datasetList } = props;
        this.state = {
            showDialog: true,
            datasets: array(datasetList.map(ds => datasets[ds]))
                .sortBy("name")
                .toArray()
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
                isPropsValid: !!(this.state.expression && this.state.dependency && this.state.dependency.length > 0)
            });
        });
    };

    done = () => {
        var { expression, dependency } = this.state;
        var { dataset } = this.props;
        dataset = { ...dataset, expression, dependency };
        this.setState({ showDialog: false });
        this.props.onChange(dataset);
    };

    render() {
        var { showDialog, isPropsValid, expression, datasets, dependency } = this.state;

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
                        <label>Expression:</label>
                        <input type="text" field="expression" value={expression} onChange={this.updateValue} />
                    </div>
                    <div>
                        <label>Dependencies:</label>
                        <MultiSelect
                            optionLabel="name"
                            value={dependency}
                            options={datasets}
                            onChange={e => this.updateFieldValue("dependency", e.value)}
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}
