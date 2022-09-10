import React, { PureComponent } from 'react';
import ExpressionEditor from '../../Common/ExpressionEditor';
import Button from '../../../Common/Button';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import ActionProperties from '../../Common/ActionProperties';
import { Dropdown } from 'primereact/dropdown';

const textElementTypes = [
    { value: '', label: 'Span' },
    { value: 'p', label: 'Paragraph' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
];

class TextProperties extends PureComponent {
    constructor(props) {
        super(props);
        const { definition } = props;
        this.state = { definition: { ...definition }, showDialog: true };
    }

    onHide = () => {
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
        if (field === "clickAction") { delete definition.actionProps; }
        this.setState(this.validateField(definition));
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

    validateField(definition) {
        const { text } = definition;
        const isParamValid = !!text;

        return { definition: { ...definition }, isParamValid };
    }

    elementTypeChanged = ({ value }) => this.setValue('elType', value);

    render() {
        const { state, setValue, setHiddenValue } = this;
        const { definition, showDialog, isParamValid } = state;
        const { elType, hidden } = definition;
        let { text, tooltip } = definition;
        let textType = "text", tooltipType = "text";

        if (typeof text === "object") {
            text = text.expression;
            textType = null;
        }
        if (typeof tooltip === "object") {
            tooltip = tooltip.expression;
            tooltipType = null;
        }

        const footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.onHide} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} disabled={!isParamValid} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Text properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "50vw" }}
                    modal={true}
                    onHide={this.onHide}>
                    <TabView>
                        <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                            <div className="field-collection">
                                <div className="mandatory">
                                    <label>Text type</label>
                                    <Dropdown appendTo={document.body} value={elType || ''} options={textElementTypes} onChange={this.elementTypeChanged} placeholder="Select text type" />;
                                </div>
                                <div className="mandatory">
                                    <label>Text</label>
                                    <ExpressionEditor expression={text} type={textType}
                                        onChange={(expr, type, prop) => setValue("text", type ? expr : { expression: expr })} />
                                </div>
                                <div>
                                    <label>Tooltip text or expression</label>
                                    <ExpressionEditor expression={tooltip} type={tooltipType}
                                        onChange={(expr, type, prop) => setValue("tooltip", type ? expr : { expression: expr })} />
                                </div>
                                <div>
                                    <label>Visibility (hide text if expression evaluates to true)</label>
                                    <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                        onChange={(expr, type, prop) => setHiddenValue(expr)} />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Click action">
                            <ActionProperties definition={definition} setValue={setValue} />
                        </TabPanel>
                    </TabView >
                </Dialog >
            </div>
        );
    }
}

export default TextProperties;