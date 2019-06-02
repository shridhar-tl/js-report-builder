import React, { PureComponent } from "react";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import ReportControlBase from "./ReportControlBase";
import Button from "../../Common/Button";
import DraggableHandle from "../DragDrop/DraggableHandle";
import "./ReportParameters.scss";
import SelectDataset from "../Common/SelectDataset";

class ReportParameters extends ReportControlBase {
    constructor(props) {
        super(props);
        this.state = { parameters: props.parameters || [], editedParam: null, editIndex: null };
    }

    showAddPopup = () => {
        this.setState({ showAddDialog: true, editedParam: {}, editIndex: this.state.parameters.length });
    };

    hideAddPopup = () => {
        this.setState({ showAddDialog: false, editedParam: null, editIndex: null });
    };

    editClicked = index => {
        var { parameters } = this.state;
        this.setState({ showAddDialog: true, editedParam: parameters[index], editIndex: index });
    };

    removeParameter = index => {
        var { parameters } = this.state;
        parameters.splice(index, 1);
        parameters = [...parameters];
        this.setState({ parameters });
        this.props.onChange(parameters);
    };

    saveParameter = param => {
        var { parameters, editIndex } = this.state;
        parameters[editIndex] = param;
        parameters = [...parameters];
        editIndex = null;
        this.setState({ parameters, editIndex, showAddDialog: false });
        this.props.onChange(parameters);
    };

    render() {
        var { showAddDialog, parameters, editedParam } = this.state;
        return (
            <div>
                {parameters.map((param, index) => (
                    <DraggableHandle itemType="RPT_PARM" item={param} key={param.name}>
                        <div>
                            <span>{param.name}</span>
                            <i className="fa fa-edit" onClick={() => this.editClicked(index)} title="Edit parameter properties" />
                            <i className="fa fa-times" onClick={() => this.removeParameter(index)} title="Remove parameter" />
                        </div>
                    </DraggableHandle>
                ))}
                {showAddDialog && (
                    <EditParameter parameter={editedParam} hideAddPopup={this.hideAddPopup} onChange={this.saveParameter} />
                )}
            </div>
        );
    }
}

export default ReportParameters;

const paramTypes = [
    { label: "Text", value: "TXT" },
    { label: "Checkbox", value: "CHK" },
    { label: "Yes / No Slider", value: "YNS" },
    { label: "Integer", value: "INT" },
    { label: "Number", value: "NUM" },
    { label: "Dropdown", value: "DDL" },
    { label: "Autocomplete", value: "AC" },
    { label: "Date", value: "DTE" },
    { label: "Date Range", value: "DR" },
    { label: "User group", value: "UG" }
];

class EditParameter extends PureComponent {
    constructor(props) {
        super(props);
        var { parameter = {} } = props;
        this.state = { parameter: { ...parameter }, showDialog: true };
    }

    saveParameter = () => {
        this.setState({ showDialog: true });
        this.props.onChange(this.state.parameter);
    };

    hideAddPopup = () => {
        this.props.hideAddPopup();
        this.setState({ showDialog: false });
    };

    updateValue = event => {
        var ctl = event.currentTarget;
        var field = ctl.getAttribute("field");
        var value = ctl.value;
        var type = ctl.type;

        if (type === "checkbox") {
            value = ctl.checked;
        }
        this.updateFieldValue(field, value);
    };

    updateFieldValue = (field, value) => {
        var { parameter } = this.state;
        parameter[field] = value;
        parameter = { ...parameter };
        var isParamValid = this.isParamValid(parameter);
        this.setState({ parameter, isParamValid });
    };

    isParamValid(param) {
        if (!param) {
            return false;
        }

        if (!param.name) {
            return false;
        }
        if (param.name.length < 3) {
            return false;
        }

        if (!param.display) {
            return false;
        }
        if (param.display.length < 3) {
            return false;
        }

        if (!param.type) {
            return false;
        }

        return true;
    }

    render() {
        var { showDialog, parameter, isParamValid } = this.state;
        var { updateValue, updateFieldValue } = this;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hideAddPopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveParameter} disabled={!isParamValid} label="Save" />
            </div>
        );

        return (
            <Dialog
                header="Parameter properties"
                visible={showDialog}
                footer={footer}
                style={{ width: "50vw" }}
                modal={true}
                onHide={this.hideAddPopup}>
                <TabView>
                    <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                        <div>
                            <div>
                                <label>Name:</label>
                                <input type="text" field="name" value={parameter.name} onChange={updateValue} />
                            </div>
                            <div>
                                <label>Display text:</label>
                                <input type="text" field="display" value={parameter.display} onChange={updateValue} />
                            </div>
                            <div>
                                <label>Param type:</label>
                                <Dropdown
                                    value={parameter.type}
                                    options={paramTypes}
                                    onChange={e => updateFieldValue("type", e.value)}
                                    placeholder="Select a Parameter type"
                                />
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={parameter.allowNulls}
                                        field="allowNulls"
                                        onChange={updateValue}
                                    />
                                    This field is not mandatory
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={parameter.allowMultiple}
                                        field="allowMultiple"
                                        onChange={updateValue}
                                    />
                                    This is a multi value field
                                </label>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Available values">
                        <div>
                            <label>Dataset</label>
                            <SelectDataset value={parameter.dataset}
                                onChange={ds => updateFieldValue("dataset", ds)}></SelectDataset>
                        </div>
                        <div>
                            <label>Display field</label>
                            <input type="text" mod={parameter.displayField} />
                        </div>
                        <div>
                            <label>Value field</label>
                            <input type="text" ngModel={parameter.valueField} />
                        </div>
                    </TabPanel>
                    <TabPanel header="Default values">This option is not yet implemented.</TabPanel>
                    <TabPanel header="Validations">This option is not yet implemented.</TabPanel>
                </TabView>
            </Dialog>
        );
    }
}
