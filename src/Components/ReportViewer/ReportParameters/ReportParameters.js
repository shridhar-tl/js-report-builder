import React, { PureComponent } from "react";
import { getParamTypes } from "../../../Common/ReportConfig";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { Chips } from "primereact/chips";
import "./ReportParameters.scss";
import Button from "../../Common/Button";
import { ViewerContext } from "../ReportViewer";

class ReportParameters extends PureComponent {
    //static contextType = ViewerContext;
    constructor(props) {
        super(props);
        var { definition, values } = props;
        var { datasets, parameters } = definition;
        this.parameters = parameters;
        this.datasets = datasets;
        this.paramTypes = getParamTypes(true);
        this.state = { values: { ...values } };
    }

    parameterValueChanged = (param, value) => {
        var { values } = this.state;
        values[param.name] = value;
        values = { ...values };
        var state = this.validateParameters(values);
        this.setState(state);
    };

    validateParameters(values) {
        //ToDo: add validation code
        return { values };
    }

    saveParameters = () => {
        var { values } = this.state;
        this.props.onChange(values);
    };

    getParameterControl = (param, i) => {
        var { display, name, type } = param;
        var { values } = this.state;
        var paramType = this.paramTypes[type];

        if (!paramType) {
            console.error("Unknown parameter type: ", type);
            return null;
        }

        var { control, displayHandled } = paramType;

        var Control = control || InputParameter;

        return (
            <div key={i} className="param">
                {!displayHandled && <label>{display}</label>}
                <div className="control">
                    <Control
                        definition={param}
                        handleMultivalue={paramType.handleMultivalue}
                        value={values[name]}
                        onChange={this.parameterValueChanged}
                    />
                </div>
            </div>
        );
    };

    render() {
        var { parameters, state } = this;
        var { values } = state;

        return (
            <div className="params-container">
                <div className="params-list">
                    {parameters.map(this.getParameterControl)}
                    <div style={{ clear: "both" }} />
                </div>
                <div className="footer">
                    <Button type="success" label="Done" onClick={this.saveParameters} />
                </div>
            </div>
        );
    }
}

export default ReportParameters;

class InputParameter extends PureComponent {
    constructor(props) {
        super(props);
        var { definition, value } = this.props;
        var { allowMultiple } = definition;
        this.state = { value: value || (allowMultiple ? [] : "") };
    }

    valueChanged = e => {
        this.setValue((e.target || e).value);
    };

    setValue = (value, noPropogate) => {
        this.setState({ value });
        if (!noPropogate) {
            this.props.onChange(this.props.definition, value);
        }
    };

    dateRangeChanged = e => {
        var value = this.getDateRangeFromArr(e);
        if (value) {
            this.setValue(value, !value.toDate);
        }
    };

    getDateRangeFromArr = e => {
        var range = e.value;
        if (!range || !Array.isArray(range)) {
            return;
        }
        if (!range[0]) {
            return;
        }
        return { fromDate: range[0], toDate: range[1] };
    };

    onFileSelected = e => {};

    getSingleValueField() {
        var { name, display, type } = this.props.definition;
        var { value } = this.state;

        switch (type) {
            default:
                return <InputText value={value} onChange={this.valueChanged} />;
            case "MASK":
                return <InputText value={value} onChange={this.valueChanged} />;
            case "CHK":
                return (
                    <React.Fragment>
                        <Checkbox
                            inputId={"pcb_" + name}
                            value={true}
                            onChange={e => this.setValue(e.checked)}
                            checked={value || false}
                        />
                        <label htmlFor={"pcb_" + name} className="p-checkbox-label">
                            {display}
                        </label>
                    </React.Fragment>
                );
            case "INT":
                return <InputText keyfilter="int" value={value} onChange={this.valueChanged} />;
            case "NUM":
                return <InputText keyfilter="num" value={value} onChange={this.valueChanged} />;
            case "DDL":
                return <Dropdown optionLabel="name" value={value} options={[]} onChange={this.valueChanged} />;
            case "AC":
                return (
                    <AutoComplete
                        value={value}
                        suggestions={[]}
                        size={30}
                        minLength={1}
                        dropdown={true}
                        onChange={this.valueChanged}
                    />
                );
            case "DTE":
                return <Calendar value={value} onChange={this.valueChanged} />;
            case "DR":
                return (
                    <Calendar
                        value={value ? [value.fromDate, value.toDate] : []}
                        onChange={this.dateRangeChanged}
                        selectionMode="range"
                        readonlyInput={true}
                    />
                );
            case "FILE":
                return (
                    <FileUpload
                        mode="basic"
                        maxFileSize={5000000}
                        onSelect={this.onFileSelected}
                        auto={true}
                        chooseLabel="Browse"
                    />
                );
        }
    }

