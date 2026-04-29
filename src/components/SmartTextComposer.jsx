import { useEffect, useRef } from "react";

import {
  beginInlineChipDrag,
  dragState,
  removeGhost,
  resetDragState,
} from "./smartTextDrag";

/**
 * A smart-text segment is one editable piece of the sentence.
 *
 * Text segments store regular words exactly as the user typed them. Field
 * segments store a reference to an answer chip, such as `name` or `age`, so the
 * preview can replace that chip with the current answer value.
 *
 * @typedef {{ id: string, type: "text", value: string }} TextSegment
 * @typedef {{ id: string, type: "field", field: string }} FieldSegment
 * @typedef {TextSegment | FieldSegment} SmartTextSegment
 */

/**
 * Inline editor for smart text segments.
 *
 * React is intentionally not used to render every text node while the user is
 * typing. A contentEditable surface gives the "write a sentence" feel, and the
 * component parses that DOM back into serializable segments after edits. React
 * only rebuilds the DOM when external controls change the model, which avoids
 * cursor jumps during normal typing and drag-and-drop.
 */
export default function SmartTextComposer({
  fields,
  segments,
  version,
  onSegmentsChange,
}) {
  const editorRef = useRef(null);
  const fieldsRef = useRef(fields);
  const segmentsRef = useRef(segments);
  const onSegmentsChangeRef = useRef(onSegmentsChange);

  // Keep latest props available to DOM event handlers without re-binding them.
  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  useEffect(() => {
    onSegmentsChangeRef.current = onSegmentsChange;
  }, [onSegmentsChange]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    rebuildDom(editor, segmentsRef.current, fieldsRef.current);
  }, [version]);

  useEffect(() => {
    function onDragEndAnywhere() {
      if (!dragState.wasDropped) {
        removeGhost();
      }
      resetDragState();
    }
    document.addEventListener("dragend", onDragEndAnywhere);
    return () => document.removeEventListener("dragend", onDragEndAnywhere);
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return undefined;
    function onChipRemoved() {
      onSegmentsChangeRef.current(parseDom(editor));
    }
    editor.addEventListener("chip-removed", onChipRemoved);
    return () => editor.removeEventListener("chip-removed", onChipRemoved);
  }, []);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;
    onSegmentsChangeRef.current(parseDom(editor));
  }

  function ensureGhost() {
    if (dragState.ghost) return dragState.ghost;
    if (!dragState.fieldId) return null;
    const span = createChipSpan(dragState.fieldId, fieldsRef.current);
    span.classList.add("is-ghost");
    span.setAttribute("aria-hidden", "true");
    span.removeAttribute("draggable");
    dragState.ghost = span;
    return span;
  }

  /**
   * Places a preview chip at the caret position during drag.
   *
   * The preview chip is a real inline element, so the browser naturally wraps
   * surrounding text around it. We skip no-op moves to avoid layout thrashing
   * and flicker while dragover fires many times per second.
   */
  function moveGhostTo(clientX, clientY) {
    const editor = editorRef.current;
    if (!editor) return;

    const ghost = ensureGhost();
    if (!ghost) return;

    const range = getRangeFromPoint(clientX, clientY);
    const inEditor =
      range &&
      editor.contains(range.startContainer) &&
      !ghost.contains(range.startContainer);

    if (!inEditor) {
      if (!editor.contains(ghost)) {
        editor.appendChild(ghost);
      }
      return;
    }

    if (editor.contains(ghost) && isRangeAdjacentToNode(range, ghost)) {
      return;
    }

    range.insertNode(ghost);
  }

  function handleDragEnter(event) {
    if (!dragState.type) return;
    event.preventDefault();
    moveGhostTo(event.clientX, event.clientY);
  }

  function handleDragOver(event) {
    event.preventDefault();
    const allowed = event.dataTransfer.effectAllowed;
    event.dataTransfer.dropEffect = allowed === "move" ? "move" : "copy";
    if (!dragState.type) return;
    moveGhostTo(event.clientX, event.clientY);
  }

  function handleDragLeave(event) {
    const editor = editorRef.current;
    if (!editor) return;
    const next = event.relatedTarget;
    if (next && editor.contains(next)) return;
    removeGhost();
  }

  function handleDrop(event) {
    event.preventDefault();
    const editor = editorRef.current;
    if (!editor) return;

    dragState.wasDropped = true;

    if (!dragState.type) {
      const data = event.dataTransfer.getData("text/plain");
      if (!data) return;
      const separator = data.indexOf(":");
      if (separator < 0) return;
      const type = data.slice(0, separator);
      const value = data.slice(separator + 1);
      if (type === "field") {
        const span = createChipSpan(value, fieldsRef.current);
        insertSpanAtPoint(editor, span, event.clientX, event.clientY);
      } else if (type === "segment") {
        const original = editor.querySelector(
          `[data-segment-id="${value}"]`,
        );
        if (!original) return;
        const fieldId = original.getAttribute("data-field-id");
        original.remove();
        const span = createChipSpan(fieldId, fieldsRef.current, value);
        insertSpanAtPoint(editor, span, event.clientX, event.clientY);
      }
      editor.normalize();
      emitChange();
      return;
    }

    moveGhostTo(event.clientX, event.clientY);
    const ghost = dragState.ghost;
    if (!ghost) {
      emitChange();
      return;
    }

    if (dragState.type === "segment" && dragState.segmentId) {
      const original = editor.querySelector(
        `[data-segment-id="${dragState.segmentId}"]:not(.is-ghost)`,
      );
      if (original && original !== ghost) {
        original.remove();
        ghost.setAttribute("data-segment-id", dragState.segmentId);
      }
    }

    ghost.classList.remove("is-ghost");
    ghost.removeAttribute("aria-hidden");
    ghost.setAttribute("draggable", "true");
    addSpacingAround(ghost);
    dragState.ghost = null;

    editor.normalize();
    emitChange();
  }

  return (
    <div
      ref={editorRef}
      className="inline-composer"
      role="textbox"
      aria-label="Smart text editor"
      aria-multiline="true"
      contentEditable
      suppressContentEditableWarning
      onInput={emitChange}
      onBlur={emitChange}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  );
}

