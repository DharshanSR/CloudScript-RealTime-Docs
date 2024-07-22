'use server';

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation';

/**
 This function creates a new collaborative document.

It takes an object with `userId` and `email` properties as an argument.
It generates a unique `roomId` using the `nanoid` library.
It then creates a new room with the generated `roomId` using the `liveblocks.createRoom` method.
The room is initialized with metadata that includes the `userId`, `email`, and a default title of "Untitled".
The room also has a `usersAccesses` object that grants write access to the user associated with the provided `email`.
Additionally, default accesses are set to an empty array.

If the room is successfully created, it is returned as a parsed and stringified object.
If an error occurs during the creation process, it is logged to the console.

@param {Object} params - An object with `userId` and `email` properties.
@param {string} params.userId - The ID of the user creating the document.
@param {string} params.email - The email of the user creating the document.
@return {Promise<Object>} A promise that resolves to the parsed and stringified room object.
*/
export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
  // Generate a unique ID for the room
  const roomId = nanoid();

  try {
    // Create metadata for the room
    const metadata = {
      creatorId: userId, // The ID of the user creating the room
      email, // The email of the user creating the room
      title: 'Untitled' // The default title for the room
    }

    // Create an object that grants write access to the user with the provided email
    const usersAccesses: RoomAccesses = {
      [email]: ['room:write']
    }

    // Create a new room using the Liveblocks API
    const room = await liveblocks.createRoom(roomId, {
      metadata, // The metadata for the room
      usersAccesses, // The access control for the room
      defaultAccesses: [] // An array of default accesses for the room
    });
    
    // Revalidate the root path of the application
    revalidatePath('/');

    // Return the parsed and stringified room object
    return parseStringify(room);
  } catch (error) {
    // Log any errors that occur during the creation process
    console.log(`Error happened while creating a room: ${error}`);
  }
}

/**
 * Retrieves a room from Liveblocks based on the provided room ID and user ID.
 * If the user does not have access to the room, an error is thrown.
 *
 * @param {Object} params - An object with `roomId` and `userId` properties.
 * @param {string} params.roomId - The ID of the room to retrieve.
 * @param {string} params.userId - The ID of the user requesting the room.
 * @return {Promise<Object>} A promise that resolves to the parsed and stringified room object.
 * @throws {Error} If the user does not have access to the room.
 */
export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
  try {
    // Retrieve the room from Liveblocks using the provided room ID
    const room = await liveblocks.getRoom(roomId);

    // Check if the user has access to the room
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    // If the user does not have access, throw an error
    if (!hasAccess) {
      throw new Error('You do not have access to this document');
    }

    // If the user has access, return the parsed and stringified room object
    return parseStringify(room);
  } catch (error) {
    // Log any errors that occur during the retrieval process
    console.log(`Error happened while getting a room: ${error}`);
  }
}

/**
 * Updates the title of a document room in Liveblocks.
 *
 * @param {string} roomId - The ID of the room to update.
 * @param {string} title - The new title for the room.
 * @return {Promise<string>} A promise that resolves to the updated room as a stringified JSON object.
 * @throws {Error} If there is an error updating the room.
 */
export const updateDocument = async (roomId: string, title: string) => {
  try {
    // Use the Liveblocks SDK to update the room with the provided ID.
    // The update includes the new title for the room.
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title
      }
    })

    // Revalidate the page for the updated room, which will trigger a re-render of the page.
    revalidatePath(`/documents/${roomId}`);

    // Parse and stringify the updated room object.
    // This is done to ensure that the object is returned as a stringified JSON object.
    return parseStringify(updatedRoom);
  } catch (error) {
    // If there is an error updating the room, log the error and re-throw the error.
    console.log(`Error happened while updating a room: ${error}`);
    throw error;
  }
}

/**
 * Retrieves all documents that a user has access to.
 *
 * @param {string} email - The email address of the user to retrieve documents for.
 * @return {Promise<string | null>} A promise that resolves to the list of documents as a JSON string, or null if there is an error.
 * @throws {Error} If there is an error retrieving the list of documents.
 */
