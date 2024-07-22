import { useOthers } from '@liveblocks/react/suspense'
import Image from 'next/image';

/**
 * A component that renders a list of all the other users in the current room,
 * along with their avatar and name.
 *
 * @returns A list of active collaborators in the current room.
 */
const ActiveCollaborators = () => {
  /**
   * Get the list of all other users in the room (excluding the current user).
   * This is done by calling the useOthers hook from the useLiveblocks library.
   */
  const others = useOthers();

  /**
   * Create a new array containing the user information for each of the other
   * users in the room.
   */
  const collaborators = others.map((other) => other.info);

  /** 
   * Return a list of items, each representing one of the other users in the
   * room. Each item contains an image element displaying their avatar, with
   * the name of the user as the alt text for accessibility.
   *
   * Note that the image element is given a size of 100x100 pixels, and a
   * rounded-full class to make it appear as a circle. The image element is
   * also given a ring-2 class to add a 2-pixel ring around the image, and a
   * ring-dark-100 class to make the ring appear as a dark background. The
   * color of the ring is set to the color associated with the user, which is
   * retrieved from the user information object.
   */
  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id}>
          <Image 
            src={avatar}
            alt={name}
            width={100}
            height={100}
            className='inline-block size-8 rounded-full ring-2 ring-dark-100'
            style={{border: `3px solid ${color}`}}
          />
        </li>
      ))}
    </ul>
  )
}


export default ActiveCollaborators