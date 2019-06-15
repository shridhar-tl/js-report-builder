import React, { PureComponent } from "react";
import ReportItems from "./ReportItems";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./ReportControls.scss";
import Button from "../../Common/Button";
import ReportParameters from "./ReportParameters";
import Datasets from "./Datasets";
import StyleEditor from "../../Common/StyleEditor";
import { getBuiltInFields, getCommonFunctions } from "../../../Common/ReportConfig";

class ReportControls extends PureComponent {
    constructor(props) {
        super(props);
        var { data, selectedItems } = props;
        var { parameters, datasetList } = data;
        if (!selectedItems) {
            selectedItems = [];
        }
        this.state = { data, activeIndex: [], parameters, datasetList, selectedItems };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var { data, selectedItems } = newProps;
        var { parameters, datasetList } = data;
        if (!selectedItems) {
            selectedItems = [];
        }
        this.setState({ data, parameters, datasetList, selectedItems });
    }

    editFunctions = e => this.showAddPopup(e, 1, { showAddPopup: () => {} });
    addParam = e => this.showAddPopup(e, 2, this.ctlParameters);
    addDataset = e => this.showAddPopup(e, 3, this.ctlDatasets);

    showAddPopup(e, index, ctl) {
        e.preventDefault();
        e.stopPropagation();
        var { activeIndex } = this.state;
        if (activeIndex.indexOf(index) === -1) {
            activeIndex.push(index);
            this.setState({ activeIndex: [...activeIndex] });
        }
        ctl.showAddPopup();
    }

    parameterModified = parameters => {
        var { data } = this.state;
        data.parameters = parameters;
        this.setState({ parameters });
    };

    datasetModified = (datasets, datasetList) => {
        var { data } = this.state;
        data.datasets = datasets;
        data.datasetList = datasetList;
        this.setState({ datasetList });
    };

    tabChanged = e => {
        this.setState({ activeIndex: e.index });
    };

    render() {
        var { data, parameters = [], datasetList = [], activeIndex, selectedItems } = this.state;
        var { datasets = {} } = data;
        var [selectedItem] = selectedItems;

        var functionsHeader = (
            <div style={{ width: "100%" }}>
                Utility Functions
                <Button type="success" icon="fa fa-edit" className="pull-right" onClick={this.editFunctions} />
            </div>
        );

        var parameterHeader = (
            <div style={{ width: "100%" }}>
                Parameters ({parameters.length})
                <Button type="success" icon="fa fa-plus" className="pull-right" onClick={this.addParam} />
            </div>
        );

        var datasetHeader = (
            <div style={{ width: "100%" }}>
                Datasets ({datasetList.length})
                <Button type="success" icon="fa fa-plus" className="pull-right" onClick={this.addDataset} />
            </div>
        );

        return (
            <div className="report-controls">
                <Accordion
                    multiple={true}
                    activeIndex={activeIndex}
                    className="report-controls-ctr"
                    onTabChange={this.tabChanged}>
                    <AccordionTab header="Built in fields">
                        <BuiltinFields />
                    </AccordionTab>
                    <AccordionTab header={functionsHeader}>
                        <FunctionsList />
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
                        <ReportItems />
                    </AccordionTab>
                    <AccordionTab header="Styles">
                        {selectedItem && <StyleEditor element={selectedItem.element} elementData={selectedItem.data} />}
                    </AccordionTab>
                </Accordion>
            </div>
        );
    }
}

export default ReportControls;

class BuiltinFields extends PureComponent {
    render() {
        return (
            <div className="builtin-fields">
                {getBuiltInFields().map(f => (
                    <div className="field" key={f.field} title={f.helpText}>
                        {f.field}
                    </div>
                ))}
            </div>
        );
    }
}

class FunctionsList extends PureComponent {
    render() {
        return (
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
                <div className="func-grp">
                    <div className="header">My functions</div>
                    <div className="list">
                        {getCommonFunctions().map(f => (
                            <div className="func" key={f.name} title={f.helpText}>
                                {f.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
