import Image from 'next/image';
import React, { useState } from 'react'
import UserTypeSelector from './UserTypeSelector';
import { Button } from './ui/button';
import { removeCollaborator, updateDocumentAccess } from '@/lib/actions/room.actions';

/**
 * A component that renders a single collaborator in a list of collaborators.
 * It shows the collaborator's avatar, name, and email address. It also shows
 * a UserTypeSelector component that allows the user to change the user type
 * of the collaborator. If the user is the owner of the document, it renders
 * an "Owner" label instead of the UserTypeSelector component.
 *
 * @param {{ roomId: string, creatorId: string, collaborator: User, email: string, user: User }} props
 */
const Collaborator = ({ roomId, creatorId, collaborator, email, user }: CollaboratorProps) => {
  /**
   * The current user type of the collaborator. This is used to keep track of
   * the user type of the collaborator as it is being updated.
   */
  const [userType, setUserType] = useState(collaborator.userType || 'viewer');

  /**
   * A boolean indicating whether the update of the user type is in progress.
   * This is used to show a "loading" indicator while the update is happening.
   */
  const [loading, setLoading] = useState(false);

  /**
   * This function is responsible for updating the user type of a collaborator on a
   * collaborative document. It takes in the new user type and updates the document
   * access for the given email address.
   *
   * It first sets the loading state to true, indicating that the update is in
   * progress. It then calls the updateDocumentAccess function from the
   * @/lib/actions/room.actions module, passing in the roomId, email, new userType,
   * and the user doing the update.
   *
   * Once the update is complete, it sets the loading state back to false.
   *
   * @param {string} type - The new user type to be set for the collaborator.
   */
  const shareDocumentHandler = async (type: string) => {
    // Set the loading state to true to indicate that the update is in progress.
    setLoading(true);

    // Call the updateDocumentAccess function from the @/lib/actions/room.actions module,
    // passing in the roomId, email, new userType, and the user doing the update.
    await updateDocumentAccess({ 
      roomId, 
      email, 
      userType: type as UserType, 
      updatedBy: user 
    });

    // Set the loading state back to false to indicate that the update is complete.
    setLoading(false);
  }

  /**
   * This function handles the removal of a collaborator from a collaborative document.
   * It sets the loading state to true to indicate that the removal is in progress.
   * It then calls the removeCollaborator function from the @/lib/actions/room.actions module,
   * passing in the roomId and email of the collaborator to be removed.
   * Once the removal is complete, it sets the loading state back to false.
   *
   * @param {string} email - The email address of the collaborator to be removed.
   * @return {Promise<void>} A Promise that resolves when the collaborator has been successfully removed.
   */
  const removeCollaboratorHandler = async (email: string) => {
    // Set the loading state to true to indicate that the removal is in progress.
    setLoading(true);

    // Call the removeCollaborator function from the @/lib/actions/room.actions module,
    // passing in the roomId and email of the collaborator to be removed.
    await removeCollaborator({ roomId, email });

    // Set the loading state back to false to indicate that the removal is complete.
    setLoading(false);
  }

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image 
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && 'updating...'}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ): (
        <div className="flex items-center">
          <UserTypeSelector 
            userType={userType as UserType}
            setUserType={setUserType || 'viewer'}
            onClickHandler={shareDocumentHandler}
          />
          <Button type="button" onClick={() => removeCollaboratorHandler(collaborator.email)}>
            Remove
          </Button>
        </div>
      )}
    </li>
  )
}

export default Collaborator