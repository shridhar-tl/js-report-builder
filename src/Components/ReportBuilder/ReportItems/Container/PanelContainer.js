import React, { PureComponent } from 'react';
import ContainerItem from './ContainerItem';
import { Panel } from 'primereact/panel';
import Button from '../../../Common/Button';
import { Dialog } from 'primereact/dialog';
import ExpressionEditor from '../../Common/ExpressionEditor';
import { InputText } from 'primereact/inputtext';

class PanelContainer extends ContainerItem {
    constructor(props) {
        super(props);
        var { data: definition } = props;
        if (!definition) {
            definition = {items:[], toggleable: true, collapsed: false, header: "Panel header" };
        }
        this.state.definition = definition;
        this.state.collapsed = definition.collapsed;
    }

    onChange = (definition) => {
        this.setState({ definition, showPropsDialog: false });
        this.props.onChange(definition);
    }

    render() {
        var { definition, collapsed, showPropsDialog } = this.state;
        var { header, toggleable } = definition;

        return super.renderBase(<div className="container-item">
            <Panel header={header} toggleable={toggleable} collapsed={collapsed} onToggle={(e) => this.setState({ collapsed: e.value })}>
                {super.getDroppableContainer()}
            </Panel>
            {showPropsDialog && <PanelProperties definition={definition} onHide={this.hideProperties} onChange={this.onChange} />}
        </div>);
    }
}

export default PanelContainer;


class PanelProperties extends PureComponent {
    constructor(props) {
        super(props);
        var { definition } = props;
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

        this.setState({ definition: { ...definition } });
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
        var { definition, showDialog } = state;
        var { hidden, header } = definition;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Panel properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "50vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <div className="field-collection">
                        <div>
                            <label>Panel header</label>
                            <InputText value={header} onChange={e => setValue("header", e.target.value)} />
                        </div>
                        <div>
                            <label>Visibility (hide panel if expression evaluates to true)</label>
                            <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                onChange={(expr, type, prop) => setHiddenValue(expr)} />
                        </div>
                    </div>
                </Dialog >
            </div>
        );
    }
}
