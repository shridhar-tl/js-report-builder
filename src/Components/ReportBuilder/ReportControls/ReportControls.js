import React, { PureComponent } from "react";
import ReportItems from "./ReportItems";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./ReportControls.scss";
import Button from "../../Common/Button";
import ReportParameters from "./ReportParameters";
import Datasets from "./Datasets";
import StyleEditor from "../../Common/StyleEditor";
import { getBuiltInFields, getCommonFunctions } from "../../../Common/ReportConfig";
import { BuilderContext } from "../Common/Constants";
import { Dialog } from "primereact/dialog";
import ExpressionList from "../Common/ExpressionList";

class ReportControls extends PureComponent {
    static contextType = BuilderContext;

    constructor(props) {
        super(props);
        var { data, selectedItems } = props;
        var { parameters, datasetList, reportState } = data;

        if (!selectedItems) {
            selectedItems = [];
        }

        reportState = reportState || [];

        this.state = { data, activeIndex: [], parameters, reportState, datasetList, selectedItems };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var { data, selectedItems } = newProps;
        var { parameters, datasetList } = data;
        if (!selectedItems) {
            selectedItems = [];
        }
        this.setState({ data, parameters, datasetList, selectedItems });
    }

    editFields = e => this.showPopup(e, 0, this.ctlFields);
    editFunctions = e => this.showPopup(e, 1, this.ctlFunctions);
    addParam = e => this.showPopup(e, 2, this.ctlParameters);
    addDataset = e => this.showPopup(e, 3, this.ctlDatasets);

    showPopup(e, index, ctl) {
        e.preventDefault();
        e.stopPropagation();
        var { activeIndex } = this.state;
        if (activeIndex.indexOf(index) === -1) {
            activeIndex.push(index);
            this.setState({ activeIndex: [...activeIndex] });
        }
        ctl.showPopup();
    }

    parameterModified = parameters => {
        var { data } = this.state;
        data.parameters = parameters;
        this.setState({ parameters });
        this.props.onChange(data);
    };

    datasetModified = (datasets, datasetList) => {
        var { data } = this.state;
        data.datasetList = datasetList;
        data.datasets = datasets;
        this.setState({ datasetList });
        this.props.onChange(data);
    };

    reportStateModified = (reportState) => {
        var { data } = this.state;
        data.reportState = reportState;
        this.setState({ reportState });
        this.props.onChange(data);
    };

    tabChanged = e => {
        this.setState({ activeIndex: e.index });
    };

    render() {
        var { data, parameters = [], datasetList = [], activeIndex, selectedItems, reportState } = this.state;
        var { datasets = {}, myFunctions, userScript } = data;
        var [selectedItem] = selectedItems;

        var fieldsHeader = (
            <div style={{ width: "100%" }}>
                Global fields
                <Button type="success" icon="fa fa-edit" className="pull-right" onClick={this.editFields} title="Edit report state items" />
            </div>
        );

        var functionsHeader = (
            <div style={{ width: "100%" }}>
                Utility Functions
                <Button type="success" icon="fa fa-edit" className="pull-right" onClick={this.editFunctions} title="Add / edit custom functions" />
            </div>
        );

        var parameterHeader = (
            <div style={{ width: "100%" }}>
                Parameters ({parameters.length})
                <Button type="success" icon="fa fa-plus" className="pull-right" onClick={this.addParam} title="Add new report parameter" />
            </div>
        );

        var datasetHeader = (
            <div style={{ width: "100%" }}>
                Datasets ({datasetList.length})
                <Button type="success" icon="fa fa-plus" className="pull-right" onClick={this.addDataset} title="Add new report dataset" />
            </div>
        );

        return (
            <div className="report-controls">
                <Accordion
                    multiple={true}
                    activeIndex={activeIndex}
                    className="report-controls-ctr"
                    onTabChange={this.tabChanged}>
                    <AccordionTab header={fieldsHeader}>
                        <BuiltinFields ref={c => (this.ctlFields = c)} reportState={reportState}
                            onChange={this.reportStateModified} />
                    </AccordionTab>
                    <AccordionTab header={functionsHeader}>
                        <FunctionsList
                            ref={c => (this.ctlFunctions = c)} myFunctions={myFunctions} userScript={userScript} />
                    </AccordionTab>
                    <AccordionTab header={parameterHeader}>
                        <ReportParameters
                            ref={c => (this.ctlParameters = c)}
                            parameters={data.parameters}
                            onChange={this.parameterModified}
                        />
                    </AccordionTab>
                    <AccordionTab header={datasetHeader}>
                        <Datasets
                            ref={c => (this.ctlDatasets = c)}
                            datasets={datasets}
                            datasetList={datasetList}
                            onChange={this.datasetModified}
                        />
                    </AccordionTab>
                    <AccordionTab header="Components">
                        <ReportItems />
                    </AccordionTab>
                    <AccordionTab header="Resources">
                    </AccordionTab>
                    <AccordionTab header="Styles" contentClassName="no-padding">
                        {selectedItem && <StyleEditor element={selectedItem.element} elementData={selectedItem.data} onChange={(newStyle) => {
                            selectedItem.data.style = newStyle;
                        }} />}
                    </AccordionTab>
                </Accordion>
            </div>
        );
    }
}

