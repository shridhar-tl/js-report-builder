import React, { PureComponent } from 'react';
import ExpressionEditor from '../../Common/ExpressionEditor';
import Button from '../../../Common/Button';
import { Dialog } from 'primereact/dialog';
import { OrderList } from 'primereact/orderlist';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

class TabViewProperties extends PureComponent {
    constructor(props) {
        super(props);
        let { definition } = props;

        definition = { ...definition };
        definition.items = definition.items.map(item => ({ ...item }));

        this.state = { definition, showDialog: true };
    }

    hidePopup = () => {
        this.setState({ showDialog: false });
        this.props.onHide();
    };

    saveProperties = () => {
        const { definition } = this.state;
        this.props.onChange(definition);
    };

    setValue = (field, value) => {
        const { definition } = this.state;
        if (value === null) {
            delete definition[field];
        } else {
            definition[field] = value;
        }

        this.setState({ definition: { ...definition } });
    };

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
    };

    tabSelected = (selectedTab) => {
        this.setState({ selectedTab, selectedTabIndex: this.state.definition.items.indexOf(selectedTab) });
    };

    tabChanged = (tabDefinition, index) => {
        const { selectedTabIndex } = this.state;
        let { definition } = this.state;
        const { items } = definition;

        items[index || selectedTabIndex] = tabDefinition;
        definition = { ...definition };
        this.setState({ definition, selectedTabIndex: null, selectedTab: null });
    };

    addTabPage = () => {
        const { definition } = this.state;
        const { items } = definition;
        const curIdx = items.length;
        const newItem = { items: [], header: `Sheet ${curIdx + 1}` };
        this.tabChanged(newItem, curIdx);
    };

    render() {
        const { state, setValue, setHiddenValue, tabChanged, addTabPage } = this;
        const { definition, showDialog, selectedTab } = state;
        const { hidden, items } = definition;

        const itemTemplate = (item) => <div onClick={() => this.tabSelected(item)}><span>{item.header}</span></div>;

        const footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Tab view properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "75vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <div className="field-collection">
                        <div>
                            <label>Visibility (hide tabview if expression evaluates to true)</label>
                            <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                onChange={(expr, type, prop) => setHiddenValue(expr)} />
                        </div>
                    </div>
                    <div>
                        <div className="pull-left" style={{ width: "260px" }}>
                            <OrderList dragdrop={true} header="Edit / Reorder pages" value={items} itemTemplate={itemTemplate} onChange={e => setValue("items", e.value)} />
                            <div style={{ padding: "5px 0 70px 70px" }}><Button type="success" icon="fa fa-plus" label="Add new tab page" onClick={addTabPage} /></div>
                        </div>
                        <div className="pull-left" style={{ width: "calc(100% - 270px)" }}>
                            {selectedTab && <TabPageProperties definition={selectedTab} onChange={tabChanged} />}
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                </Dialog >
            </div>
        );
    }
}

export default TabViewProperties;

class TabPageProperties extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { definition: { ...props.definition } };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({ definition: { ...newProps.definition } });
    }

    setValue = (field, value) => {
        const { definition } = this.state;
        if (value === null) {
            delete definition[field];
        } else {
            definition[field] = value;
        }

        this.setState(this.validateField(definition));
    };

    validateField(definition) {
        const { header } = definition;
        const isParamValid = !!header;

        return { definition: { ...definition }, isParamValid };
    }

    setBooleanValue = (expression, field) => {
        if (!field) { field = "hidden"; }

        if (expression === "true") {
            this.setValue(field, true);
        }
        else if (expression && expression !== "false") {
            this.setValue(field, expression);
        }
        else {
            this.setValue(field, null);
        }
    };

    render() {
        const { setValue, setBooleanValue, state, props } = this;
        const { definition } = state;
        const { header, hidden, disabled } = definition;

        return (
            <Card title="Tab page properties">
                <div className="field-collection">
                    <div>
                        <label>Header</label>
                        <InputText value={header}
                            onChange={e => setValue("header", e.target.value)} />
                    </div>
                    <div>
                        <label>Visibility (hide tab page if expression evaluates to true)</label>
                        <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                            onChange={(expr, type, prop) => setBooleanValue(expr)} />
                    </div>
                    <div>
                        <label>Availability (disable tab page if expression evaluates to true)</label>
                        <ExpressionEditor expression={disabled === true ? "true" : disabled} isStrict={true}
                            onChange={(expr, type, prop) => setBooleanValue(expr, "disabled")} />
                    </div>
                    <div>
                        <Button type="success" icon="fa fa-check" label="Update" onClick={() => props.onChange(definition)} />
                    </div>
                </div>
            </Card>
        );
    }
}