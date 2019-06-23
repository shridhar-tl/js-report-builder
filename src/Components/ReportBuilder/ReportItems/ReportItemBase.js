import React, { PureComponent } from 'react';
import './ReportItemBase.scss'

class ReportItemBase extends PureComponent {

    renderBase(...children) {
        var childItems;
        if (children && children.length < 2) { childItems = children[0]; }
        else { childItems = children; }
        return <div className="component">
            <div className="header-cntr">
                <div className="header">
                    <div className="pull-left"></div>
                    <div className="pull-right"><i className="fa fa-times" onClick={() => this.props.onItemRemoved(this.props.index)}
                        title="Remove this report item permenantly"></i></div>
                </div>
            </div>
            {childItems}
        </div >;
    }

    render() {
        return this.renderBase(<div className="not-implemented">This component is not yet implemented!</div>)
    }
}

export default ReportItemBase;