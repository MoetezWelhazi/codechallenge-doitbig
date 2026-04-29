/**
 * Shared drag lifecycle state for shelf chips and inline chips.
 *
 * Native drag events are emitted by DOM nodes created inside contentEditable,
 * outside React's normal render tree. Keeping this tiny state object in a
 * module lets the shelf, inline chip DOM nodes, and composer agree on what is
 * currently being dragged without introducing heavier app state.
 */
export const dragState = {
  type: null,
  fieldId: null,
  segmentId: null,
  source: null,
  ghost: null,
  wasDropped: false,
};

/**
 * Starts a copy drag from the chip shelf into the composer.
 */
export function beginShelfDrag(event, fieldId) {
  event.dataTransfer.setData("text/plain", `field:${fieldId}`);
  event.dataTransfer.effectAllowed = "copy";
  resetDragState();
  dragState.type = "field";
  dragState.fieldId = fieldId;
}

/**
 * Starts a move drag for a chip that already lives in the inline composer.
 */
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

/**
 * Removes the transient preview chip used during drag hover.
 */
export function removeGhost() {
  if (dragState.ghost && dragState.ghost.parentNode) {
    dragState.ghost.parentNode.removeChild(dragState.ghost);
  }
  dragState.ghost = null;
}

/**
 * Clears drag state and restores the visual state of the original chip.
 */
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