/**
 * Detects whether the drag caret is already on either side of the ghost chip.
 * Re-inserting the same node at the same location restarts CSS/layout work, so
 * this check keeps drag previews visually stable.
 */
function isRangeAdjacentToNode(range, node) {
  const { startContainer, startOffset } = range;

  if (startContainer === node.nextSibling && startOffset === 0) {
    return true;
  }

  if (
    startContainer === node.previousSibling &&
    startContainer.nodeType === Node.TEXT_NODE &&
    startOffset === startContainer.textContent.length
  ) {
    return true;
  }

  if (startContainer === node.parentNode) {
    const index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
    if (startOffset === index || startOffset === index + 1) {
      return true;
    }
  }

  return false;
}

/**
 * Converts pointer coordinates into a collapsed insertion range.
 *
 * Browsers can return a caret inside the text node of a contentEditable=false
 * chip. We snap those ranges to the chip boundary so chips remain atomic and
 * cannot be inserted inside one another.
 */
function getRangeFromPoint(x, y) {
  const range = rawRangeFromPoint(x, y);
  if (!range) return null;
  return snapRangeOutOfChip(range, x);
}

function rawRangeFromPoint(x, y) {
  if (typeof document.caretRangeFromPoint === "function") {
    return document.caretRangeFromPoint(x, y);
  }
  if (typeof document.caretPositionFromPoint === "function") {
    const position = document.caretPositionFromPoint(x, y);
    if (!position) return null;
    const range = document.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);
    return range;
  }
  return null;
}

/**
 * If the browser points inside an existing chip, move the insertion target to
 * before or after that chip based on the pointer's horizontal midpoint.
 */
function snapRangeOutOfChip(range, clientX) {
  let node = range.startContainer;
  while (node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList &&
      node.classList.contains("data-chip")
    ) {
      const rect = node.getBoundingClientRect();
      const midpoint = (rect.left + rect.right) / 2;
      const snapped = document.createRange();
      if (clientX < midpoint) {
        snapped.setStartBefore(node);
      } else {
        snapped.setStartAfter(node);
      }
      snapped.collapse(true);
      return snapped;
    }
    node = node.parentNode;
  }
  return range;
}

