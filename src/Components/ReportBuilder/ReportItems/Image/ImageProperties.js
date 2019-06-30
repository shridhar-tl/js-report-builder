import React, { PureComponent } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import ExpressionEditor from '../../Common/ExpressionEditor';
import Button from '../../../Common/Button';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';

class ImageProperties extends PureComponent {
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
        if (field === "clickAction") { delete definition.actionProps; }
        this.setState(this.validateField(definition));
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

    validateField(definition) {
        var { src } = definition;
        var isParamValid = !!src;

        return { definition: { ...definition }, isParamValid };
    }

    render() {
        var { state, setValue, setHiddenValue } = this;
        var { definition, showDialog, isParamValid } = state;
        var { srcMode, src, altText, tooltip, hidden } = definition;
        var srcType = "text", altType = "text", tooltipType = "text";

        if (typeof src === "object") {
            src = src.expression;
            srcType = null;
        }
        if (typeof altText === "object") {
            altText = altText.expression;
            altType = null;
        }
        if (typeof tooltip === "object") {
            tooltip = tooltip.expression;
            tooltipType = null;
        }

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} disabled={!isParamValid} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Image properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "60vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <TabView>
                        <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                            <div className="field-collection">
                                <div className="mandatory">
                                    <label>Image source</label>
                                    <RadioButton inputId="rbImgFromUrl" checked={srcMode !== 2} onChange={e => setValue("srcMode", 1)} /> <label htmlFor="rbImgFromUrl">External url</label>
                                    <RadioButton inputId="rbEmbededImg" checked={srcMode === 2} onChange={e => setValue("srcMode", 2)} /> <label htmlFor="rbEmbededImg">Embedded image</label>
                                </div>
                                <div className="mandatory">
                                    {srcMode !== 2 && <label>External image url or expression evaluating to same</label>}
                                    {srcMode === 2 && <label>Embedded image resource name or expression evaluating to same</label>}
                                    <ExpressionEditor expression={src} type={srcType}
                                        onChange={(expr, type, prop) => setValue("src", type ? expr : { expression: expr })} />
                                </div>

                                <div className="mandatory">
                                    <label>Alt text (text to be displayed when the image is unavailable)</label>
                                    <ExpressionEditor expression={altText} type={altType}
                                        onChange={(expr, type, prop) => setValue("altText", type ? expr : { expression: expr })} />
                                </div>
                                <div>
                                    <label>Tooltip text or expression</label>
                                    <ExpressionEditor expression={tooltip} type={tooltipType}
                                        onChange={(expr, type, prop) => setValue("tooltip", type ? expr : { expression: expr })} />
                                </div>
                                <div>
                                    <label>Visibility (hide image if expression evaluates to true)</label>
                                    <ExpressionEditor expression={hidden === true ? "true" : hidden} isStrict={true}
                                        onChange={(expr, type, prop) => setHiddenValue(expr)} />
                                </div>
                            </div>
                        </TabPanel>
                    </TabView >
                </Dialog >
            </div>
        );
    }
}

export default ImageProperties;