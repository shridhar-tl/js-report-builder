import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./ReportBuilder.scss";
import array from "../../Common/linq";
import ReportBase from "../ReportBase";
import ReportControls from "./ReportControls/ReportControls";
import ReportDisplay from "./ReportDisplay/ReportDisplay";
import { BuilderContext } from "./Common/Constants";
import { getDefaultRptDefinition } from "../../Common/ReportConfig";
import ImageProperties from "./ReportItems/Image/ImageProperties";
import ItemPropertiesPopup from "./Common/ItemPropertiesPopup";

class ReportBuilder extends ReportBase {
    constructor(props) {
        super(props);
        var { definition: data } = props;

        if (!data) {
            data = getDefaultRptDefinition();
        }
        else {
            data.datasets = data.datasets || {};

            data.reportItems = data.reportItems || [];
            data.datasetList = data.datasetList || [];
            data.parameters = data.parameters || [];
        }

        this.state = { data };
        this.builderProps = {
            ...this.sharedProps,
            getDatasetList: includeExpressionDS => {
                var { datasets, datasetList } = this.state.data;
                var list = array(
                    datasetList.map(id => {
                        var ds = datasets[id];
                        return { id, name: ds.name };
                    })
                ).sortBy("name")();

                if (includeExpressionDS) {
                    list.push({ id: -1, name: "<<Expression>>" });
                }
                return list;
            },
            editExpression: (definition) => {
                return new Promise((onChange, onHide) => {
                    this.setState({ expressionProps: { definition, isImage: definition.itemType === "IMG", onChange, onHide } });
                }).finally(() => { this.setState({ expressionProps: null }) });
            },
            getDataset: id => this.state.data.datasets[id],
            selectControl: (selElement, elementData) => {
                this.setState({ selElement, elementData });
            },
            getStateItems: () => (this.state.data.reportState || []).map(r => r.name)
            //getState: itemName => (itemName ? this.state[itemName] : this.state) // ToDo: Check if this is required
        };
    }

    componentDidMount() {
        var { api } = this.props;
        if (api) {
            api(this.externalApi);
        }
        this.builderProps.buildMyFunctions();
    }

    externalApi = {
        getReportDefinition: () => this.state.data
    };

    itemSelected = e => {
        var { selections } = e;
        if (selections) {
            this.setState({ selections });
            delete e.selections;
        }
    };

    render() {
        var { data, selections, expressionProps } = this.state;

        return (
            <BuilderContext.Provider value={this.builderProps}>
                <div className="report-builder">
                    <DndProvider backend={HTML5Backend}>
                        <div className="report-controls-cntr">
                            <ReportControls
                                data={data}
                                selectedItems={selections}
                                onChange={d => {
                                    this.setState({ data: d });
                                    if (this.props.onChange) {
                                        this.props.onChange(d);
                                    }
                                }}
                            />
                        </div>
                        <div className="report-display-cntr" onClick={this.itemSelected} onContextMenu={this.showContextMenu}>
                            <ReportDisplay
                                items={data.reportItems}
                                onChange={d => {
                                    data.reportItems = d;
                                    if (this.props.onChange) {
                                        this.props.onChange(data);
                                    }
                                }}
                            />
                        </div>
                    </DndProvider>
                </div>
                {expressionProps && !expressionProps.isImage && <ItemPropertiesPopup {...expressionProps} />}
                {expressionProps && expressionProps.isImage && <ImageProperties {...expressionProps} />}
            </BuilderContext.Provider>
        );
    }
}

export default ReportBuilder;
