import React, { PureComponent } from "react";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { Chips } from "primereact/chips";
import array from '../../Common/linq'
import { convertToDate } from "../../Common/CommonFunctions";
import Button from "./Button";

export default class InputParameter extends PureComponent {
    constructor(props) {
        super(props);
        var { definition, value } = props;
        var { allowMultiple } = definition;
        this.state = { value: value || (allowMultiple ? [] : "") };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.value) {
            this.setState({ value: newProps.value });
        }
        if (newProps.definition.dataset) {
            if (this.state.dsId !== newProps.definition.dataset) {
                this.resolveDataset();
            }
        }
        else {
            this.setState({ dataset: null });
        }
    }

    componentWillMount() {
        this.resolveDataset();
    }

    resolveDataset() {
        var { definition, value } = this.props;
        var { dataset: dsId, displayField, valueField } = definition;
        if (dsId && displayField) {
            this.props.resolveDataset(dsId).then(dataset => {
                var state = { dataset, dsId };
                var newValue;

                if (valueField && value) {
                    if (Array.isArray(value)) {
                        var firstVal = value[0];
                        if (typeof (firstVal) != "object") {
                            newValue = dataset.filter(d => value.indexOf(d[valueField]) >= 0);
                        }
                        else if (firstVal instanceof Date) {
                            var vTicks = value.map(v => v.getTime());
                            newValue = dataset.filter(d => vTicks.indexOf(convertToDate(d[valueField]).getTime()) >= 0);
                        }
                        if (newValue.length === 0) { newValue = null; }
                    }
                    else if (typeof (value) != "object") {
                        newValue = array(dataset).first(d => d[valueField] === value);
                    }
                    else if (value instanceof Date) {
                        var valTicks = value.getTime();
                        newValue = array(dataset).first(d => convertToDate(d[valueField]).getTime() === valTicks);
                    }

                    if (newValue) { state.value = newValue; }
                }

                this.setState(state);
            });
        }
    }

    valueChanged = e => {
        this.setValue((e.target || e).value);
    };

    targetValueChanged = (e) => {
        this.setValue(e.value);
    }

    setValue = (value, noPropogate) => {
        this.setState({ value });
        if (!noPropogate) {
            var { valueField } = this.props.definition;
            if (valueField && value && typeof value === "object" && !(value instanceof Date)) {
                if (Array.isArray(value)) {
                    value = value.map(v => v[valueField])
                }
                else {
                    value = value[valueField];
                }
            }
            this.props.onChange(this.props.definition, value);
        }
    };

    dateRangeChanged = e => {
        var value = this.getDateRangeFromArr(e);
        if (value) {
            this.setValue(value);
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

    filterDataset = (e) => {
        setTimeout(() => {
            var { dataset } = this.state;
            var { query } = e;

            if (!query) {
                this.setState({ filteredDataset: dataset });
                return;
            }

            query = query.trimLeft();

            var filteredDataset = [];

            var { displayField, valueField } = this.props.definition;
            var len = dataset.length;
            for (var i = 0; i < len; i++) {
                var entry = dataset[i];
                var { [displayField]: dField, [valueField]: vField } = entry;
                dField = (dField || "").toString().toLowerCase();
                vField = (vField || "").toString().toLowerCase();

                if (~dField.indexOf(query) || ~vField.indexOf(query)) { filteredDataset.push(entry); }
            }

            this.setState({ filteredDataset });
        }, 0);
    }

    onFileSelected = e => { };

    getSingleValueField() {
        var { name, mask, slotChar, display, type, displayField } = this.props.definition;
        var { value, dataset, filteredDataset } = this.state;

        var className = "param-ctl param-ctl-" + type.toLowerCase();

        switch (type) {
            default:
                return <InputText value={value} onChange={this.valueChanged} className={className} />;
            case "MASK":
                return <InputMask mask={mask || ""} slotChar={slotChar} value={value} onChange={this.valueChanged} className={className} />;
            case "CHK":
                return (
                    <div className={className}>
                        <Checkbox
                            inputId={"pcb_" + name}
                            value={true}
                            onChange={e => this.setValue(e.checked)}
                            checked={value || false}
                        />
                        <label htmlFor={"pcb_" + name} className="p-checkbox-label">
                            {display}
                        </label>
                    </div>
                );
            case "INT":
                return <InputText keyfilter="int" value={value} onChange={this.valueChanged} className={className} />;
            case "NUM":
                return <InputText keyfilter="num" value={value} onChange={this.valueChanged} className={className} />;
            case "DDL":
                return <Dropdown optionLabel={displayField} value={dataset ? value : ""} options={dataset} onChange={this.targetValueChanged} className={className} />;
            case "AC":
                return (
                    <AutoComplete
                        value={dataset ? value : ""}
                        completeMethod={this.filterDataset}
                        suggestions={filteredDataset}
                        field={displayField}
                        minLength={1}
                        dropdown={true}
                        onChange={this.targetValueChanged}
                        className={className}
                    />
                );
            case "DTE":
                return <Calendar value={value} onChange={this.valueChanged} className={className} />;
            case "DR":
                var rValue = [];
                if (value) {
                    if (value.fromDate) {
                        if (!(value.fromDate instanceof Date)) { value.fromDate = convertToDate(value.fromDate) }
                        rValue.push(value.fromDate);
                    }

                    if (value.toDate) {
                        if (!(value.toDate instanceof Date)) { value.toDate = convertToDate(value.toDate) }
                        rValue.push(value.toDate);
                    }
                }
                return (
                    <Calendar
                        value={rValue}
                        onChange={this.dateRangeChanged}
                        selectionMode="range"
                        readonlyInput={true}
                        className={className}
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
        var { mask, slotChar, type, displayField } = this.props.definition;
        var { dataset } = this.state;

        var className = "param-ctl param-multctl-" + type.toLowerCase();

        switch (type) {
            default:
                return <Chips value={value} onChange={valueChanged} className={className} />;
            case "MASK":
                return <InputMask mask={mask || ""} slotChar={slotChar} value={value} onChange={valueChanged} className={className} />;
            case "INT":
                return <InputText keyfilter="int" value={value} onChange={valueChanged} className={className} />;
            case "NUM":
                return <InputText keyfilter="num" value={value} onChange={valueChanged} className={className} />;
            case "DDL":
                return (
                    <MultiSelect value={dataset ? value : []} optionLabel={displayField} options={dataset}
                        onChange={this.targetValueChanged} style={{ minWidth: "12em" }} filter={true} className={className} />
                );
            case "AC":
                return (
                    <AutoComplete
                        value={dataset ? value : []}
                        completeMethod={this.filterDataset}
                        suggestions={this.state.filteredDataset}
                        field={displayField}
                        minLength={1}
                        dropdown={true}
                        multiple={true}
                        onChange={this.targetValueChanged}
                        className={className}
                    />
                );
            case "DTE":
                return <Calendar value={value} onChange={valueChanged} selectionMode="multiple" readonlyInput={true} className={className} />;
            case "FILE":
                return (
                    <FileUpload
                        mode="basic"
                        maxFileSize={5000000}
                        onSelect={this.onFileSelected}
                        auto={true}
                        multiple={true}
                        chooseLabel="Browse"
                        className={className}
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