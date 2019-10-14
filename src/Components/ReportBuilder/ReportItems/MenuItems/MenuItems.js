import React from 'react';
import { Menu } from 'primereact/menu';
import ReportItemBase from '../ReportItemBase';
import MenuProperties from './MenuProperties';
import { getUniqueId } from '../../Common/HelperFunctions'

class MenuItems extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data: definition } = props;
        if (!definition) {
            var defId = "Menu" + getUniqueId();
            definition = {
                id: defId,
                name: defId,
                items: [
                    { label: "Menu 1", icon: "", hidden: false, disabled: false, expression: "" },
                    { label: "Menu 2", icon: "", hidden: false, disabled: false, expression: "" },
                    { label: "Menu 3", icon: "", hidden: false, disabled: false, expression: "" },
                    { label: "Menu 4", icon: "", hidden: false, disabled: false, expression: "" },
                    { label: "Menu 5", icon: "", hidden: false, disabled: false, expression: "" }
                ]
            };
        }
        this.state = { definition };
    }

    onChange = (definition) => {
        this.setState({ definition });
        this.props.onChange(definition);
        this.hideProperties();
    }

    render() {
        var { definition, showPropsDialog } = this.state;
        var { items } = definition;

        return super.renderBase(
            <div>
                <Menu model={items} />
                {showPropsDialog && <MenuProperties definition={definition} onChange={this.onChange} onHide={this.hideProperties} />}
            </div>
        );
    }
}

export default MenuItems;
