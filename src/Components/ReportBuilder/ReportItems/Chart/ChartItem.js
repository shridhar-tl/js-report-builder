import React, { PureComponent } from 'react';
import { Chart } from 'primereact/chart';
import { defaultChartDefinition, getChartTypes } from '../../../../Common/ChartConfig';
import ReportItemBase from '../ReportItemBase';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import ExpressionEditor from '../../Common/ExpressionEditor';
import { Dropdown } from 'primereact/dropdown';
import Button from '../../../Common/Button';
import { clone } from '../../../../Common/HelperFunctions';
import { Checkbox } from 'primereact/checkbox';
import './ChartItem.scss'

class ChartItem extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data: definition } = props;
        if (!definition) {
            definition = { type: "bar" };
        }

        this.state = { definition: { ...definition } };
    }

    getChartData() {
        var { chartData, state: { definition: { type } } } = this;
        if (!chartData || chartData.type !== type) {
            chartData = clone(defaultChartDefinition[type], true) || { type };
            this.chartData = chartData;
        }
        return chartData;
    }

    render() {
        var { state } = this;
        var { definition, showPropsDialog } = state;
        var { type, responsive, width, height } = definition;
        var { data, options } = this.getChartData();

        if (typeof width !== "string") { width = null; }
        if (typeof height !== "string") { height = null; }

        return super.renderBase(
            <div>
                <Chart type={type} data={data} options={options} responsive={responsive} width={width} height={height} />
                {showPropsDialog && <ChartItemProperties definition={definition} onChange={this.saveProperties} hideDialog={this.hideProperties} />}
            </div>
        );
    }
}

export default ChartItem;


class ChartItemProperties extends PureComponent {
    constructor(props) {
        super(props);
        var { definition } = props;
        definition = { ...definition };
        this.state = { definition, showDialog: true };
    }

    setValue(field, value) {
        var { definition } = this.state;
        definition[field] = value;
        definition = { ...definition };
        this.setState(this.validateProps(definition));
    }

    validateProps = (definition) => {
        var isParamValid = definition && definition.type && definition.data;
        return { definition, isParamValid: !!isParamValid };
    }

    hidePopup = () => {
        this.setState({ showDialog: false });
        this.props.hideDialog();
    }

    saveProperties = () => {
        this.props.onChange(this.state.definition);
        this.hidePopup();
    }

    render() {
        var { showDialog, definition, isParamValid } = this.state;
        var { type, data, options, hidden, width, height, responsive } = definition;
        if (!data) {
            //data = defaultChartDefinition[type].data;
            //data = JSON.stringify(data);
        }

        var footer = (
            <div>
                <Button type="default" icon="fa fa-times" onClick={this.hidePopup} label="Cancel" />
                <Button type="primary" icon="fa fa-check" onClick={this.saveProperties} disabled={!isParamValid} label="Save" />
            </div>
        );

        return (
            <div>
                <Dialog
                    header="Chart properties"
                    visible={showDialog}
                    footer={footer}
                    style={{ width: "50vw" }}
                    modal={true}
                    onHide={this.hidePopup}>
                    <TabView>
                        <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                            <div className="field-collection">
                                <div className="mandatory">
                                    <label>Chart type:</label>
                                    <Dropdown
                                        value={type}
                                        options={getChartTypes()}
                                        onChange={e => {
                                            this.setValue("type", e.value);
                                        }}
                                        placeholder="Select chart type"
                                    />
                                </div>

                                <div>
                                    <label>Visibility (hide graph if expression evaluates to true)</label>
                                    <ExpressionEditor expression={hidden} isStrict={true} onChange={(val) => this.setValue("hidden", val)} />
                                </div>

                                <div>
                                    <Checkbox inputId="cbChartResponsive" onChange={e => this.setValue("responsive", e.checked)} checked={responsive} />
                                    <label htmlFor="cbChartResponsive">Make the chart responsive</label>
                                </div>

                                <div>
                                    <label>Width</label>
                                    <ExpressionEditor disabled={responsive} autoDetect={true} expression={width} onChange={(val) => this.setValue("width", val)} />
                                </div>
                                <div>
                                    <label>Height</label>
                                    <ExpressionEditor disabled={responsive} autoDetect={true} expression={height} onChange={(val) => this.setValue("height", val)} />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Chart data">
                            <ExpressionEditor className="huge-textarea" expression={data} isStrict={true} wordWrap={true} multiline={true} onChange={(val) => this.setValue("data", val)} />
                        </TabPanel>
                        <TabPanel header="Chart Options">
                            <ExpressionEditor className="huge-textarea" expression={options} isStrict={true} wordWrap={true} multiline={true} onChange={(val) => this.setValue("options", val)} />
                        </TabPanel>
                    </TabView >
                </Dialog >
            </div>
        );
    }
}
