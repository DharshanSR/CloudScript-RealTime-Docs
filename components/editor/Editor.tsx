'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React from 'react';

import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from '@liveblocks/react-lexical'
import Loader from '../Loader';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin'
import { useThreads } from '@liveblocks/react/suspense';
import Comments from '../Comments';
import { DeleteModal } from '../DeleteModal';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

/**
 * The Placeholder function is a React functional component that renders a 
 * placeholder message for the editor. It is used when the editor is empty.
 
 * The component returns a div element with the classname "editor-placeholder".
 * The text inside the div is "Enter some rich text...".
 
 * @return {JSX.Element} A div element with the classname "editor-placeholder"
 *                       and the text "Enter some rich text...".
 */
function Placeholder() {
  // Render a div element with the classname "editor-placeholder" and the text "Enter some rich text...".
  // This is used as a placeholder message for the editor when it is empty.
  return (
    <div className="editor-placeholder">
      Enter your richly formatted content here...
    </div>
  );
}

/**
 * The Editor component is a React functional component that renders the editor
 * for the collaborative rich text editor. It takes two props: roomId and currentUserType.
 * 
 * roomId is a string that identifies the room that the editor is associated with.
 * currentUserType is a string that indicates the type of user that is currently logged in.
 * 
 * The component uses several hooks and plugins to handle the editor functionality.
 * 
 * The component returns a JSX element that represents the editor interface.
 * 
 * @param {Object} props - An object containing the roomId and currentUserType props.
 * @param {string} props.roomId - A string that identifies the room that the editor is associated with.
 * @param {string} props.currentUserType - A string that indicates the type of user that is currently logged in.
 * @return {JSX.Element} A JSX element that represents the editor interface.
 */
export function Editor({ roomId, currentUserType }: { roomId: string, currentUserType: UserType }) {
  // Use the useEditorStatus hook to get the status of the editor.
  const status = useEditorStatus();
  // Use the useThreads hook to get the threads associated with the editor.
  const { threads } = useThreads();

  // Create an initial configuration object for the LexicalComposer using the liveblocksConfig function.
  const initialConfig = liveblocksConfig({
    // Set the namespace for the editor to "Editor".
    namespace: 'Editor',
    // Set the nodes for the editor to include the HeadingNode.
    nodes: [HeadingNode],
    // Set an error handler that logs the error and throws it.
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    // Set the theme for the editor to the Theme object.
    theme: Theme,
    // Set the editable property to true if the current user is an editor.
    editable: currentUserType === 'editor',
  });

  // Return a JSX element that represents the editor interface.
  return (
    // Wrap the editor interface in a LexicalComposer component with the initialConfig object.
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
          {/* If the current user is an editor, render the DeleteModal component with the roomId prop. */}
          {currentUserType === 'editor' && <DeleteModal roomId={roomId} />}
        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start">
          {/* If the editor is not loaded or is still loading, render a Loader component. */}
          {status === 'not-loaded' || status === 'loading' ? <Loader /> : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                // Set the placeholder for the editor to the Placeholder component.
                placeholder={<Placeholder />}
                // Set the ErrorBoundary for the editor to the LexicalErrorBoundary component.
                ErrorBoundary={LexicalErrorBoundary}
              />
              {/* If the current user is an editor, render the FloatingToolbarPlugin component. */}
              {currentUserType === 'editor' && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
