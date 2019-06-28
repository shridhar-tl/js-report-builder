import React, { PureComponent } from "react";
import ExpressionEditor from "./ExpressionEditor";
import Button from "../../Common/Button";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import SelectDataset from "./SelectDataset";
import ExpressionList from "./ExpressionList";
import array from "../../../Common/linq";

class GroupProperties extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { showDialog: true, group: { ...props.group }, isParamValid: this.isModelValid(props.group) };
    }

    hidePopup = () => {
        this.setState({ showDialog: false });
        this.props.onHide();
    };

    setValue(field, value) {
        var { group } = this.state;
        group[field] = value;
        group = { ...group };

        var isParamValid = this.isModelValid(group);

        this.setState({ group, isParamValid });
    }

    isModelValid(group) {
        return !!(group.name && group.dataset && (group.dataset !== -1 || group.expression));
    }

    saveProperties = () => {
        var { group } = this.state;
        var { keys, dataset } = group;

        if (keys && keys.length) {
            array(keys).removeAll(k => !k.expr);
            if (!keys.length) { delete group.keys; }
        }

        group.type = keys && keys.length ? 2 : 3;

        if (!group.filter) { delete group.filter; }
        if (!group.sortBy) { delete group.sortBy; }
        if (Array.isArray(group.variables) && !group.variables.length) { delete group.variables; }

        if (dataset !== -1) {
            delete group.expression;
        }

        this.setState({ showDialog: false });
        this.props.onChange(group);
    };

    render() {
        var { showDialog, isParamValid, group } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} disabled={!isParamValid} label="Save" />
            </div>
        );

        return (
            <Dialog
                header="Group properties"
                visible={showDialog}
                footer={footer}
                style={{ width: "50vw" }}
                modal={true}
                onHide={this.hidePopup}>
                <TabView>
                    <TabPanel header="General">
                        <div>
                            <label>Name</label>
                            <InputText
                                keyfilter="alphanum"
                                value={group.name}
                                placeholder="Unique group name"
                                onChange={e => this.setValue("name", e.currentTarget.value)}
                            />
                        </div>
                        <div>
                            <label>Dataset</label>
                            <SelectDataset
                                includeExprDS={true}
                                value={group.dataset}
                                onChange={id => this.setValue("dataset", id)}
                            />
                        </div>
                        {group.dataset === -1 && (
                            <div>
                                <label>Dataset expression</label>
                                <ExpressionEditor isStrict={true}
                                    expression={group.expression}
                                    onChange={value => {
                                        this.setValue("expression", value);
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <label>Filter dataset</label>
                            <ExpressionEditor
                                expression={group.filter} isStrict={true}
                                onChange={value => {
                                    this.setValue("filter", value);
                                }}
                            />
                        </div>
                        <div>
                            <label>Sort dataset by</label>
                            <ExpressionEditor
                                expression={group.sortBy}
                                onChange={value => {
                                    this.setValue("sortBy", value);
                                }}
                            />
                        </div>
                        <div>
                            <label>Visibility (hide item if expression evaluates to true)</label>
                            <ExpressionEditor
                                expression={group.hidden}
                                onChange={value => {
                                    this.setValue("hidden", value);
                                }}
                            />
                        </div>
                        <div>
                            <label>Group by expression</label>
                            <ExpressionList
                                valueField="expr"
                                value={group.keys}
                                onChange={value => {
                                    this.setValue("keys", value);
                                }}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel header="Variables">
                        <ExpressionList
                            nameField="key"
                            valueField="expr"
                            value={group.variables}
                            onChange={value => {
                                this.setValue("variables", value);
                            }}
                        />
                    </TabPanel>
                </TabView>
            </Dialog>
        );
    }
}

export default GroupProperties;
