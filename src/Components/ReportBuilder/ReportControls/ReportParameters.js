import React, { PureComponent } from "react";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from "primereact/dropdown";
import ReportControlBase from "./ReportControlBase";
import Button from "../../Common/Button";
import DraggableHandle from "../DragDrop/DraggableHandle";
import "./ReportParameters.scss";
import SelectDataset from "../Common/SelectDataset";
import { getParamTypes, supportedFileTypes } from "../../../Common/ReportConfig";
import { Checkbox } from "primereact/checkbox";
import InputParameter from "../../Common/InputParameter";
import { BuilderContext } from "../Common/Constants";
import Droppable from "../DragDrop/Droppable";

class ReportParameters extends ReportControlBase {
    constructor(props) {
        super(props);
        this.state = { parameters: props.parameters || [], editedParam: null, editIndex: null };
    }

    showPopup = () => {
        this.setState({ showAddDialog: true, editedParam: {}, editIndex: this.state.parameters.length });
    };

    onHide = () => {
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

    moveItem = (srcIndex, destIndex) => {
        var { parameters } = this.state;
        var [movedItem] = parameters.splice(srcIndex, 1);
        parameters.splice(destIndex, 0, movedItem);
        parameters = [...parameters];
        this.setState({ parameters });
        this.props.onChange(parameters);
    }

    isNameUnique = (name) => {
        var { parameters } = this.state;
        name = name.toLowerCase();
        return !parameters.some(p => p.name.toLowerCase() === name);
    }

    render() {
        var { showAddDialog, parameters, editedParam } = this.state;
        return (
            <>
                <div className="params-list">
                    {parameters.map((param, index) => (
                        <DraggableHandle index={index} itemType="RPT_PARM" item={param} key={param.name}>
                            {({ connectDragSource }) => <Droppable index={index} type={["RPT_PARM"]} onItemMoved={this.moveItem}>
                                <div className="param">
                                    {connectDragSource(<span className="cr-move" title={param.display}>{param.name}</span>)}
                                    <i className="fa fa-edit" onClick={() => this.editClicked(index)} title="Edit parameter properties" />
                                    <i className="fa fa-times" onClick={() => this.removeParameter(index)} title="Remove parameter" />
                                </div>
                            </Droppable>}
                        </DraggableHandle>
                    ))}
                </div>
                {showAddDialog && (
                    <EditParameter parameter={editedParam} onHide={this.onHide} onChange={this.saveParameter} isNameUnique={this.isNameUnique} />
                )}
            </>
        );
    }
}

export default ReportParameters;

class EditParameter extends PureComponent {
    static contextType = BuilderContext

    constructor(props) {
        super(props);
        var { parameter = {} } = props;
        this.paramTypes = getParamTypes(true);
        this.state = { parameter: { ...parameter }, paramType: this.paramTypes[parameter.type], showDialog: true };
    }

    saveParameter = () => {
        if (this.state.parameter.name !== (this.props.parameter || {}).name && !this.props.isNameUnique(this.state.parameter.name)) {
            this.setState({ duplicateName: true, isParamValid: false });
            return;
        }
        this.setState({ showDialog: false });
        this.props.onChange(this.state.parameter);
    };

    onHide = () => {
        this.props.onHide();
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
        var { parameter, duplicateName } = this.state;
        parameter[field] = value;

        if (field === "name") {
            duplicateName = false;
        }
        else if (field === "type") {
            delete parameter.fileTypes;
            delete parameter.defaultValue;
            delete parameter.mask;
            delete parameter.slotChar;
            delete parameter.minVal;
            delete parameter.maxVal;
        }

        if (!parameter.dataset) {
            delete parameter.displayField;
            delete parameter.valueField;
        }

        parameter = { ...parameter };

        var isParamValid = this.isParamValid(parameter);
        this.setState({ parameter, isParamValid, duplicateName });
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

        if (param.type === "MASK" && !param.mask) {
            return false;
        }

        if (param.dataset && !param.displayField) {
            return false;
        }

        return true;
    }

    resolveDataset = (dsId) => {
        return this.context.resolveDataset(dsId);
    }

