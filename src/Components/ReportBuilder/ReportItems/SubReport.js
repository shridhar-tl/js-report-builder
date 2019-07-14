import React from 'react';
import ReportItemBase from './ReportItemBase';
import PropertiesDialogBase from '../Common/PropertiesDialogBase';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { getReportsList, resolveReport } from '../../../Common/ReportConfig';
import ExpressionList from '../Common/ExpressionList';
import { BuilderContext } from '../Common/Constants';

const subReportStyle = {
    fontSize: '20px', padding: '22px'
};

class SubReport extends ReportItemBase {
    constructor(props) {
        super(props, SubReportProperties);
        getReportsList().then(reportsList => this.setState({ reportsList }));
    }

    render() {
        var {
            state: { reportsList, definition: { reportId } }
        } = this;
        var report = (reportsList || []).filter(r => r.id === reportId)[0];

        return super.renderBase(
            <div className="sub-report" style={subReportStyle}>
                {!reportId && <span>Select a sub report to be rendered from properties and set the parameter values to be passed</span>}
                {reportId && !report && <span>Selected sub report is invalid or has been deleted.</span>}
                {report && <span>'{report.name}' will be rendered here at runtime</span>}
            </div>
        );
    }
}

export default SubReport;

class SubReportProperties extends PropertiesDialogBase {
    static contextType = BuilderContext

    constructor(props) {
        super(props, "Sub Report properties");
    }

    componentDidMount() {
        var { definition: { reportId } } = this.props;
        getReportsList(this.context.getDefinition()).then(reportsList => {
            this.setState({ reportsList });

            var report = reportsList.filter(r => r.id === reportId)[0];
            this.reportSelected(report);
        });
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
            state: { reportsList, definition, report, paramsMessage }
        } = this;
        var { reportId, parameters, hidden } = definition;

        return super.renderBase(
            <TabView>
                <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                    <div className="field-collection">
                        <div className="mandatory">
                            <label>Choose sub report</label>
                            <Dropdown appendTo={document.body} optionLabel="name" value={report} options={reportsList} onChange={(e) => this.reportSelected(e.value)} placeholder="Select a report" />
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