export const getDocuments = async (email: string ) => {
  try {
    // Get the list of rooms that the user has access to.
    // The getRooms method of the Liveblocks client returns a promise that resolves to an array of room objects.
    const rooms = await liveblocks.getRooms({ userId: email });

    // Parse and stringify the list of rooms so that it can be returned as a JSON string.
    // This is done to ensure that the list of rooms is returned as a stringified JSON object.
    return parseStringify(rooms);
  } catch (error) {
    // Log any errors that occur during the retrieval process.
    console.log(`Error happened while getting rooms: ${error}`);

    // Return null if there is an error retrieving the list of documents.
    return null;
  }
}

/**
 * Updates the access level of a user in a room.
 * 
 * @param {ShareDocumentParams} params - An object containing the room ID, email address, user type, and user who made the update.
 * @returns {Promise<string | null>} A promise that resolves to a stringified JSON representation of the updated room, or null if there's an error.
 * @throws {Error} If there's an error updating the room.
 */
export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
  try {
    // Create an object that maps the email address to the access type.
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType, // Get the access type based on the user type and convert it to the appropriate type.
    }

    // Update the room with the new access information.
    const room = await liveblocks.updateRoom(roomId, { 
      usersAccesses // Pass in the usersAccesses object as the usersAccesses property.
    })

    // If the room was updated successfully, trigger an inbox notification.
    if(room) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email, // Send the notification to the specified email address.
        kind: '$documentAccess', // Specify the kind of notification.
        subjectId: notificationId, // Use a unique ID for the notification.
        activityData: {
          userType, // Include the user type in the notification data.
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`, // Include a title in the notification data.
          updatedBy: updatedBy.name, // Include the name of the user who made the update in the notification data.
          avatar: updatedBy.avatar, // Include the avatar URL of the user who made the update in the notification data.
          email: updatedBy.email // Include the email address of the user who made the update in the notification data.
        },
        roomId // Include the room ID in the notification data.
      })
    }

    revalidatePath(`/documents/${roomId}`); // Revalidate the page for the updated room.
    return parseStringify(room); // Return the updated room as a stringified JSON object.
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`); // Log any errors that occur during the update process.
  }
}

/**
 * This function removes a collaborator from a collaborative document.
 * It takes an object with two properties: roomId and email.
 *
 * roomId is a string that identifies the room that the collaborator is associated with.
 * email is a string that identifies the email address of the collaborator to be removed.
 *
 * The function first retrieves the room associated with the roomId.
 * If the email address of the room's creator matches the email address of the collaborator to be removed,
 * a new Error is thrown with the message "You cannot remove yourself from the document".
 *
 * The function then updates the room by removing the collaborator from the list of usersAccesses.
 * The updatedRoom object is returned as a stringified JSON object.
 *
 * If any errors occur during the process, they are logged to the console.
 */
export const removeCollaborator = async ({ roomId, email }: {roomId: string, email: string}) => {
  try {
    // Retrieve the room associated with the roomId.
    const room = await liveblocks.getRoom(roomId)

    // If the email address of the room's creator matches the email address of the collaborator to be removed,
    // throw a new Error with the message "You cannot remove yourself from the document".
    if(room.metadata.email === email) {
      throw new Error('You cannot remove yourself from the document');
    }

    // Update the room by removing the collaborator from the list of usersAccesses.
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null // Set the access type of the collaborator to null to remove them from the room.
      }
    })

    // Revalidate the page for the updated room.
    revalidatePath(`/documents/${roomId}`);

    // Return the updated room as a stringified JSON object.
    return parseStringify(updatedRoom);
  } catch (error) {
    // If any errors occur during the process, log them to the console.
    console.log(`Error happened while removing a collaborator: ${error}`);
  }
}

/**
 * Asynchronously deletes a document based on the specified roomId.
 * 
 * @param {string} roomId - The unique identifier of the room/document to be deleted.
 */
export const deleteDocument = async (roomId: string) => {
  try {
    // Attempt to delete the room associated with the given roomId.
    await liveblocks.deleteRoom(roomId);

    // Revalidate the path to the root URL after the deletion.
    revalidatePath('/');

    // Redirect to the root URL after the deletion is complete.
    redirect('/');
  } catch (error) {
    // Log any errors that occur during the deletion process.
    console.log(`Error happened while deleting a room: ${error}`);
  }
}
