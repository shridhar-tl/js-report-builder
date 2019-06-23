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
import { getParamTypes } from "../../../Common/ReportConfig";
import { Checkbox } from "primereact/checkbox";
import InputParameter from "../../Common/InputParameter";

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

class EditParameter extends PureComponent {
    constructor(props) {
        super(props);
        var { parameter = {} } = props;
        this.paramTypes = getParamTypes(true);
        this.state = { parameter: { ...parameter }, paramType: this.paramTypes[parameter.type], showDialog: true };
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

        if (!parameter.dataset) {
            delete parameter.displayField;
            delete parameter.valueField;
        }

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

        if (param.type === "MASK" && !param.mask) {
            return false;
        }

        if (param.dataset && !param.displayField) {
            return false;
        }

        return true;
    }

    resolveDataset = (dsId) => {
        return Promise.resolve([]);
        // ToDo: Resolve dataset implementation need to be done
    }

    render() {
        var { showDialog, parameter, isParamValid, noMultiValue, paramType } = this.state;
        var { updateValue, updateFieldValue } = this;
        var { value: pTypeName, allowedValidations = [] } = paramType || {};
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
                        <div className="field-collection">
                            <div className="mandatory">
                                <label>Name:</label>
                                <InputText keyfilter="alphanum" field="name" value={parameter.name} onChange={updateValue} />
                            </div>
                            <div className="mandatory">
                                <label>Display text:</label>
                                <InputText field="display" value={parameter.display} onChange={updateValue} />
                            </div>
                            <div className="mandatory">
                                <label>Param type:</label>
                                <Dropdown
                                    value={parameter.type}
                                    options={getParamTypes()}
                                    onChange={e => {
                                        var paramType = this.paramTypes[e.value];
                                        this.setState({
                                            paramType, noMultiValue: paramType.supportMultiValue === false,
                                            defaultValue: null, mask: null, slotChar: null, minVal: null, maxVal: null
                                        });
                                        updateFieldValue("type", e.value);
                                    }}
                                    placeholder="Select a Parameter type"
                                />
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
                    <TabPanel header="Available values" disabled={!parameter.type}>
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
