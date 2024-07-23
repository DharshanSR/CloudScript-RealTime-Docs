'use client';

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators';
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';

/**
 * The CollaborativeRoom component is a React functional component that renders a collaborative room.
 * It takes four props: roomId, roomMetadata, users, and currentUserType.
 *
 * roomId is a string that identifies the room that the component is associated with.
 * roomMetadata is an object that contains metadata about the room, such as its title and creator.
 * users is an array of User objects that represents the collaborators associated with the room.
 * currentUserType is a string that indicates the type of user that is currently logged in.
 *
 * The component renders a RoomProvider component with the roomId prop, which enables client-side rendering for the room.
 * It also renders a ClientSideSuspense component with a fallback of a Loader component, which displays a loading spinner when the room is loading.
 * The ClientSideSuspense component is used to suspend rendering of the component until the room is ready.
 *
 * The component renders a Header component, which displays the title of the room, a button to edit the title, and a list of collaborators associated with the room.
 * The title is rendered as a paragraph element. If the user is an editor, a button is displayed to edit the title.
 * If the user is not an editor, a "View only" tag is displayed.
 * The list of collaborators is rendered as an ActiveCollaborators component.
 * The button to edit the title is rendered as an Input component.
 * The Input component is rendered conditionally based on the current user type and the editing state.
 * The Input component has an onChange event handler that updates the documentTitle state.
 * The Input component has an onKeyDown event handler that updates the document title.
 * The Input component has a ref that is used to focus the input field when the editing state is true.
 *
 * The component also renders a ShareModal component, which is used to manage who can view and edit the document.
 * The ShareModal component is rendered conditionally based on the current user type.
 *
 * The component renders an Editor component, which is used to render the collaborative rich text editor.
 * The Editor component is rendered conditionally based on the current user type.
 *
 * The component returns a JSX element that represents the collaborative room interface.
 */
const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  // State variables
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title); // The title of the room
  const [editing, setEditing] = useState(false); // Whether the user is editing the title
  const [loading, setLoading] = useState(false); // Whether the room is loading

  // Refs
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container of the title and editing button
  const inputRef = useRef<HTMLDivElement>(null); // Ref for the input field

  // Function to update the document title
  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setLoading(true); // Set loading state to true

      try {
        if(documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle); // Update the document title

          if(updatedDocument) {
            setEditing(false); // Set editing state to false
          }
        }
      } catch (error) {
        console.error(error); // Log any errors that occur
      }

      setLoading(false); // Set loading state to false
    }
  }

  // Function to handle clicks outside of the title editing container
  const handleClickOutside = (e: MouseEvent) => {
    if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setEditing(false); // Set editing state to false
      updateDocument(roomId, documentTitle); // Update the document title
    }
  }

  // Use effect to add an event listener for clicks outside of the title editing container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false); // Set editing state to false
        updateDocument(roomId, documentTitle); // Update the document title
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [roomId, documentTitle])

  // Use effect to focus the input field when the editing state is true
  useEffect(() => {
    if(editing && inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  }, [editing])

  // Render the collaborative room interface
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
              {editing && !loading ? (
                <Input 
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter a Title for Your Document"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disable={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {currentUserType === 'editor' && !editing && (
                <Image 
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">Just a Moment, We are Saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />

              <ShareModal 
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />

              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom