import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { PureComponent } from 'react';
import Button from '../../../Common/Button';
import ExpressionEditor from '../../Common/ExpressionEditor';
import BaseContainer from './BaseContainer';
import './ContainerItem.scss'

class ContainerItem extends BaseContainer {
    constructor(props) {
        super(props);
        var { data: definition } = props;
        if (!definition) {
            definition = { items: [], blockSize: 12 };
        }

        this.setBlockSize(definition);
        this.state.definition = definition;
        this.state.collapsed = definition.collapsed;
    }

    setBlockSize(definition) {
        const { blockSize = 12 } = definition;
        if (blockSize && blockSize !== 12) {
            this.className = 'col-' + blockSize;
        }
    }

    onChange = (definition) => {
        this.setBlockSize(definition);
        this.setState({ definition, showPropsDialog: false });
        this.props.onChange(definition);
    }

    render() {
        var { definition, showPropsDialog } = this.state;

        return super.renderBase(<div className="container-item">
            {this.getDroppableContainer()}
            {showPropsDialog && <ContainerItemProperties definition={definition} onHide={this.hideProperties} onChange={this.onChange} />}
        </div>);
    }
}

export default ContainerItem;

class ContainerItemProperties extends PureComponent {
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
        var { hidden, blockSize } = definition;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Container properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "50vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <div className="field-collection">
                        <div>
                            <label>Block size (out of 12)</label>
                            <InputNumber value={blockSize || 12} onChange={e => setValue("blockSize", parseInt(e.value) || 12)}
                                showButtons min={1} max={12} />
                        </div>
                        <div>
                            <label>Visibility (hide container if expression evaluates to true)</label>
                            <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                onChange={(expr, type, prop) => setHiddenValue(expr)} />
                        </div>
                    </div>
                </Dialog >
            </div>
        );
    }
}
