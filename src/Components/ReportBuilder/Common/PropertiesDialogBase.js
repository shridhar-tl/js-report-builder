import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import Button from '../../Common/Button';
import ExpressionEditor from './ExpressionEditor'

class PropertiesDialogBase extends PureComponent {
    constructor(props, title, style, maximizable) {
        super(props);
        this.title = title;
        this.style = style || { width: "70vw" };
        this.maximizable = maximizable;

        var { definition } = props;
        this.state = { definition: { ...definition }, showDialog: true };
    }

    onHide = () => {
        this.setState({ showDialog: false });
        this.props.onHide();
    }

    saveProperties = () => {
        this.props.onChange(this.getProperties());
    }

    getProperties() {
        return this.state.definition;
    }

    setValue = (field, value) => {
        var { definition } = this.state;
        if (value === null) {
            delete definition[field];
        } else {
            definition[field] = value;
        }

        // Process some common fields.
        if (field === "clickAction") { delete definition.actionProps; }

        this.setState(this.validateField({ ...definition }));
    }

    setBooleanValue = (expression, field) => {
        field = field || "hidden";
        if (expression === "true") {
            this.setValue(field, true);
        }
        else if (!expression || expression === "false") {
            this.setValue(field, null);
        }
        else {
            this.setValue(field, expression);
        }
    }

    validateField(definition) {
        var isPropsValid = true;
        return { definition, isPropsValid };
    }

    getBooleanExpressionField(field, value) {
        return <ExpressionEditor expression={value} autoDetect={true} isStrict={true} onChange={(expr, type, prop) => this.setBooleanValue(expr, field)} />
    }

    getExpressionField(field, value, isStrict) {
        return <ExpressionEditor expression={value} autoDetect={true} isStrict={isStrict} onChange={(expr, type, prop) => this.setValue(field, expr)} />
    }

    renderBase(children) {
        var { title, style, onHide, saveProperties, maximizable, state: { showDialog, isPropsValid } } = this;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={onHide} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={saveProperties} disabled={!isPropsValid} label="Save" />
            </div>
        );

        return <Dialog header={title} maximizable={maximizable} visible={showDialog} footer={footer} style={style} modal={true} onHide={onHide}>{children}</Dialog>
    }
}

PropertiesDialogBase.propTypes = {
    onHide: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    definition: PropTypes.object.isRequired
};

export default PropertiesDialogBase;