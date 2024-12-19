import React from "react";
import "./ReportItems.scss";
import Draggable from "../DragDrop/Draggable";
import { defaultComponents } from "../ReportItems/index";
import ReportControlBase from "./ReportControlBase";

const defaultItemTarget = ['RPT_ITMS'];

class ReportItems extends ReportControlBase {
    render() {
        return (
            <div className="report-items-list">
                {defaultComponents.map((c, i) => (
                    <Draggable item={c} index={i} key={c.type} itemType="RPT_CMPN" itemTarget={c.itemTarget || defaultItemTarget}>
                        <div className="report-item">
                            <span className="icon">
                                <i className={c.icon} />
                            </span>
                            <span className="text">{c.text}</span>
                        </div>
                    </Draggable>
                ))}
                <div style={{ clear: "both" }} />
            </div>
        );
    }
}

export default ReportItems;
