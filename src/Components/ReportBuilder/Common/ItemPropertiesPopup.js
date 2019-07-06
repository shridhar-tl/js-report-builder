import React, { PureComponent } from 'react';
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import ExpressionEditor from "./ExpressionEditor";
import { BuilderContext } from './Constants';
import ActionProperties from './ActionProperties';

class ItemPropertiesPopup extends PureComponent {
    static contextType = BuilderContext;

    constructor(props) {
        super(props);
        this.state = { showDialog: true, item: { ...props.definition } };
    }

    componentWillMount() {
        this.stateList = this.context.getStateItems();
    }

    hidePopup = () => {
        var { onHide } = this.props;
        this.setState({ showDialog: false });
        onHide();
    }

    saveProperties = () => {
        var { onChange } = this.props;
        var { item } = this.state;
        onChange(item);
    }

    setValue = (field, value) => {
        var { item } = this.state;
        if (value === null) {
            delete item[field];
        } else {
            item[field] = value;
        }
        if (field === "clickAction") { delete item.actionProps; }
        this.setState(this.validateField(item));
    }

    validateField(item) {
        var isFieldsValid = true;
        var { expression, data, clickAction, actionProps } = item;

        if ((!expression && !data) || (clickAction && (!actionProps || (Array.isArray(actionProps) && !actionProps.length)))) { isFieldsValid = false; }

        return { item: { ...item }, isFieldsValid };
    }

    setHiddenValue = (expression) => {
        if (expression === "true") {
            this.setValue("hidden", true);
        }
        else if (expression && expression !== "false") {
            this.setValue("hidden", expression);
        }
        else {
            this.setValue("hidden", null);
        }
    }

    render() {
        var { state, setValue, setHiddenValue } = this;
        var { showDialog, isFieldsValid, item } = state;
        var { expression, data, tooltip, hidden, isHTML } = item;

        var tooltipType = null;
        if (typeof tooltip === "object") {
            tooltip = tooltip.expression;
        } else {
            tooltipType = "text";
        }

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} disabled={!isFieldsValid} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Item properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "50vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <TabView>
                        <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                            <div className="field-collection">
                                <div className="mandatory">
                                    <label>Expression</label>
                                    <ExpressionEditor expression={expression} isStrict={true}
                                        onChange={(expr, type, prop) => setValue("expression", expr)} />
                                </div>
                                <div>
                                    {!expression && <label className="mandatory">Display text</label>}
                                    {expression && <label>Design time display text</label>}
                                    <input value={data} onChange={e => this.setValue("data", e.target.value)} />
                                </div>
                                <div>
                                    <label>Tooltip text or expression</label>
                                    <ExpressionEditor expression={tooltip} type={tooltipType}
                                        onChange={(expr, type, prop) => setValue("tooltip", type ? expr : { expression: expr })} />
                                </div>
                                <div>
                                    <label>Visibility (hide item if expression evaluates to true)</label>
                                    <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                        onChange={(expr, type, prop) => setHiddenValue(expr)} />
                                </div>
                                <div>
                                    <Checkbox inputId="chkIntrHTML" checked={isHTML} onChange={(e) => setValue("isHTML", e.checked)} />
                                    <label htmlFor="chkIntrHTML"> Allow html interpretation</label>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Click action">
                            <ActionProperties definition={item} setValue={setValue} />
                        </TabPanel>
                    </TabView>
                </Dialog>
            </div>
        );
    }
}

export default ItemPropertiesPopup;