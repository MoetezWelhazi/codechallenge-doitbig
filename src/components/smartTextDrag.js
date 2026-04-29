export const dragState = {
  type: null,
  fieldId: null,
  segmentId: null,
  source: null,
  ghost: null,
  wasDropped: false,
};

export function beginShelfDrag(event, fieldId) {
  event.dataTransfer.setData("text/plain", `field:${fieldId}`);
  event.dataTransfer.effectAllowed = "copy";
  resetDragState();
  dragState.type = "field";
  dragState.fieldId = fieldId;
}

export function beginInlineChipDrag(event, target) {
  const id = target.getAttribute("data-segment-id");
  const sourceFieldId = target.getAttribute("data-field-id");
  event.dataTransfer.setData("text/plain", `segment:${id}`);
  event.dataTransfer.effectAllowed = "move";
  resetDragState();
  dragState.type = "segment";
  dragState.fieldId = sourceFieldId;
  dragState.segmentId = id;
  dragState.source = target;
  target.classList.add("is-dragging-source");
}

export function removeGhost() {
  if (dragState.ghost && dragState.ghost.parentNode) {
    dragState.ghost.parentNode.removeChild(dragState.ghost);
  }
  dragState.ghost = null;
}

export function resetDragState() {
  if (dragState.source) {
    dragState.source.classList.remove("is-dragging-source");
  }
  dragState.type = null;
  dragState.fieldId = null;
  dragState.segmentId = null;
  dragState.source = null;
  dragState.ghost = null;
  dragState.wasDropped = false;
}
