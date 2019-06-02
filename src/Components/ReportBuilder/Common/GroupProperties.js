import React, { Component } from "react";
import ExpressionEditor from "./ExpressionEditor";
import Button from "../../Common/Button";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import SelectDataset from "./SelectDataset";
import ExpressionList from "./ExpressionList";
import array from '../../../Common/linq'

class GroupProperties extends Component {
    constructor(props) {
        super(props);
        this.state = { showDialog: true, group: { ...props.group }, isParamValid: this.isModelValid(props.group) };
    }

    hidePopup = () => {
        this.setState({ showDialog: false });
        this.props.onHide();
    }

    setValue(field, value) {
        var { group } = this.state;
        group[field] = value;
        group = { ...group };

        var isParamValid = this.isModelValid(group);

        this.setState({ group, isParamValid });
    }

    isModelValid(group) {
        return !!(group.name && group.dataset);
    }

    saveProperties = () => {
        var { keys } = this.state.group;
        if (keys && keys.length) {
            array(keys).removeAll(k => !k.expr);
        }

        this.setState({ showDialog: false });
        this.props.onChange(this.state.group);
    }

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
                onHide={this.hideAddPopup}>
                <TabView>
                    <TabPanel header="General">
                        <div>
                            <label>Name:</label>
                            <InputText keyfilter="alphanum" value={group.name} placeholder="Unique group name" onChange={e => this.setValue("name", e.currentTarget.value)} />
                        </div>
                        <div>
                            <label>Dataset:</label>
                            <SelectDataset value={group.dataset} onChange={id => this.setValue("dataset", id)} />
                        </div>
                        <div>
                            <label>Filter dataset:</label>
                            <ExpressionEditor
                                expression={group.filter}
                                onChange={value => {
                                    this.setValue("filter", value);
                                }}
                            />
                        </div>
                        <div>
                            <label>Sort dataset by:</label>
                            <ExpressionEditor
                                expression={group.sortBy}
                                onChange={value => {
                                    this.setValue("sortBy", value);
                                }}
                            />
                        </div>
                        <div>
                            <label>Group by expression:</label>
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
