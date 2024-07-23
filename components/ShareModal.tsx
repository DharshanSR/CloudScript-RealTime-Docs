'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react'
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

/**
 * A modal dialog component that allows the user to share a document with another user.
 * It takes the following props:
 * - roomId: The ID of the room that the document is in.
 * - collaborators: An array of User objects that represent the collaborators associated with the document.
 * - creatorId: The ID of the user that created the document.
 * - currentUserType: The type of user that is currently logged in.
 
 * When the user clicks the "Share" button, it opens the dialog.
 * The dialog contains a form with an input field for the email address of the user to share the document with.
 * It also contains a UserTypeSelector component to select the user type of the user to share the document with.
 * The user type is stored in the state variable userType.
 
 * When the user submits the form, it calls the shareDocumentHandler function, which sends a request to the server to update the document access.
 * The request is done using the updateDocumentAccess function from the @/lib/actions/room.actions module.
 * The function takes the roomId, email, userType, and updatedBy as parameters.
 * The updatedBy parameter is the user object that is currently logged in.
 
 * The component also renders a list of collaborators associated with the document.
 * Each collaborator is rendered as a Collaborator component.
 * The Collaborator component takes the collaborator object as a prop, as well as the roomId, creatorId, and user object.
 */
const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('viewer');

  /**
   * A function that is called when the user submits the form.
   * It sends a request to the server to update the document access.
   * The request is done using the updateDocumentAccess function from the @/lib/actions/room.actions module.
   * The function takes the roomId, email, userType, and updatedBy as parameters.
   * The updatedBy parameter is the user object that is currently logged in.
   */
  const shareDocumentHandler = async () => {
    setLoading(true);

    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: user.info,
    });

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gradient-blue flex h-10 gap-1 px-4" disabled={currentUserType !== 'editor'}>
          <Image
            src="/assets/icons/internet.svg"
            alt="share"
            width={32}
            height={32}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">
          Collaborate
          </p>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Personalize Access: Manage Viewer Permissions</DialogTitle>
          <DialogDescription>Specify User Permissions for Viewing and Editing</DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-white">
          Enter The Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
            />
            <UserTypeSelector
              userType={userType}
              setUserType={setUserType}
            />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className={`bg-gradient-to-r from-blue-500 to-green-500 flex h-full gap-1 px-5 text-white font-medium transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? 'Processing....' : 'Share Access'}
          </Button>
        </div>

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareModal