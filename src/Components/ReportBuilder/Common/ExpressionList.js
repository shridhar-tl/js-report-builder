import React, { PureComponent } from "react";
import Button from "../../Common/Button";
import { InputText } from "primereact/inputtext";
import ExpressionEditor from "./ExpressionEditor";
import "./ExpressionList.scss";
import { clone } from '../../../Common/HelperFunctions'
import { Dropdown } from "primereact/dropdown";
import array from '../../../Common/linq'

class ExpressionList extends PureComponent {
    constructor(props) {
        super(props);
        var { value, nameFieldSet } = props;
        if (nameFieldSet) {
            if (typeof nameFieldSet[0] === "string") {
                this.nameFieldSet = nameFieldSet.map(n => { return { name: n }; });
            } else {
                this.nameFieldSet = nameFieldSet;
            }
            this.nameFieldValues = this.nameFieldSet.reduce((obj, cur) => { obj[cur.name] = cur; return obj; }, {});
        }
        else {

        }
        this.state = { items: clone(value || []), newItem: {} };
    }

    getExpressionRow(index, item, isNewRow) {
        var { nameFieldSet } = this;
        var { namePlaceholder, valuePlaceholder, nameField, valueField, autoDetect, fieldSetLabel, nameKeyFilter } = this.props;

        return (
            <tr key={index}>
                {nameField && !nameFieldSet && (
                    <td>
                        <InputText
                            keyfilter={nameKeyFilter || "alphanum"}
                            value={item[nameField]}
                            placeholder={namePlaceholder}
                            onChange={e => {
                                item[nameField] = e.currentTarget.value;
                                if (!isNewRow) {
                                    this.setValue(index, item);
                                }
                            }}
                        />
                    </td>
                )}
                {nameField && nameFieldSet && (
                    <td>
                        <Dropdown
                            appendTo={document.body}
                            optionLabel={fieldSetLabel || "name"}
                            value={this.nameFieldValues[item[nameField]] || undefined}
                            options={nameFieldSet}
                            onChange={e => {
                                item[nameField] = e.value.name;
                                if (!isNewRow) {
                                    this.setValue(index, item);
                                } else {
                                    this.setState({ newItem: { ...item }, addEnabled: !!(item[nameField] && item[valueField]) })
                                }
                            }}
                        />
                    </td>
                )}
                <td>
                    <ExpressionEditor
                        placeholder={valuePlaceholder}
                        expression={item[valueField]}
                        autoDetect={autoDetect}
                        isStrict={!autoDetect}
                        onChange={value => {
                            item[valueField] = value;
                            if (!isNewRow) {
                                this.setValue(index, item);
                            } else {
                                this.setState({ addEnabled: !!(item[nameField] && item[valueField]) })
                            }
                        }}
                    />
                </td>

                {isNewRow && (
                    <td>
                        <Button type="success" icon="fa fa-plus" disabled={!this.state.addEnabled} onClick={() => this.setValue(index, item)} />
                    </td>
                )}

                {!isNewRow && (
                    <td>
                        <Button type="danger" icon="fa fa-trash" onClick={() => this.setValue(index)} />
                    </td>
                )}
            </tr>
        );
    }

    setValue(index, item) {
        var { items, newItem } = this.state;

        if (index != null) {
            if (item) {
                items[index] = item;
                newItem = item === newItem ? {} : newItem
            }
            else {
                items.splice(index, 1);
            }
            items = [...items];

            this.setState({ items, newItem });
            this.props.onChange(items);
        }
    }

    hasEmptyData = () => {
        var { items } = this.state;
        var { nameField, valueField } = this.props;

        return items && items.length > 0 && items.some(i => !i[nameField] || !i[valueField])
    }

    hasDuplicateData = () => {
        var { items } = this.state;
        var { nameField } = this.props;

        return items && items.length > 0 && array(items).hasDuplicates(nameField)
    }

    render() {
        var { items, newItem } = this.state;
        var { nameHeader, valueHeader } = this.props;

        return (
            <div className="expression-list">
                <table className="table table-bordered">
                    {(nameHeader || valueHeader) && <thead>
                        <tr>
                            <th>{nameHeader}</th>
                            <th colSpan={2}>{valueHeader}</th>
                        </tr>
                    </thead>}
                    <tbody>
                        {items.map((item, i) => this.getExpressionRow(i, { ...item }))}
                        {this.getExpressionRow(items.length, newItem, true)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ExpressionList;
