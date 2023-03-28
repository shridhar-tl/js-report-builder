import React, { PureComponent } from "react";
import "./ReportDisplay.scss";
import { componentsMap } from "../ReportItems/index";
import ReportItemBase from "../ReportItems/ReportItemBase";
import { getUniqueId } from "../Common/HelperFunctions";
import Sortable from "../DragDrop/Sortable";

const noReportItemsPlaceholder = <div className="message-no-items">Drag and drop report items from left hand side to start building a report</div>;
const droppablePlaceholder = <div className="message-no-items">Drag and drop more report items here</div>;
const accepts = ["RPT_ITMS", "RPT_CMPN"];

class ReportDisplay extends PureComponent {
    constructor(props) {
        super();
        this.state = { addedItems: props.items };
        this.containerId = getUniqueId();
    }

    onItemAdded = (source, target) => {
        const { item } = source;
        const { index } = target;
        let { addedItems } = this.state;
        addedItems = [...addedItems];

        const newItem = { type: item.type }; // ToDo: attrs property need to be added
        if ((index !== 0 && !index) || index >= addedItems.length) {
            addedItems.push(newItem);
        }
        else {
            addedItems.splice(index, 0, newItem);
        }

        this.itemsChanged(addedItems);
    };

    itemsChanged = (addedItems) => {
        this.setState({ addedItems });
        this.props.onChange(addedItems);
    };

    onItemRemoved = index => {
        let { addedItems } = this.state;
        addedItems.splice(index, 1);
        addedItems = [...this.state.addedItems];
        this.setState({ addedItems });
        this.props.onChange(addedItems);
    };

    onChanged = (data, index) => {
        const { addedItems } = this.state;
        addedItems[index].data = data;
        this.props.onChange(addedItems);
    };

    getControl = (item, index, drpHndl, drgSrc) => {
        const { icon, text } = componentsMap[item.type];
        let { control: Ctl } = componentsMap[item.type];

        if (!Ctl) { Ctl = ReportItemBase; }

        return (
            <Ctl
                dragSource={drgSrc.dragHandle}
                dropHandle={drpHndl.dropConnector}
                icon={icon}
                text={text}
                index={index}
                onItemRemoved={this.onItemRemoved}
                data={item.data}
                onChange={d => this.onChanged(d, index)}
            />
        );
    };

    render() {
        const { addedItems } = this.state;
        const hasReportItems = addedItems && addedItems.length > 0;

        return (
            <div className="report-display">
                <Sortable className="drop-grp" draggableClassName="component" itemType="RPT_ITMS" accepts={accepts} keyName="_uniqueId"
                    useDragHandle items={addedItems} onChange={this.itemsChanged}
                    placeholder={hasReportItems ? droppablePlaceholder : noReportItemsPlaceholder}
                    onItemAdded={this.onItemAdded}>{this.getControl}</Sortable>
            </div>
        );
    }
}

export default ReportDisplay;
