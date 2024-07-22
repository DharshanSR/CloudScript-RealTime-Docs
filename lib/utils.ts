import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * This function takes in multiple class values as input and merges them using the 'clsx' utility function,
 * then applies the 'twMerge' function to merge the resulting classes while ensuring no duplicates.
 * 
 * @param inputs The class values to be merged.
 * @returns A string representing the merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

/**
 * This function takes a UserType enum and returns an array of strings representing
 * the access types that a user with that UserType has to a room.
 *
 * The access types are as follows:
 * - room:write: The user is able to write data to the room.
 * - room:read: The user is able to read data from the room.
 * - room:presence:write: The user is able to write to the room's presence.
 *
 * The default access type is ['room:read', 'room:presence:write'], which means that
 * the user can read data from the room and write to the room's presence, but cannot
 * write data to the room.
 *
 * The function is used by the getInitialProps function in the pages/_app file to
 * determine the access type for a user based on their UserType.
 */
export const getAccessType = (userType: UserType) => {
  switch (userType) {
    case 'creator':
      // Creators have full access to the room, including the ability to write data.
      return ['room:write'];
    case 'editor':
      // Editors have write access to the room, but not the ability to create or
      // delete documents.
      return ['room:write'];
    case 'viewer':
      // Viewers have read-only access to the room, and can write to the room's
      // presence (e.g. send messages to the room).
      return ['room:read', 'room:presence:write'];
    default:
      // The default access type is read-only access to the room, and the ability
      // to write to the room's presence.
      return ['room:read', 'room:presence:write'];
  }
};

/**
 * This function takes a timestamp as input and returns a human-readable 
 * string indicating how long ago the timestamp occurred.
 *
 * The function first converts the timestamp to a Unix timestamp (seconds since 
 * January 1, 1970) and then creates a new Date object from this timestamp.
 * The current date is then obtained using the Date constructor.
 *
 * The difference between the current date and the date obtained from the 
 * timestamp is calculated in milliseconds. This difference is then converted 
 * to seconds, minutes, hours, and days.
 *
 * The function then uses a switch statement to determine the appropriate 
 * string to return based on the calculated time difference. If the time 
 * difference is greater than 7 days, the function returns the number of weeks 
 * ago. If the time difference is between 1 and 7 days, the function returns the 
 * number of days ago. If the time difference is greater than 1 hour, the 
 * function returns the number of hours ago. If the time difference is greater 
 * than 1 minute, the function returns the number of minutes ago. Otherwise, 
 * the function returns 'Just now'.
 *
 * @param {string} timestamp - The timestamp to convert to a human-readable string.
 * @return {string} A string indicating how long ago the timestamp occurred.
 */
export const dateConverter = (timestamp: string): string => {
  // Convert timestamp to Unix timestamp and create a new Date object
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);

  // Get the current date
  const now: Date = new Date();

  // Calculate the time difference in milliseconds
  const diff: number = now.getTime() - date.getTime();

  // Convert time difference to seconds, minutes, hours, and days
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  // Determine the appropriate string to return based on the time difference
  switch (true) {
    case diffInDays > 7:
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    case diffInDays >= 1 && diffInDays <= 7:
      return `${Math.floor(diffInDays)} days ago`;
    case diffInHours >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case diffInMinutes >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return 'Just now';
  }
};

// Function to generate a random color in hex format while avoiding specified colors
export function getRandomColor() {
  // Array of colors to avoid: Black, White, Brown in hex format
  const avoidColors = ['#000000', '#FFFFFF', '#8B4513'];

  let randomColor;
  // Loop until a valid random color is generated
  do {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256); // Random number between 0-255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB to hex format
    randomColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  } while (avoidColors.includes(randomColor));

  // Return the randomly generated color
  return randomColor;
}

export const brightColors = [
  '#2E8B57', // Darker Neon Green
  '#FF6EB4', // Darker Neon Pink
  '#00CDCD', // Darker Cyan
  '#FF00FF', // Darker Neon Magenta
  '#FF007F', // Darker Bright Pink
  '#FFD700', // Darker Neon Yellow
  '#00CED1', // Darker Neon Mint Green
  '#FF1493', // Darker Neon Red
  '#00CED1', // Darker Bright Aqua
  '#FF7F50', // Darker Neon Coral
  '#9ACD32', // Darker Neon Lime
  '#FFA500', // Darker Neon Orange
  '#32CD32', // Darker Neon Chartreuse
  '#ADFF2F', // Darker Neon Yellow Green
  '#DB7093', // Darker Neon Fuchsia
  '#00FF7F', // Darker Spring Green
  '#FFD700', // Darker Electric Lime
  '#FF007F', // Darker Bright Magenta
  '#FF6347', // Darker Neon Vermilion
];

/**
 * This function takes a userId as input and generates a color for the user.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {string} The color associated with the user.
 */
export function getUserColor(userId: string) {
  // Initialize a sum variable to keep track of the ASCII values of the userId characters.
  let sum = 0;

  // Loop through each character in the userId string.
  for (let i = 0; i < userId.length; i++) {
    // Get the ASCII value of the current character and add it to the sum.
    sum += userId.charCodeAt(i);
  }

  // Calculate the index of the color in the brightColors array based on the sum.
  // The modulo operator (%) ensures that the index does not exceed the length of the array.
  const colorIndex = sum % brightColors.length;

  // Return the color associated with the calculated index.
  return brightColors[colorIndex];
}
