// Enable client-side rendering for this component
'use client';

// Import necessary components and functions
import Loader from '@/components/Loader';
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

// Define the Provider component that takes children as props
const Provider = ({ children }: { children: ReactNode}) => {
  // Get the current logged-in user using Clerk
  const { user: clerkUser } = useUser();

  // Return the LiveblocksProvider with appropriate configurations
  return (
    <LiveblocksProvider 
    // Specify the authentication endpoint for Liveblocks
      authEndpoint="/api/liveblocks-auth"

      // Function to resolve users based on their IDs
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds});

        return users;
      }}

       // Function to resolve mention suggestions based on text input and room ID
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
          text,
        })

        return roomUsers;
      }}
    >
      {/* Render the children components with a fallback loader using ClientSideSuspense */}
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  )
}

export default Provider