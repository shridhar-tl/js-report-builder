import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const dragSource = {
  beginDrag(props, monitor, component) {
    return props;
  }
  /*endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();

    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();
  }*/
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

class DraggableHandle extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {};
  }


  render() {
    var { children, connectDragSource, connectDragPreview, isDragging, className } = this.props;

    if (typeof children === "function") {
      return connectDragPreview(<div className={className}>{!isDragging && children({ connectDragSource, isDragging })}</div>
      );
    }
    else {
      return connectDragSource(<div className={className}>{!isDragging && children}</div>
      );
    }
  }
}

DraggableHandle.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired
};

export default DragSource((prop) => prop.itemType, dragSource, collect)(DraggableHandle);