/**
 * Inserts a chip at the pointer location, falling back to the end of the editor
 * when the pointer lands in padding where no caret range is available.
 */
function insertSpanAtPoint(editor, span, clientX, clientY) {
  const range = getRangeFromPoint(clientX, clientY);
  if (range && editor.contains(range.startContainer)) {
    range.insertNode(span);
  } else {
    editor.appendChild(span);
  }
  addSpacingAround(span);
}

/**
 * Builds the chip DOM node used inside the contentEditable editor.
 *
 * Chips are imperative DOM nodes because React-controlled children inside a
 * contentEditable surface cause cursor jumps. The remove button dispatches a
 * small custom event so the composer can re-parse and sync React state.
 */
function createChipSpan(fieldId, fields, providedSegmentId) {
  const field = fields.find((item) => item.id === fieldId);
  const label = field?.label ?? fieldId;
  const segmentId =
    providedSegmentId ??
    `segment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const span = document.createElement("span");
  span.className = "data-chip inline-chip";
  span.contentEditable = "false";
  span.setAttribute("draggable", "true");
  span.setAttribute("data-segment-id", segmentId);
  span.setAttribute("data-field-id", fieldId);

  const labelNode = document.createElement("span");
  labelNode.className = "chip-label";
  labelNode.textContent = label;
  span.appendChild(labelNode);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "chip-remove";
  removeButton.draggable = false;
  removeButton.setAttribute("aria-label", `Remove ${label}`);
  removeButton.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const chip = removeButton.parentNode;
    if (!chip || !chip.parentNode) return;
    const editor = chip.parentNode;
    chip.remove();
    editor.dispatchEvent(new CustomEvent("chip-removed", { bubbles: true }));
  });
  span.appendChild(removeButton);

  span.addEventListener("dragstart", (event) => {
    beginInlineChipDrag(event, event.currentTarget);
  });

  return span;
}

/**
 * Adds minimal whitespace when a chip is inserted between words.
 */
function addSpacingAround(node) {
  if (
    !node.previousSibling ||
    (node.previousSibling.nodeType === Node.TEXT_NODE &&
      !/\s$/.test(node.previousSibling.textContent))
  ) {
    node.parentNode.insertBefore(document.createTextNode(" "), node);
  }

  if (
    !node.nextSibling ||
    (node.nextSibling.nodeType === Node.TEXT_NODE &&
      !/^\s/.test(node.nextSibling.textContent))
  ) {
    node.parentNode.insertBefore(document.createTextNode(" "), node.nextSibling);
  }
}

/**
 * Recreates the editable DOM from the `segments` prop.
 * Each segment is either plain text or a field chip, which keeps the editor's
 * value easy to store and render outside the contentEditable DOM.
 */
function rebuildDom(editor, segments, fields) {
  while (editor.firstChild) {
    editor.removeChild(editor.firstChild);
  }
  segments.forEach((segment) => {
    if (segment.type === "text") {
      editor.appendChild(document.createTextNode(segment.value));
    } else if (segment.type === "field") {
      editor.appendChild(createChipSpan(segment.field, fields, segment.id));
    }
  });
}

let parseCounter = 0;
/**
 * Reads the contentEditable DOM back into the same text/chip segment shape.
 * Ghost chips are skipped because they are only transient drag previews.
 */
function parseDom(editor) {
  const segments = [];

  editor.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.textContent;
      if (value !== "") {
        segments.push({
          id: `text-${++parseCounter}`,
          type: "text",
          value,
        });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    if (node.tagName === "BR") {
      return;
    }

    if (node.classList && node.classList.contains("is-ghost")) {
      return;
    }

    const segmentId = node.getAttribute("data-segment-id");
    const fieldId = node.getAttribute("data-field-id");

    if (segmentId && fieldId) {
      segments.push({
        id: segmentId,
        type: "field",
        field: fieldId,
      });
      return;
    }

    const fallbackText = node.textContent;
    if (fallbackText) {
      segments.push({
        id: `text-${++parseCounter}`,
        type: "text",
        value: fallbackText,
      });
    }
  });

  return segments;
}
