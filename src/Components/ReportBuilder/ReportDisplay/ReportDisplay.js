import React, { Component } from 'react';
import "./ReportDisplay.scss"
import Droppable from '../DragDrop/Droppable';
import { componentsMap } from '../ReportItems/index'

class ReportDisplay extends Component {
    constructor(props) {
        super();
        this.state = { addedItems: props.items };
    }

    onItemAdded = (item) => {
        var addedItems = this.state.addedItems.map(i => i);
        addedItems.push({ type: item.type, attrs: {} });
        this.setState({ addedItems });
    }

    onItemRemoved = (index) => {
        this.state.addedItems.splice(index, 1);
        this.setState({ addedItems: [...this.state.addedItems] });
    }

    getControl = (item, index) => {
        var Ctl = componentsMap[item.type].control;
        if (item.attrs) {
            return <Ctl key={index} index={index} onItemRemoved={this.onItemRemoved} {...item.attrs}></Ctl>;
        }
        else {
            return <Ctl key={index} index={index} onItemRemoved={this.onItemRemoved} data={item.data}></Ctl>;
        }
    }

    render() {
        var { addedItems } = this.state;
        return (
            <div className="report-display">
                <div style={{ width: '100%', height: '40px' }}>
                </div>
                <Droppable className="drop-grp" type="RPT_ITMS" onItemAdded={this.onItemAdded}>
                    {!addedItems.length && <div className="message-no-items">Drag and drop report items from left hand side to start building a report</div>}
                    {addedItems.map(this.getControl)}
                </Droppable>
            </div>
        );
    }
}

export default ReportDisplay;