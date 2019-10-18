import React, { PureComponent } from 'react';
import './ReportItemBase.scss';
import { showContextMenu } from '../../../lib';

class ReportItemBase extends PureComponent {
    constructor(props, propsDialog) {
        super(props);

        this.propsDialog = propsDialog;

        var { data } = props;
        if (!data) { data = {}; }
        this.state = { definition: { ...data } };
    }

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
        showContextMenu(e, this.menuModel);
    }

    renderBase(...children) {
        const { propsDialog: PropsDialog, state: { showPropsDialog, definition } } = this;
        const { index, onItemRemoved, dragSource, dropHandle, icon, text } = this.props;
        let childItems;
        if (children && children.length < 2) { childItems = children[0]; }
        else { childItems = children; }

        const header = <div className="header" onContextMenu={this.showContext}>
            <div className="pull-left"><span className={icon} /> <span>{text}</span></div>
            <div className="pull-right"><i className="fa fa-times" onClick={() => onItemRemoved(index)}
                title="Remove this report item permenantly"></i></div>
        </div>

        return <div className="component">
            <div ref={dropHandle} className="header-cntr">
                {dragSource ? dragSource(header) : header}
            </div>
            {childItems}
            {showPropsDialog && PropsDialog && <PropsDialog definition={definition} onChange={this.saveProperties} onHide={this.hideProperties} />}
        </div>;
    }

    render() {
        return this.renderBase(<div className="not-implemented">This component is not yet implemented!</div>)
    }
}

export default ReportItemBase;