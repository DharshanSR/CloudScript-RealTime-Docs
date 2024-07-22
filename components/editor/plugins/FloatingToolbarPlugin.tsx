import {
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OPEN_FLOATING_COMPOSER_COMMAND } from '@liveblocks/react-lexical';
import type { LexicalEditor, LexicalNode } from 'lexical';
import { $getSelection, $isRangeSelection, $isTextNode } from 'lexical';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

/*
This is a React functional component named FloatingToolbar. It uses the useState and useEffect hooks from React 
to manage state and side effects respectively. The component uses the useLexicalComposerContext hook to get the 
editor object from the context. It then sets up an effect that listens for updates on the editor object. When an 
update occurs, it checks if the selection is a range selection and not collapsed. If so, it creates a DOM range 
using the createDOMRange function and sets it as the current range. The component also uses the range state to 
conditionally render the Toolbar component. If range is null, the component returns null, otherwise it renders 
the Toolbar component with the range and a function to update the range as props. The Toolbar component is not 
defined in this code snippet.
*/

export default function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();

  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    editor.registerUpdateListener(({ tags }) => {
      return editor.getEditorState().read(() => {
        // Ignore selection updates related to collaboration
        if (tags.has('collaboration')) return;

        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setRange(null);
          return;
        }

        const { anchor, focus } = selection;

        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset,
        );

        setRange(range);
      });
    });
  }, [editor]);

  if (range === null) return null;

  return (
    <Toolbar range={range} onRangeChange={setRange} container={document.body} />
  );
}

/*
This code defines a functional component named Toolbar in TypeScript with props range, onRangeChange, and container. 
It uses various hooks like useLexicalComposerContext, useFloating, and useLayoutEffect to manage state and side effects. 
The component creates a floating toolbar with a button that triggers a command when clicked.
*/
function Toolbar({
  range,
  onRangeChange,
  container,
}: {
  range: Range;
  onRangeChange: (range: Range | null) => void;
  container: HTMLElement;
}) {
  const [editor] = useLexicalComposerContext();

  const padding = 20;

  const {
    refs: { setReference, setFloating },
    strategy,
    x,
    y,
  } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [
      flip({ padding, crossAxis: false }),
      offset(10),
      hide({ padding }),
      shift({ padding, limiter: limitShift() }),
      size({ padding }),
    ],

    /*
    This code snippet defines a function called whileElementsMounted that takes in a variable number of arguments. 
    It returns the result of calling another function called autoUpdate with the same arguments, and an additional object 
    { animationFrame: true }. The purpose of this code is to ensure that the autoUpdate function is called with the 
    provided arguments and the animationFrame option set to true.
    */

    whileElementsMounted: (...args) => {
      return autoUpdate(...args, {
        animationFrame: true,
      });
    },
  });

  useLayoutEffect(() => {
    setReference({
      getBoundingClientRect: () => range.getBoundingClientRect(),
    });
  }, [setReference, range]);

  return createPortal(
    <div
      ref={setFloating}
      style={{
        position: strategy,
        top: 0,
        left: 0,
        transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
        minWidth: 'max-content',
      }}
    >
      <div className="floating-toolbar">
        <button
          onClick={() => {
            const isOpen = editor.dispatchCommand(
              OPEN_FLOATING_COMPOSER_COMMAND,
              undefined,
            );
            if (isOpen) {
              onRangeChange(null);
            }
          }}
          className="floating-toolbar-btn"
        >
          <Image
            src="/assets/icons/comment.svg"
            alt="comment"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>,
    container,
  );
}

/**
 * MIT License
 * Copyright (c) Meta Platforms, Inc. and affiliates.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
This function getDOMTextNode traverses the DOM tree starting from a given node until it finds a text node. 
If it finds a text node, it returns that node; otherwise, it returns null.
*/
function getDOMTextNode(element: Node | null): Text | null {
  let node = element;

  while (node !== null) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node as Text;
    }

    node = node.firstChild;
  }

  return null;
}

/*
This code defines a function called getDOMIndexWithinParent that takes a ChildNode as an argument. 
It first gets the parent node of the child node using the parentNode property. If the parent node is null, 
it throws an error. Otherwise, it returns an array containing the parent node and the index of the child node 
within its parent's child nodes. The index is obtained using the indexOf method on the childNodes property of the parent node.
*/
function getDOMIndexWithinParent(node: ChildNode): [ParentNode, number] {
  const parent = node.parentNode;

  if (parent === null) {
    throw new Error('Should never happen');
  }

  return [parent, Array.from(parent.childNodes).indexOf(node)];
}

/**
 * Creates a selection range for the DOM.
 * @param editor - The lexical editor.
 * @param anchorNode - The anchor node of a selection.
 * @param _anchorOffset - The amount of space offset from the anchor to the focus.
 * @param focusNode - The current focus.
 * @param _focusOffset - The amount of space offset from the focus to the anchor.
 * @returns The range of selection for the DOM that was created.
 */
export function createDOMRange(
  editor: LexicalEditor,
  anchorNode: LexicalNode,
  _anchorOffset: number,
  focusNode: LexicalNode,
  _focusOffset: number,
): Range | null {
  const anchorKey = anchorNode.getKey();
  const focusKey = focusNode.getKey();
  const range = document.createRange();
  let anchorDOM: Node | Text | null = editor.getElementByKey(anchorKey);
  let focusDOM: Node | Text | null = editor.getElementByKey(focusKey);
  let anchorOffset = _anchorOffset;
  let focusOffset = _focusOffset;

  if ($isTextNode(anchorNode)) {
    anchorDOM = getDOMTextNode(anchorDOM);
  }

  if ($isTextNode(focusNode)) {
    focusDOM = getDOMTextNode(focusDOM);
  }

  if (
    anchorNode === undefined ||
    focusNode === undefined ||
    anchorDOM === null ||
    focusDOM === null
  ) {
    return null;
  }

  if (anchorDOM.nodeName === 'BR') {
    [anchorDOM, anchorOffset] = getDOMIndexWithinParent(anchorDOM as ChildNode);
  }

  if (focusDOM.nodeName === 'BR') {
    [focusDOM, focusOffset] = getDOMIndexWithinParent(focusDOM as ChildNode);
  }

  const firstChild = anchorDOM.firstChild;

  if (
    anchorDOM === focusDOM &&
    firstChild !== null &&
    firstChild.nodeName === 'BR' &&
    anchorOffset === 0 &&
    focusOffset === 0
  ) {
    focusOffset = 1;
  }

  try {
    range.setStart(anchorDOM, anchorOffset);
    range.setEnd(focusDOM, focusOffset);
  } catch (e) {
    return null;
  }

  if (
    range.collapsed &&
    (anchorOffset !== focusOffset || anchorKey !== focusKey)
  ) {
    // Range is backwards, we need to reverse it
    range.setStart(focusDOM, focusOffset);
    range.setEnd(anchorDOM, anchorOffset);
  }

  return range;
}