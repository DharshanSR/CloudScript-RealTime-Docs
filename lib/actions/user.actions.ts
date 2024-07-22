'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

/**
 * This function takes a list of user IDs and fetches the corresponding users from Clerk.
 * It returns a list of users, sorted in the order of the original list of IDs.
 * 
 * The function first sends a GET request to the Clerk API to fetch the list of users.
 * The response contains an array of user objects, each containing the user's ID, name, email, and avatar.
 * The function then maps over the array of users and extracts the necessary information from each user object.
 * Finally, it sorts the list of users in the order of the original list of IDs and returns the sorted list.
 * 
 * @param {string[]} userIds - The list of user IDs to fetch.
 * @returns {Promise<string>} - A promise that resolves to a stringified list of users.
 */
export const getClerkUsers = async ({ userIds }: { userIds: string[]}) => {
  try {
    // Send a GET request to the Clerk API to fetch the list of users.
    const { data } = await clerkClient.users.getUserList({
      // Pass the list of user IDs as a parameter to the API.
      emailAddress: userIds,
    });

    // Map over the array of users and extract the necessary information from each user object.
    const users = data.map((user) => ({
      // The user's ID.
      id: user.id,
      // The user's name.
      name: `${user.firstName} ${user.lastName}`,
      // The user's email address.
      email: user.emailAddresses[0].emailAddress,
      // The user's avatar.
      avatar: user.imageUrl,
    }));

    // Sort the list of users in the order of the original list of IDs.
    const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

    // Return the sorted list of users as a stringified JSON object.
    return parseStringify(sortedUsers);
  } catch (error) {
    // Log any errors that occur during the fetching process.
    console.log(`Error fetching users: ${error}`);
  }
}


/**
 * Fetches the list of users associated with a given room ID.
 * If a search text is provided, it filters the list of users based on the search text.
 *
 * @param {Object} params - The parameters for fetching the document users.
 * @param {string} params.roomId - The ID of the room to fetch users for.
 * @param {string} params.currentUser - The current user's email address.
 * @param {string} params.text - The search text to filter users by.
 * @returns {Promise<string>} - A promise that resolves to a stringified list of users.
 */
export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
  try {
    // Fetch the room object from Liveblocks.
    const room = await liveblocks.getRoom(roomId);

    // Get the list of user email addresses associated with the room.
    const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

    // If a search text is provided, filter the list of users based on the search text.
    if(text.length) {
      const lowerCaseText = text.toLowerCase();

      // Filter the list of users based on a case-insensitive search of the user email addresses.
      const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));

      // Return the filtered list of users as a stringified JSON object.
      return parseStringify(filteredUsers);
    }

    // Return the list of users as a stringified JSON object.
    return parseStringify(users);
  } catch (error) {
    // Log any errors that occur during the fetching process.
    console.log(`Error fetching document users: ${error}`);
  }
}
