import React from 'react';
import ReportItemBase from './ReportItemBase';
import PropertiesDialogBase from '../Common/PropertiesDialogBase';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { getReportsList, resolveReport } from '../../../Common/ReportConfig';
import ExpressionList from '../Common/ExpressionList';

const subReportStyle = {
    fontSize: '20px', padding: '22px'
};

class SubReport extends ReportItemBase {
    constructor(props) {
        super(props, SubReportProperties);
    }

    render() {
        return super.renderBase(
            <div className="sub-report" style={subReportStyle}>
                <span>Selected subreport will be rendered here at runtime. Set parameter values and data for dataset</span>
            </div>
        );
    }
}

export default SubReport;

class SubReportProperties extends PropertiesDialogBase {
    constructor(props) {
        super(props, "Sub Report properties");
        this.reportsList = getReportsList();
        var { definition: { reportId } } = props;
        var report = this.reportsList.filter(r => r.id === reportId)[0];
        this.reportSelected(report);
    }

    reportSelected(report) {
        if (!report) { return; }
        resolveReport(report.id).then(def => {
            var { parameters } = def;
            this.paramsList = parameters.map(p => { return { name: p.name, display: p.display } });

            this.reportDefinition = def;
            this.setValue("reportId", report.id);
            this.setState({ report });
        }, (err) => {
            console.error(err);
            this.setState({ reportError: "Unable to fetch report details" });
        });
    }

    validateField(definition) {
        var isPropsValid = true;
        var paramsMessage = null;
        if (this.ctlParams) {
            if (this.ctlParams.hasEmptyData()) {
                isPropsValid = false;
                paramsMessage = "Parameter name or value cannot be empty";
            }
            else if (this.ctlParams.hasDuplicateData()) {
                isPropsValid = false;
                paramsMessage = "Parameter name cannot be duplicated";
            }
        }
        return { definition, isPropsValid, paramsMessage };
    }

    render() {
        var {
            setValue,
            reportsList,
            state: { definition, report, paramsMessage }
        } = this;
        var { reportId, parameters, hidden } = definition;

        return super.renderBase(
            <TabView>
                <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                    <div className="field-collection">
                        <div className="mandatory">
                            <label>Choose sub report</label>
                            <Dropdown optionLabel="name" value={report} options={reportsList} onChange={(e) => this.reportSelected(e.value)} placeholder="Select a report" />
                        </div>
                        <div>
                            <label>Visibility (hide report if expression evaluates to true)</label>
                            {this.getBooleanExpressionField("hidden", hidden)}
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Properties" disabled={!reportId}>
                    <ExpressionList ref={e => this.ctlParams = e} value={parameters} autoDetect={true} nameField="name" valueField="value" nameFieldSet={this.paramsList} fieldSetLabel="display"
                        onChange={value => setValue("parameters", value)} />
                    {paramsMessage && <span className="error-message">{paramsMessage}</span>}
                </TabPanel>
            </TabView>
        );
    }
}