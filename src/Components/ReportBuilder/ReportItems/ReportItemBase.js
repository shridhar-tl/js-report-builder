import React, { PureComponent } from 'react';
import './ReportItemBase.scss'
import { Menu } from 'primereact/menu';
import Droppable from '../DragDrop/Droppable';

class ReportItemBase extends PureComponent {
    menuModel = [
        {
            label: "Remove",
            //icon: "pi pi-fw pi-plus",
            command: () => {
                this.props.onItemRemoved(this.props.index)
            }
        },
        {
            label: "Properties",
            //icon: "pi pi-fw pi-plus",
            command: () => {
                this.showProperties();
            }
        }
    ];

    showProperties() {
        this.setState({ showPropsDialog: true })
    }

    hideProperties = () => {
        this.setState({ showPropsDialog: false });
    }

    saveProperties = (definition) => {
        this.setState({ definition, showPropsDialog: false });
        this.props.onChange(definition);
    }

    showContext = (e) => {
        e.preventDefault();
        this.itemContext.toggle(e);
    }

    renderBase(...children) {
        var { index, onItemMoved, onItemAdded, onItemRemoved, dragSource, containerId } = this.props;
        var childItems;
        if (children && children.length < 2) { childItems = children[0]; }
        else { childItems = children; }

        var header = <div className="header" onContextMenu={this.showContext}>
            <div className="pull-left"></div>
            <div className="pull-right"><i className="fa fa-times" onClick={() => onItemRemoved(index)}
                title="Remove this report item permenantly"></i></div>
        </div>

        return <Droppable className="component" index={index} type={["RPT_ITMS", "EXST_ITMS"]} containerId={containerId}
            onItemMoved={onItemMoved} onItemAdded={onItemAdded}>
            <div className="header-cntr">
                {dragSource ? dragSource(header) : header}
            </div>
            <Menu model={this.menuModel} popup={true} ref={el => (this.itemContext = el)} />
            {childItems}
        </Droppable>;
    }

    render() {
        return this.renderBase(<div className="not-implemented">This component is not yet implemented!</div>)
    }
}

export default ReportItemBase;