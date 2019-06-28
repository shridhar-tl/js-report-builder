import React from 'react';
import ContainerItem from './ContainerItem';
import { Panel } from 'primereact/panel';

class PanelContainer extends ContainerItem {
    constructor(props) {
        super(props);
        var { data: { toggleable, collapsed } = { toggleable: true, collapsed: false } } = props;
        this.state.toggleable = toggleable;
        this.state.collapsed = collapsed;
    }

    render() {
        var { toggleable, collapsed } = this.state;

        return super.renderBase(<div className="container-item">
            <Panel header="Panel header" toggleable={toggleable} collapsed={collapsed} onToggle={(e) => this.setState({ collapsed: e.value })}>
                {super.getDroppableContainer()}
            </Panel>
        </div>);
    }
}

export default PanelContainer;