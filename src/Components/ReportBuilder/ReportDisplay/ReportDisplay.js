import React, { PureComponent } from "react";
import "./ReportDisplay.scss";
import Droppable from "../DragDrop/Droppable";
import { componentsMap } from "../ReportItems/index";
import ReportItemBase from "../ReportItems/ReportItemBase";
import DraggableHandle from "../DragDrop/DraggableHandle";
import { getUniqueId } from "../Common/HelperFunctions";

class ReportDisplay extends PureComponent {
    constructor(props) {
        super();
        this.state = { addedItems: props.items };
        this.containerId = getUniqueId();
    }

    onItemAdded = (item, drg, index) => {
        var { addedItems } = this.state;

        if (index >= 0) {
            addedItems.splice(index, 0, item);
        }
        else {
            var newItem = { type: item.type }; // ToDo: attrs property need to be added
            addedItems.push(newItem);
        }

        addedItems = [...addedItems];

        this.setState({ addedItems });
        this.props.onChange(addedItems);
    };

    onItemRemoved = index => {
        var { addedItems } = this.state;
        addedItems.splice(index, 1);
        addedItems = [...this.state.addedItems];
        this.setState({ addedItems });
        this.props.onChange(addedItems);
    };

    moveItem = (srcIndex, destIndex, item) => {
        if (item.itemType === "EXST_ITMS") {
            var { addedItems } = this.state;

            var [movedItem] = addedItems.splice(srcIndex, 1);
            addedItems.splice(destIndex, 0, movedItem);
            addedItems = [...addedItems];

            this.setState({ addedItems });
            this.props.onChange(addedItems);
        } else {
            this.onItemAdded({ type: item.item.type }, null, destIndex); // ToDo: attrs property need to be added
        }
        return true;
    }

    onChanged = (data, index) => {
        var { addedItems } = this.state;
        addedItems[index].data = data;
        this.props.onChange(addedItems);
    };

    getControl = (item, index) => {
        var Ctl = componentsMap[item.type].control;

        if (!Ctl) { Ctl = ReportItemBase; }

        return (
            <DraggableHandle className="cmp-drg" index={index} itemType="EXST_ITMS" item={item} key={item._uniqueId} containerId={this.containerId} onItemRemoved={this.onItemRemoved}>
                {({ connectDragSource }) => (
                    <Ctl
                        dragSource={connectDragSource}
                        onItemMoved={this.moveItem}
                        onItemAdded={this.onItemAdded}
                        containerId={this.containerId}
                        index={index}
                        onItemRemoved={this.onItemRemoved}
                        data={item.data}
                        onChange={d => this.onChanged(d, index)}
                    />)
                }
            </DraggableHandle>
        );
    };

    render() {
        var { addedItems } = this.state;
        return (
            <div className="report-display">
                <Droppable className="drop-grp" type="RPT_ITMS" onItemAdded={this.onItemAdded} containerId={this.containerId}>
                    {!addedItems.length && (
                        <div className="message-no-items">
                            Drag and drop report items from left hand side to start building a report
                        </div>
                    )}
                    {addedItems.map(this.getControl)}
                </Droppable>
            </div>
        );
    }
}

export default ReportDisplay;