export default ReportControls;

class BuiltinFields extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { reportState: this.props.reportState };
    }

    showPopup = () => {
        this.setState({ showDialog: true });
    };

    onHide = () => {
        this.setState({ showDialog: false });
    };

    onChange = (reportState) => {
        this.setState({ reportState, showDialog: false });
        this.props.onChange(reportState);
    }

    render() {
        var { reportState, showDialog } = this.state;

        return (
            <div className="builtin-fields">
                <div className="header">Report fields</div>
                {getBuiltInFields().map(f => (
                    <div className="field" key={f.field} title={f.helpText}>
                        {f.field}
                    </div>
                ))}
                <div className="header">Report state</div>
                {reportState.map(f => (
                    <div className="field" key={f.name}>
                        {f.name}
                    </div>
                ))}

                {showDialog && (
                    <ReportStateProperties definition={reportState} onHide={this.onHide} onChange={this.onChange} />
                )}
            </div>
        );
    }
}

class ReportStateProperties extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { showDialog: true, reportState: props.definition.map(d => { return { ...d } }) };
    }

    updateFieldValue = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.setState({
                isValid: true
            });
        });
    };

    onDone = () => {
        this.props.onChange(this.state.reportState);
    }

    onHide = () => {
        this.setState({ showDialog: false })
        this.props.onHide();
    }

    render() {
        var { showDialog, reportState, isValid } = this.state;

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.onHide} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.onDone} disabled={!isValid} label="Save" />
            </div>
        );

        return (

            <Dialog
                header="Edit default report state"
                visible={showDialog}
                footer={footer}
                style={{ width: "70vw" }}
                modal={true}
                onHide={this.onHide}>
                <ExpressionList
                    nameField="name"
                    valueField="value"
                    nameHeader="State name"
                    valueHeader="State default value"
                    value={reportState}
                    autoDetect={true}
                    onChange={value => {
                        this.updateFieldValue("reportState", value);
                    }}
                />
            </Dialog>
        );
    }
}

class FunctionsList extends PureComponent {
    static contextType = BuilderContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    showPopup = () => {
        this.setState({ showDialog: true, userScript: this.props.userScript || "" });
    };

    saveFunction = () => {
        try {
            this.context.buildMyFunctions(this.state.userScript);
            this.hidePopup();
        }
        catch (err) {
            alert("An error occured while parsing your script. Check the console to trace the error.");
        }
    };

    hidePopup = () => {
        this.setState({ showDialog: false });
    };

    render() {
        var { userScript, showDialog } = this.state;
        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveFunction} label="Save" />
            </div>
        );
        return (
            <>
                <div className="func-list">
                    <div className="func-grp">
                        <div className="header">Common functions</div>
                        <div className="list">
                            {getCommonFunctions().map(f => (
                                <div className="func" key={f.name} title={f.helpText}>
                                    {f.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    {this.props.myFunctions && <div className="func-grp">
                        <div className="header">My functions</div>
                        <div className="list">
                            {this.props.myFunctions.map(f => (
                                <div className="func" key={f}>{f}</div>
                            ))}
                        </div>
                    </div>}
                </div>
                {showDialog && <Dialog
                    header="My functions"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "65vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <textarea style={{ height: "334px", width: "100%" }} value={userScript} onChange={(e) => this.setState({ userScript: e.target.value })}></textarea>
                </Dialog>}
            </>
        );
    }
}
