import React, { PureComponent } from "react";
import ReportItems from "../ReportItems";
import "./ReportDisplay.scss";

class ReportDisplay extends PureComponent {
    constructor(props) {
        super(props);
        //var { definition } = props;
        //this.state = {  };
    }

    getReportItemComponent(item, i) {
        var { type } = item;
        var ItemType = ReportItems[type];

        var itemHtml = null;
        if (ItemType) {
            itemHtml = <ItemType definition={item} />;
        } else {
            itemHtml = (
                <div style={{ width: "100%", border: "1px solid grey", padding: "4px 12px" }}>This is an unknown element</div>
            );
        }

        return (
            <div key={i} className="report-item">
                {itemHtml}
            </div>
        );
    }

    render() {
        var {
            definition: { reportItems }
        } = this.props;

        return (
            <div className="report-viewer">
                <div className="report-items">{reportItems.map(this.getReportItemComponent)}</div>
            </div>
        );
    }
}

export default ReportDisplay;
