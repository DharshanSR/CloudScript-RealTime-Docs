// Import necessary modules and components
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Define the Document component as an async function
const Document = async ({ params: { id } }: SearchParamProps) => {
  // Fetch the current logged-in user using Clerk
  const clerkUser = await currentUser();

  // If no user is logged in, redirect to the sign-in page
  if (!clerkUser) redirect('/sign-in');

  // Fetch the document (room) details based on the provided room ID and current user's email
  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  // If no room is found, redirect to the homepage
  if (!room) redirect('/');

  // Get the user IDs who have access to the room
  const userIds = Object.keys(room.usersAccesses);

  // Fetch the user details for these user IDs
  const users = await getClerkUsers({ userIds });

  // Map the users to include a userType based on their access level in the room
  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write')
      ? 'editor'
      : 'viewer'
  }));

  // Determine the current user's access level (editor or viewer)
  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write')
    ? 'editor'
    : 'viewer';

  // Render the CollaborativeRoom component with the room and user data
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom 
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
}

// Export the Document component as the default export of this module
export default Document;
