import React, { Component } from 'react';
import Droppable from './Droppable'
import { DRAG_TYPE_FILTER, DRAG_TYPE_ACTION } from '../constants'

class DroppableArea extends Component {
  constructor(props) {
    super(props);
    this.state = { filters: props.filters, actions: props.actions };

    this.filtersAdded = this.filtersAdded.bind(this);
    this.filtersRemoved = this.filtersRemoved.bind(this);
    this.actionsAdded = this.actionsAdded.bind(this);
    this.actionsRemoved = this.actionsRemoved.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ filters: props.filters, actions: props.actions });
  }

  filtersAdded(item) {
    this.props.filters.Add({ id: item.id })
  }

  filtersRemoved(index, item) {
    this.props.filters.RemoveAt(index);
    this.setObj("filters", this.props.filters.Select());
  }

  actionsAdded(item) {
    this.props.actions.Add({ id: item.id })
  }

  actionsRemoved(index, item) {
    this.props.actions.RemoveAt(index);
    this.setObj("actions", this.props.actions.Select());
  }

  setObj(propName, obj) {
    let modProp = null;
    if (propName) { modProp = { [propName]: obj }; }
    let newStateObj = Object.assign({}, this.state.currentHandler, modProp);
    this.setState({ currentHandler: newStateObj });
  }

  render() {
    return (
      <div>
        <Droppable type={DRAG_TYPE_FILTER} items={this.state.filters} className="drop-grp" onItemAdded={this.filtersAdded} onItemRemoved={this.filtersRemoved}></Droppable>
        <Droppable type={DRAG_TYPE_ACTION} items={this.state.actions} className="drop-grp" onItemAdded={this.actionsAdded} onItemRemoved={this.actionsRemoved}></Droppable>
      </div>
    );
  }
}

export default DroppableArea;
