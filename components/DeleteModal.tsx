"use client";

import Image from "next/image";
import { useState } from "react";

import { deleteDocument } from "@/lib/actions/room.actions";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

/**
 * DeleteModal component is a modal that allows users to delete a document.
 * 
 * It takes a single prop, `roomId`, which is the ID of the document to be deleted.
 * 
 * The DeleteModal component uses two state variables: `open` and `loading`.
 * 
 * - `open` is a boolean that determines whether the modal is open or closed.
 * - `loading` is a boolean that determines whether the deletion process is in progress.
 * 
 * The `deleteDocumentHandler` function is the event handler for the delete button.
 * It sets the `loading` state to true to indicate that the deletion process has started.
 * It then attempts to delete the document using the `deleteDocument` function from the
 * actions/room.actions file. If the deletion is successful, it closes the modal by setting
 * the `open` state to false. If the deletion fails, it logs the error message to the console.
 * Finally, it sets the `loading` state to false to indicate that the deletion process has ended.
 */
export const DeleteModal = ({ roomId }: DeleteModalProps) => {
  // State variables
  const [open, setOpen] = useState(false); // Determines whether the modal is open or closed
  const [loading, setLoading] = useState(false); // Determines whether the deletion process is in progress

  /**
   * This function handles the deletion of a document.
   * It takes no parameters and returns no value.
   */
  const deleteDocumentHandler = async () => {
    // Set the loading state to true to indicate that the deletion process is in progress
    setLoading(true);

    try {
      // Attempt to delete the document
      await deleteDocument(roomId);

      // If the deletion is successful, close the modal
      setOpen(false);
    } catch (error) {
      // If the deletion fails, log the error message to the console
      console.log("Error notif:", error);
    }

    // Set the loading state to false to indicate that the deletion process is complete
    setLoading(false);
  };

  return (
    // Dialog component for the modal
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Dialog trigger for opening the modal */}
      <DialogTrigger asChild>
        <Button className="min-w-9 rounded-xl bg-transparent p-2 transition-all">
          {/* Delete icon */}
          <Image
            src="/assets/icons/delete.svg"
            alt="delete"
            width={20}
            height={20}
            className="mt-1"
          />
        </Button>
      </DialogTrigger>
      {/* Content of the modal */}
      <DialogContent className="shad-dialog">
        <DialogHeader>
          {/* Delete modal icon */}
          <Image
            src="/assets/icons/delete-modal.svg"
            alt="delete"
            width={48}
            height={48}
            className="mb-4"
          />
          {/* Title of the modal */}
          <DialogTitle>Delete document</DialogTitle>
          {/* Description of the modal */}
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          {/* Cancel button */}
          <DialogClose asChild className="w-full bg-dark-400 text-white">
            Cancel
          </DialogClose>

          {/* Delete button */}
          <Button
            variant="destructive"
            onClick={deleteDocumentHandler}
            className="gradient-red w-full"
          >
            {/* Text and loading state of the delete button */}
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
