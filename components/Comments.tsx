import { cn } from '@/lib/utils';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { Composer, Thread } from '@liveblocks/react-ui';
import { useThreads } from '@liveblocks/react/suspense';
import React from 'react'

/**
 * The ThreadWrapper component is a wrapper component for each thread in the Comments component.
 * It takes a thread prop, which is an object containing information about the thread.
 * 
 * The component uses the useIsThreadActive hook to determine if the thread is currently active.
 * The isActive variable is a boolean that represents whether the thread is active or not.
 * 
 * The component returns a JSX element that represents the thread. The element is a Thread component
 * from the @liveblocks/react-ui library. The Thread component takes the thread prop and a data-state
 * prop, which is used to apply CSS classes to the element based on its state.
 * 
 * The component also applies CSS classes to the element based on the thread's state. The classes are
 * 'comment-thread border', which applies general styles to the element, and '!border-blue-500 shadow-md',
 * which applies styles to the element when it is active. The '!border-blue-500 shadow-md' class is only applied
 * if the thread is active. Additionally, if the thread is resolved, the 'opacity-40' class is applied to
 * the element.
 * 
 * @param {object} props - The props object containing the thread prop.
 * @param {object} props.thread - The thread object containing information about the thread.
 * @returns {JSX.Element} - The JSX element representing the thread.
 */
const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  // Get whether the thread is currently active or not
  const isActive = useIsThreadActive(thread.id);

  // Return the Thread component with the appropriate props
  return (
    <Thread 
      thread={thread} // Pass the thread object to the Thread component
      data-state={isActive ? 'active' : null} // Apply the 'active' class if the thread is active
      className={cn('comment-thread border', // Apply general styles to the element
        isActive && '!border-blue-500 shadow-md', // Apply styles to the element when it is active
        thread.resolved && 'opacity-40' // Apply styles to the element when it is resolved
      )}
    />
  )
}

/**
 * Comments is a React functional component that renders a container for the comments
 * in the collaborative rich text editor. It takes no props.
 * 
 * The component uses the useThreads hook to get the list of threads associated with
 * the current document.
 * 
 * The component returns a JSX element that represents the comments interface. The
 * interface consists of a Composer component for creating new comments, and a
 * ThreadWrapper component for each thread in the list of threads.
 * 
 * The ThreadWrapper component is a higher-order component that takes a thread as a
 * prop and returns a Thread component with the thread prop and additional
 * properties (className and data-state) that are used to style the thread.
 * 
 * The className prop is used to style the thread with a border and a shadow if
 * the thread is active (i.e., the current user is the author of the thread). The
 * data-state prop is used to indicate whether the thread is active or not. If the
 * thread is active, the data-state prop is set to "active", otherwise it is set to
 * null.
 * 
 * The opacity-40 class is used to style the thread with a 40% opacity if the
 * thread is resolved (i.e., the current user has marked the thread as resolved).
 */
const Comments = () => {
  // Get the list of threads associated with the current document.
  const { threads } = useThreads();

  // Return a JSX element that represents the comments interface.
  return (
    <div className="comments-container">
      {/* Render a Composer component for creating new comments. */}
      <Composer className="comment-composer" />

      {/**Render a ThreadWrapper component for each thread in the list of threads. */}
      {threads.map((thread) => (
        // Pass the thread prop to the ThreadWrapper component.
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  )
}

export default Comments