    render() {
        var { showDialog, parameter, isParamValid, noMultiValue, paramType, duplicateName } = this.state;
        var { updateValue, updateFieldValue } = this;
        var { value: pTypeName, allowedValidations = [] } = paramType || {};

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.onHide} label="Cancel" />
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
                onHide={this.onHide}>
                <TabView>
                    <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                        <div className="field-collection" style={{ height: "240px" }}>
                            <div className="mandatory">
                                <label>Param type:</label>
                                <Dropdown
                                    value={parameter.type}
                                    options={getParamTypes()}
                                    onChange={e => {
                                        var paramType = this.paramTypes[e.value];
                                        this.setState({
                                            paramType, noMultiValue: paramType.supportMultiValue === false
                                        });
                                        updateFieldValue("type", e.value);
                                    }}
                                    placeholder="Select a Parameter type"
                                />
                            </div>
                            <div className="mandatory">
                                <label>Name:</label>
                                <InputText keyfilter="alphanum" field="name" value={parameter.name} onChange={updateValue} />
                                {duplicateName && <span className="error-message">Parameter name must be unique</span>}
                            </div>
                            <div className="mandatory">
                                <label>Display text:</label>
                                <InputText field="display" value={parameter.display} onChange={updateValue} />
                            </div>
                            <div>
                                <Checkbox
                                    inputId="cbAllowMultiple"
                                    disabled={noMultiValue}
                                    checked={parameter.allowMultiple}
                                    onChange={e => updateFieldValue("allowMultiple", e.checked)}
                                />
                                <label htmlFor="cbAllowMultiple"><span style={{ marginLeft: '3px' }}>This is a multi value field</span></label>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Available values" disabled={!parameter.type || parameter.type === "FILE"}>
                        <div className="field-collection">
                            <div>
                                <label>Dataset</label>
                                <SelectDataset value={parameter.dataset} onChange={ds => { delete parameter.defaultValue; updateFieldValue("dataset", ds); }} />
                            </div>
                            <div className={parameter.dataset ? "mandatory" : ""}>
                                <label>Display field</label>
                                <InputText value={parameter.displayField} disabled={!parameter.dataset} field="displayField" onChange={updateValue} />
                            </div>
                            <div>
                                <label>Value field</label>
                                <InputText value={parameter.valueField} disabled={!parameter.dataset} field="valueField" onChange={updateValue} />
                            </div>
                            <div>
                                <label>Default value</label>
                                <InputParameter definition={parameter} value={parameter.defaultValue} resolveDataset={this.resolveDataset}
                                    onChange={(d, val) => updateFieldValue("defaultValue", val)} />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Validations" disabled={!parameter.type}>
                        <div className="field-collection">
                            <div>
                                <Checkbox
                                    inputId="cbAllowNulls"
                                    checked={parameter.allowNulls}
                                    onChange={e => updateFieldValue("allowNulls", e.checked)}
                                />
                                <label htmlFor="cbAllowNulls">
                                    <span style={{ marginLeft: '3px' }}>This field is not mandatory</span>
                                </label>
                            </div>
                            {pTypeName === "MASK" && <div className="mandatory">
                                <label>Mask template</label>
                                <InputParameter definition={{ type: "TXT" }} value={parameter.mask}
                                    onChange={(d, val) => updateFieldValue("mask", val)} />
                            </div>}
                            {pTypeName === "MASK" && <div>
                                <label>Slot template</label>
                                <InputParameter definition={{ type: "TXT" }} value={parameter.slotChar}
                                    onChange={(d, val) => updateFieldValue("slotChar", val)} />
                            </div>}
                            {allowedValidations.indexOf("regex") >= 0 && <div>
                                <label>Regular expression</label>
                                <InputParameter definition={{ type: "TXT" }} value={parameter.regex}
                                    onChange={(d, val) => updateFieldValue("regex", val)} />
                            </div>}
                            {allowedValidations.indexOf("keyfilter") >= 0 && <div>
                                <label>Key filter (Regular expression)</label>
                                <InputParameter definition={{ type: "TXT" }} value={parameter.keyfilter}
                                    onChange={(d, val) => updateFieldValue("keyfilter", val)} />
                            </div>}
                            {allowedValidations.indexOf("filetypes") >= 0 && <div>
                                <label>Allowed file types</label>
                                <InputParameter definition={{
                                    type: "DDL", allowMultiple: true, valueField: "value", displayField: "label",
                                    placeholder: "All known files are allowed"
                                }}
                                    value={parameter.fileTypes} dataset={supportedFileTypes}
                                    onChange={(d, val) => updateFieldValue("fileTypes", val)} />
                            </div>}
                            {(allowedValidations.indexOf("length") >= 0 || allowedValidations.indexOf("range") >= 0) && <div>
                                <label>Range of value (length / count)</label>
                                <div>
                                    <div className="pull-left" style={{ width: '10%' }}>
                                        <InputParameter definition={{ type: "INT" }} value={parameter.minVal}
                                            onChange={(d, val) => updateFieldValue("minVal", val)} /></div>
                                    <div className="pull-left" style={{ padding: '5px' }}>-</div>
                                    <div className="pull-left" style={{ width: '10%' }}>
                                        <InputParameter definition={{ type: "INT" }} value={parameter.maxVal}
                                            onChange={(d, val) => updateFieldValue("maxVal", val)} />
                                    </div>
                                </div>
                            </div>}
                            {allowedValidations.indexOf("daterange") >= 0 && <div>
                                <label>Date ranging between</label>
                                <InputParameter definition={{ type: "DR" }} value={parameter.maxVal && { fromDate: parameter.minVal, toDate: parameter.maxVal }}
                                    onChange={(d, val) => { updateFieldValue("minVal", val.fromDate); updateFieldValue("maxVal", val.toDate); }} />
                            </div>}
                            <div style={{ clear: 'both' }}></div>
                        </div>
                    </TabPanel>
                </TabView >
            </Dialog >
        );
    }
}
