import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const dragSource = {
  beginDrag(props, monitor, component) {
    return props;
  }
  //endDrag(props, monitor, component) {
  //  if (!monitor.didDrop()) {
  //    // You can check whether the drop was successful
  //    // or if the drag ended but nobody handled the drop
  //    return;
  //  }

  //  // When dropped on a compatible target, do something.
  //  // Read the original dragged item from getItem():
  //  const item = monitor.getItem();

  //  // You may also read the drop result from the drop target
  //  // that handled the drop, if it returned an object from
  //  // its drop() method.
  //  const dropResult = monitor.getDropResult();

  //  // This is a good place to call some Flux action
  //  //CardActions.moveCardToList(item.id, dropResult.listId);
  //}
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class DraggableHandle extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }


  render() {
    const { connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>{this.props.children}</div>
    );
  }
}

DraggableHandle.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource((prop) => prop.itemType, dragSource, collect)(DraggableHandle);
