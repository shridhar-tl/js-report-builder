import React, { PureComponent } from "react";
import { BuilderContext } from "./Constants";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

class SelectDataset extends PureComponent {
    static contextType = BuilderContext;
    constructor(props) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidMount() {
        let { value, multiselect, includeExprDS, excludeDS, allowUnselect } = this.props;
        let datasets = this.context.getDatasetList(!!includeExprDS);

        if (excludeDS) {
            datasets = datasets.filter(ds => ds.id !== excludeDS);
        }

        if (!multiselect && allowUnselect !== false) {
            datasets.splice(0, 0, { id: null, name: "(none)" });
        }

        if (!value) {
            value = [];
        }
        const selItems = multiselect ? datasets.filter(ds => value.indexOf(ds.id) >= 0) : datasets.filter(ds => ds.id === value)[0];
        this.setState({ datasets, selItems });
    }

    selectionChanged = e => {
        this.setState({ selItems: e.value });
        const { onChange, multiselect } = this.props;
        if (onChange) {
            onChange(multiselect ? e.value.map(v => v.id) : (e.value || {}).id);
        }
    };

    render() {
        const { multiselect, placeholder } = this.props;
        const { datasets = [], selItems } = this.state;

        if (multiselect) {
            return <MultiSelect appendTo={document.body} optionLabel="name" value={selItems} options={datasets} onChange={this.selectionChanged} placeholder={placeholder || "Select one or more dataset"} />;
        } else {
            return <Dropdown appendTo={document.body} optionLabel="name" value={selItems} options={datasets} onChange={this.selectionChanged} placeholder={placeholder || "Select a dataset"} />;
        }
    }
}

export default SelectDataset;
