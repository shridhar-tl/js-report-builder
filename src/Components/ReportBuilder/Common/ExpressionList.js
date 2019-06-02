import React, { PureComponent } from "react";
import Button from "../../Common/Button";
import { InputText } from "primereact/inputtext";
import ExpressionEditor from "./ExpressionEditor";
import "./ExpressionList.scss";
import { clone } from '../../../Common/HelperFunctions'

class ExpressionList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { items: clone(props.value || []) };
    }

    getExpressionRow(index, item, isNewRow) {
        var { namePlaceholder, valuePlaceholder, nameField, valueField } = this.props;

        return (
            <tr key={index}>
                {nameField && (
                    <td>
                        <InputText
                            keyfilter="alphanum"
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
                <td>
                    <ExpressionEditor
                        placeholder={valuePlaceholder}
                        expression={item[valueField]}
                        onChange={value => {
                            item[valueField] = value;
                            if (!isNewRow) {
                                this.setValue(index, item);
                            }
                        }}
                    />
                </td>

                {isNewRow && (
                    <td>
                        <Button type="success" icon="fa fa-plus" onClick={() => this.setValue(index, item)} />
                    </td>
                )}

                {!isNewRow && (
                    <td>
                        <Button type="danger" icon="fa fa-trash" onClick={() => this.removeItem(index)} />
                    </td>
                )}
            </tr>
        );
    }

    removeItem(index) {
        var { items } = this.state;
        items.splice(index, 1);
        items = [...items];
        this.setState({ items });
    }

    setValue(index, item) {
        var { items } = this.state;

        if (index) {
            items[index] = item;
            items = [...items];

            this.setState({ items });
        }
    }

    removeExpression(index) {}

    render() {
        var { items } = this.state;

        return (
            <div className="expression-list">
                <table>
                    <tbody>
                        {items.map((item, i) => this.getExpressionRow(i, { ...item }))}
                        {this.getExpressionRow(items.length, {}, true)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ExpressionList;
