import React, { PureComponent } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import { RadioButton } from 'primereact/radiobutton';
import "./ReportBuilder.scss";
import array from "../../Common/linq";
import ReportBase from "../ReportBase";
import ReportControls from "./ReportControls/ReportControls";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import { BuilderContext } from "./Common/Constants";
import ExpressionEditor from "./Common/ExpressionEditor";
import ExpressionList from "./Common/ExpressionList";
import { getDefaultRptDefinition } from "../../Common/ReportConfig";
import ImageProperties from "./ReportItems/Image/ImageProperties";

class ReportBuilder extends ReportBase {
    constructor(props) {
        super(props);
        var { definition: data } = props;

        if (!data) {
            data = getDefaultRptDefinition();
        }
        else {
            data.datasets = data.datasets || {};

            data.reportItems = data.reportItems || [];
            data.datasetList = data.datasetList || [];
            data.parameters = data.parameters || [];
        }

        this.state = { data };
        this.builderProps = {
            ...this.sharedProps,
            getDatasetList: includeExpressionDS => {
                var { datasets, datasetList } = data;
                var list = array(
                    datasetList.map(id => {
                        var ds = datasets[id];
                        return { id, name: ds.name };
                    })
                ).sortBy("name")();

                if (includeExpressionDS) {
                    list.push({ id: -1, name: "<<Expression>>" });
                }
                return list;
            },
            editExpression: (definition) => {
                return new Promise((onChange, onHide) => {
                    this.setState({ expressionProps: { definition, isImage: definition.itemType === "IMG", onChange, onHide } });
                }).finally(() => { this.setState({ expressionProps: null }) });
            },
            getDataset: id => this.state.data.datasets[id],
            selectControl: (selElement, elementData) => {
                this.setState({ selElement, elementData });
            },
            //getState: itemName => (itemName ? this.state[itemName] : this.state) // ToDo: Check if this is required
        };
    }

    componentDidMount() {
        var { api } = this.props;
        if (api) {
            api(this.externalApi);
        }
        this.builderProps.buildMyFunctions();
    }

    externalApi = {
        getReportDefinition: () => this.state.data
    };

    itemSelected = e => {
        var { selections } = e;
        if (selections) {
            this.setState({ selections });
            delete e.selections;
        }
    };

    render() {
        var { data, selections, expressionProps } = this.state;
        return (
            <BuilderContext.Provider value={this.builderProps}>
                <div className="report-builder">
                    <div className="report-controls-cntr">
                        <ReportControls
                            data={data}
                            selectedItems={selections}
                            onChange={d => {
                                this.setState({ data: d });
                                if (this.props.onChange) {
                                    this.props.onChange(d);
                                }
                            }}
                        />
                    </div>
                    <div className="report-display-cntr" onClick={this.itemSelected} onContextMenu={this.showContextMenu}>
                        <ReportDisplay
                            items={data.reportItems}
                            onChange={d => {
                                data.reportItems = d;
                                if (this.props.onChange) {
                                    this.props.onChange(data);
                                }
                            }}
                        />
                    </div>
                </div>
                {expressionProps && !expressionProps.isImage && <ItemPropertiesPopup {...expressionProps} />}
                {expressionProps && expressionProps.isImage && <ImageProperties {...expressionProps} />}
            </BuilderContext.Provider>
        );
    }
}

export default DragDropContext(HTML5Backend)(ReportBuilder);

class ItemPropertiesPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { showDialog: true, item: { ...props.definition } };
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
        var { expression, data, tooltip, hidden, isHTML, clickAction, actionProps } = item;

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
                        <TabPanel header="Action">
                            <div className="field-collection">
                                <div><RadioButton inputId="clickAction_None" onChange={(e) => setValue("clickAction", null)} checked={!clickAction} />
                                    <label htmlFor="clickAction_None">None</label></div>
                                <div><RadioButton inputId="clickAction_RPT" onChange={(e) => setValue("clickAction", "RPT")} checked={clickAction === "RPT"} />
                                    <label htmlFor="clickAction_RPT">Navigate to report</label></div>
                                <div><RadioButton inputId="clickAction_FNC" onChange={(e) => setValue("clickAction", "FNC")} checked={clickAction === "FNC"} />
                                    <label htmlFor="clickAction_FNC">Call my function</label></div>
                                <div><RadioButton inputId="clickAction_RST" onChange={(e) => setValue("clickAction", "RST")} checked={clickAction === "RST"} />
                                    <label htmlFor="clickAction_RST">Set report state</label></div>
                                <div><RadioButton inputId="clickAction_BKM" onChange={(e) => setValue("clickAction", "BKM")} checked={clickAction === "BKM"} />
                                    <label htmlFor="clickAction_BKM">Go to bookmark</label></div>
                                <div><RadioButton inputId="clickAction_LNK" onChange={(e) => setValue("clickAction", "LNK")} checked={clickAction === "LNK"} />
                                    <label htmlFor="clickAction_LNK">Use it as hyperlink to external url</label></div >

                                {(clickAction === "FNC" || clickAction === "LNK") && <div>
                                    {clickAction === "FNC" && <label>Provide expression to call custom function</label>}
                                    {clickAction === "LNK" && <label>Provide url or expression to resolve url</label>}
                                    <ExpressionEditor expression={actionProps} isStrict={clickAction === "FNC"}
                                        onChange={(expr, type, prop) => setValue("actionProps", expr)} />
                                </div>}

                                {(clickAction === "RST") && <div>
                                    <label>Set value of report state</label>
                                    <ExpressionList value={actionProps} nameField="key" valueField="value"
                                        onChange={value => setValue("actionProps", value)} />
                                </div>}

                                {/* actions: go to report = [select report and pass parameters] */}
                                {(clickAction === "RPT" || clickAction === "BKM") && <div>This functionality is not yet implemented</div>}
                            </div>
                        </TabPanel>
                    </TabView>
                </Dialog>
            </div>
        );
    }
}