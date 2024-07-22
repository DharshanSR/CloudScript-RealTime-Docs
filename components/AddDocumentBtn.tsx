'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

/**
 * This component renders a button that allows the user to create a new document.
 * When the button is clicked, it calls the `createDocument` function with the
 * `userId` and `email` props, and then redirects the user to the newly created
 * document's route.
 */
const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  /**
   * Get the `router` object from `next/navigation` so that we can use it to
   * redirect the user to the newly created document.
   */
  const router = useRouter();

  /**
   * This function is called when the button is clicked. It creates a new document
   * using the `createDocument` function, and then redirects the user to the newly
   * created document's route.
   */
  const addDocumentHandler = async () => {
    try {
      /**
       * Call the `createDocument` function with the `userId` and `email` props.
       * This function returns a promise that resolves with the newly created
       * document's metadata.
       */
      const room = await createDocument({ userId, email });

      /**
       * If the document was successfully created, redirect the user to the newly
       * created document's route.
       */
      if(room) router.push(`/documents/${room.id}`);
    } catch (error) {
      /**
       * If there was an error creating the document, log the error to the console.
       */
      console.log(error)
    }
  }

  /**
   * Return a button component that calls the `addDocumentHandler` function when
   * clicked.
   */
  return (
    <Button type="submit" onClick={addDocumentHandler} className="gradient-blue flex gap-1 shadow-md">
      <Image 
        src="/assets/icons/add.svg" alt="add" width={24} height={24}
      />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  )
}

export default AddDocumentBtn