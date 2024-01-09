export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  // signal the browser that the thing we are dragging over is a valid drag target
  dragOverHandler(event: DragEvent): void;
  // handler the drop (update data and ui)
  dropHandler(event: DragEvent): void;
  // to revert visual update if drop is canceled
  dragLeaveHandler(event: DragEvent): void;
}
