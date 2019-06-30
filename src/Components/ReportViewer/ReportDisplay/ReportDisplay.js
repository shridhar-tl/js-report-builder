import React, { PureComponent } from "react";
import "./ReportDisplay.scss";
import ItemsContainer from "../ReportItems/ItemsContainer";

class ReportDisplay extends PureComponent {
    render() {
        var {
            definition: { reportItems }
        } = this.props;

        return (
            <div className="report-viewer">
                {reportItems && reportItems.length > 0 && <div className="report-items"><ItemsContainer items={reportItems} /></div>}
                {(!reportItems || reportItems.length === 0) && <div className="no-report-items">No report ui components added to report</div>}
            </div>
        );
    }
}

export default ReportDisplay;
