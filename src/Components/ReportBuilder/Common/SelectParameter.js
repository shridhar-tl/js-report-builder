import React, { PureComponent } from "react";
import { BuilderContext } from "./Constants";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

class SelectParameter extends PureComponent {
    static contextType = BuilderContext;
    constructor(props) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidMount() {
        let { value } = this.props;
        const parameters = this.context.getParametersList();
        if (!value) {
            value = [];
        }
        const selItems = this.props.multiselect ? parameters.filter(p => value.indexOf(p.name) >= 0) : parameters.filter(p => p.name === value)[0];
        this.setState({ parameters, selItems });
    }

    selectionChanged = e => {
        this.setState({ selItems: e.value });
        const { onChange, multiselect } = this.props;
        if (onChange) {
            onChange(multiselect ? e.value.map(v => v.name) : (e.value || {}).name);
        }
    };

    render() {
        const { multiselect } = this.props;
        const { parameters = [], selItems } = this.state;

        if (multiselect) {
            return <MultiSelect appendTo={document.body} optionLabel="name" value={selItems} options={parameters} onChange={this.selectionChanged} placeholder="Choose one or more parameters" />;
        } else {
            return <Dropdown appendTo={document.body} optionLabel="name" value={selItems} options={parameters} onChange={this.selectionChanged} placeholder="Select a parameter" />;
        }
    }
}

export default SelectParameter;