    getMultiValueField(value, setValue, valueChanged) {
        var { name, display, type } = this.props.definition;

        switch (type) {
            default:
                return <Chips value={value} onChange={valueChanged} />;
            case "MASK":
                return <InputText value={value} onChange={valueChanged} />;
            case "INT":
                return <InputText keyfilter="int" value={value} onChange={valueChanged} />;
            case "NUM":
                return <InputText keyfilter="num" value={value} onChange={valueChanged} />;
            case "DDL":
                return (
                    <MultiSelect value={value} options={[]} onChange={valueChanged} style={{ minWidth: "12em" }} filter={true} />
                );
            case "AC":
                return (
                    <AutoComplete
                        value={value}
                        suggestions={[]}
                        size={30}
                        minLength={1}
                        dropdown={true}
                        multiple={true}
                        onChange={valueChanged}
                    />
                );
            case "DTE":
                return <Calendar value={value} onChange={valueChanged} selectionMode="multiple" readonlyInput={true} />;
            case "FILE":
                return (
                    <FileUpload
                        mode="basic"
                        maxFileSize={5000000}
                        onSelect={this.onFileSelected}
                        auto={true}
                        multiple={true}
                        chooseLabel="Browse"
                    />
                );
        }
    }

    render() {
        var { definition, handleMultivalue } = this.props;
        var { allowMultiple } = definition;
        return allowMultiple ? (
            handleMultivalue ? (
                <MultiValueField onChange={this.setValue}>
                    {(value, setValue, valueChanged) => this.getMultiValueField(value, setValue, valueChanged)}
                </MultiValueField>
            ) : (
                this.getMultiValueField(this.state.value, this.setValue, this.valueChanged)
            )
        ) : (
            this.getSingleValueField()
        );
    }
}

class MultiValueField extends PureComponent {
    constructor(props) {
        super(props);
        var value = this.props.value || [];
        this.state = { value };
    }

    valueChanged = (e, i) => {
        this.setValue((e.target || e).value, i);
    };

    setValue = (value, i) => {
        if (i >= 0) {
            var stateValue = this.state.value;
            stateValue[i] = value;
            stateValue = [...stateValue];
            this.setState({ value: stateValue });
            this.props.onChange(stateValue);
        } else {
            this.setState({ newValue: value });
        }
    };

    addItem = () => {
        var { value, newValue } = this.state;
        this.setState({ newValue: "" });
        this.setValue(newValue, value.length);
    };

    render() {
        var { children } = this.props;
        var { value, newValue } = this.state;
        return (
            <div className="multivalue-param">
                <table>
                    <tbody>
                        {value.map((v, i) => (
                            <tr key={i}>
                                <td>{children(v, val => this.setValue(val, i), val => this.valueChanged(val, i))}</td>
                                <td>
                                    <Button type="danger" icon="fa fa-remove" onClick={() => this.removeItem(i)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{children(newValue, this.setValue, this.valueChanged)}</td>
                            <td>
                                <Button type="success" icon="fa fa-plus" disabled={!newValue} onClick={this.addItem} />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}
