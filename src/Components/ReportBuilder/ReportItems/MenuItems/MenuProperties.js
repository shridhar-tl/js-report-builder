import React, { PureComponent } from 'react';
import ExpressionEditor from '../../Common/ExpressionEditor';
import Button from '../../../Common/Button';
import { Dialog } from 'primereact/dialog';
import { OrderList } from 'primereact/orderlist';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import NameField from '../../Common/NameField';

class MenuProperties extends PureComponent {
    constructor(props) {
        super(props);
        var { definition } = props;
        definition = { ...definition };
        definition.items = definition.items.map(item => { return { ...item }; });
        this.state = { definition: { ...definition }, showDialog: true };
    }

    hidePopup = () => {
        this.setState({ showDialog: false });
        this.props.onHide();
    }

    saveProperties = () => {
        var { definition } = this.state;
        this.props.onChange(definition);
    }

    setValue = (field, value) => {
        var { definition } = this.state;
        if (value === null) {
            delete definition[field];
        } else {
            definition[field] = value;
        }

        this.setState(this.validateField({ ...definition }));
    }

    validateField = (definition) => {
        var { name, items } = definition;
        var isPropValid = name && items && items.length > 0;
        return { definition, isPropValid };
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

    menuSelected = (selectedMenu) => {
        this.setState({ selectedMenu, selectedMenuIndex: this.state.definition.items.indexOf(selectedMenu) });
    }

    removeSelected = () => {
        this.menuChanged();
    }

    menuChanged = (menuItem, index) => {
        var { definition, selectedMenuIndex } = this.state;
        var { items } = definition;
        index = index || selectedMenuIndex;
        if (menuItem) {
            items[index] = menuItem;
        } else {
            items.splice(index, 1);
        }
        definition = { ...definition };

        var newState = this.validateField(definition);
        newState.selectedMenuIndex = null;
        newState.selectedMenu = null;

        this.setState(newState);
    }

    addMenuItem = () => {
        var { definition } = this.state;
        var { items } = definition;
        var curIdx = items.length;
        var newItem = { label: "Menu " + (curIdx + 1), icon: "" };
        this.menuChanged(newItem, curIdx);
    }

    render() {
        var { state, setValue, setHiddenValue, menuChanged, addMenuItem, removeSelected } = this;
        var { definition, showDialog, isPropValid, selectedMenu } = state;
        var { name, hidden, items } = definition;

        var itemTemplate = (item) => {
            return <div onClick={() => this.menuSelected(item)}><span>{item.label}</span></div>
        }

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} disabled={!isPropValid} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Menu item properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "90vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <div className="field-collection">
                        <div>
                            <label>Menu name</label>
                            <NameField value={name} onChange={val => setValue("name", val)} />
                        </div>
                        <div>
                            <label>Visibility (hide menu if expression evaluates to true)</label>
                            <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                onChange={(expr, type, prop) => setHiddenValue(expr)} />
                        </div>
                    </div>
                    <div>
                        <div className="pull-left" style={{ width: "280px" }}>
                            <OrderList dragdrop={true} header="Edit / Reorder menu" value={items} itemTemplate={itemTemplate} onChange={e => setValue("items", e.value)} />
                            <div style={{ padding: "5px 0 130px 5px" }}>
                                <Button type="danger" style={{ marginRight: "5px" }} icon="fa fa-times" label="Delete" onClick={removeSelected} />
                                <Button type="success" icon="fa fa-plus" label="Add new menu" onClick={addMenuItem} />
                            </div>
                        </div>
                        <div className="pull-left" style={{ width: "calc(89vw - 280px)" }}>
                            {selectedMenu && <MenuItemProperties definition={selectedMenu} onChange={menuChanged} />}
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                </Dialog >
            </div>
        );
    }
}

export default MenuProperties;

class MenuItemProperties extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { definition: { ...props.definition } };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({ definition: { ...newProps.definition } });
    }

    setValue = (field, value) => {
        var { definition } = this.state;
        if (value === null) {
            delete definition[field];
        } else {
            definition[field] = value;
        }

        this.setState(this.validateField(definition));
    }

    validateField(definition) {
        var { header } = definition;
        var isParamValid = !!header;

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
    }

    render() {
        var { setValue, setBooleanValue, state, props } = this;
        var { definition } = state;
        var { label, icon, hidden, disabled, expression } = definition;

        return (
            <Card title="Menu item properties">
                <div className="field-collection">
                    <div className="pull-left">
                        <label>Menu label</label>
                        <InputText value={label} maxLength={16} keyfilter={/^[A-z0-9 _-]+$/} onChange={e => setValue("label", e.target.value)} />
                    </div>
                    <div>
                        <label>Menu icon class</label>
                        <InputText disabled={!label} value={icon} maxLength={50} keyfilter={/^[A-z0-9 _-]+$/} onChange={e => setValue("icon", e.target.value)} />
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
                        <label>Command (expression which will be evaluated when clicked)</label>
                        <ExpressionEditor expression={expression} isStrict={true}
                            onChange={(expr, type, prop) => setValue("expression", expr)} />
                    </div>
                    <div>
                        <Button type="success" icon="fa fa-check" label="Update" onClick={() => props.onChange(definition)} />
                    </div>
                </div>
            </Card>
        );
    }
}