import React, { PureComponent } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import ExpressionList from "./ExpressionList";
import ExpressionEditor from "./ExpressionEditor";
import { BuilderContext } from './Constants';
import { Dropdown } from 'primereact/dropdown';

class ActionProperties extends PureComponent {
    static contextType = BuilderContext;

    UNSAFE_componentWillMount() {
        this.stateList = this.context.getStateItems();
        this.fillMenuItems();
    }

    fillMenuItems() {
        const menuList = this.context.getMenuList();
        this.setState({ menuList });
    }

    render() {
        const { definition: { clickAction, actionProps }, setValue } = this.props;
        const { menuList } = this.state;

        return (
            <div className="field-collection">
                <div><RadioButton inputId="clickAction_None" onChange={(e) => setValue("clickAction", null)} checked={!clickAction} />
                    <label htmlFor="clickAction_None">None</label></div>
                <div><RadioButton inputId="clickAction_FNC" onChange={(e) => setValue("clickAction", "FNC")} checked={clickAction === "FNC"} />
                    <label htmlFor="clickAction_FNC">Call my function</label></div>
                <div><RadioButton inputId="clickAction_RST" onChange={(e) => setValue("clickAction", "RST")} checked={clickAction === "RST"} />
                    <label htmlFor="clickAction_RST">Set report state</label></div>
                <div><RadioButton inputId="clickAction_MNU" onChange={(e) => setValue("clickAction", "MNU")} checked={clickAction === "MNU"} />
                    <label htmlFor="clickAction_MNU">Show menu</label></div>
                {/*<div><RadioButton inputId="clickAction_RPT" onChange={(e) => setValue("clickAction", "RPT")} checked={clickAction === "RPT"} />
                    <label htmlFor="clickAction_RPT">Navigate to report</label></div>
                <div><RadioButton inputId="clickAction_BKM" onChange={(e) => setValue("clickAction", "BKM")} checked={clickAction === "BKM"} />
                    <label htmlFor="clickAction_BKM">Go to bookmark</label></div>*/}
                <div><RadioButton inputId="clickAction_LNK" onChange={(e) => setValue("clickAction", "LNK")} checked={clickAction === "LNK"} />
                    <label htmlFor="clickAction_LNK">Use it as hyperlink to external url</label></div >

                {(clickAction === "FNC" || clickAction === "LNK") && <div>
                    {clickAction === "FNC" && <label>Provide expression to call custom function</label>}
                    {clickAction === "LNK" && <label>Provide url or expression to resolve url</label>}
                    <ExpressionEditor expression={actionProps} isStrict={clickAction === "FNC"} autoDetect={true}
                        onChange={(expr, type, prop) => setValue("actionProps", expr)} />
                </div>}

                {(clickAction === "RST") && <div>
                    <label>Set value of report state</label>
                    <ExpressionList value={actionProps} autoDetect={true} nameField="name" valueField="value" nameFieldSet={this.stateList}
                        onChange={value => setValue("actionProps", value)} />
                </div>}

                {(clickAction === "MNU") && <div>
                    <label>Select menu to be displayed</label>
                    <Dropdown value={actionProps} appendTo={document.body} options={menuList} onChange={e => setValue("actionProps", e.value)} />
                </div>}

                {/* actions: go to report = [select report and pass parameters] */}
                {(clickAction === "RPT" || clickAction === "BKM") && <div>This functionality is not yet implemented</div>}
            </div>
        );
    }
}

export default ActionProperties;