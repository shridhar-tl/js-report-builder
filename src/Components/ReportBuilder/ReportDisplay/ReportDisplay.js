import React, { Component } from "react";
import "./ReportDisplay.scss";
import Droppable from "../DragDrop/Droppable";
import { componentsMap } from "../ReportItems/index";
import ReportItemBase from "../ReportItems/ReportItemBase";

class ReportDisplay extends Component {
    constructor(props) {
        super();
        this.state = { addedItems: props.items };
    }

    onItemAdded = item => {
        var addedItems = this.state.addedItems.map(i => i);
        addedItems.push({ type: item.type, attrs: {} });
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

    onChanged = (data, index) => {
        var { addedItems } = this.state;
        addedItems[index].data = data;
        this.props.onChange(addedItems);
    };

    getControl = (item, index) => {
        var Ctl = componentsMap[item.type].control;

        if (!Ctl) { Ctl = ReportItemBase; }

        if (item.attrs) {
            return <Ctl key={index} index={index} onItemRemoved={this.onItemRemoved} {...item.attrs} />;
        } else {
            return (
                <Ctl
                    key={index}
                    index={index}
                    onItemRemoved={this.onItemRemoved}
                    data={item.data}
                    onChange={d => this.onChanged(d, index)}
                />
            );
        }
    };

    render() {
        var { addedItems } = this.state;
        return (
            <div className="report-display">
                <Droppable className="drop-grp" type="RPT_ITMS" onItemAdded={this.onItemAdded}>
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
