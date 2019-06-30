import React, { PureComponent } from 'react';
import './ReportItemBase.scss'
import { Menu } from 'primereact/menu';

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
        var childItems;
        if (children && children.length < 2) { childItems = children[0]; }
        else { childItems = children; }
        return <div className="component">
            <div className="header-cntr">
                <div className="header" onContextMenu={this.showContext}>
                    <div className="pull-left"></div>
                    <div className="pull-right"><i className="fa fa-times" onClick={() => this.props.onItemRemoved(this.props.index)}
                        title="Remove this report item permenantly"></i></div>
                </div>
            </div>
            <Menu model={this.menuModel} popup={true} ref={el => (this.itemContext = el)} />
            {childItems}
        </div >;
    }

    render() {
        return this.renderBase(<div className="not-implemented">This component is not yet implemented!</div>)
    }
}

export default ReportItemBase;