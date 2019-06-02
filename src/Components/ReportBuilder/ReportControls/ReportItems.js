import React from "react";
import "./ReportItems.scss";
import DraggableHandle from "../DragDrop/DraggableHandle";
import { defaultComponents } from "../ReportItems/index";
import ReportControlBase from "./ReportControlBase";

class ReportItems extends ReportControlBase {
    render() {
        return (
            <div className="report-items">
                {defaultComponents.map(c => (
                    <DraggableHandle itemType="RPT_ITMS" item={c} key={c.type}>
                        <div className="report-item">
                            <span className="icon">
                                <i className={c.icon} />
                            </span>
                            <span className="text">{c.text}</span>
                        </div>
                    </DraggableHandle>
                ))}
                <div style={{ clear: "both" }} />
            </div>
        );
    }
}

export default ReportItems;
