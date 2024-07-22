import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* This is a TypeScript/React functional component named `UserTypeSelector`. It takes in three props: `userType`, `setUserType`, and `onClickHandler`. 

The `accessChangeHandler` function is defined within the component. It takes in a `type` parameter of type `UserType` and calls the `setUserType` function with the `type` parameter,
and if `onClickHandler` is defined, it also calls `onClickHandler` with the `type` parameter.

The component returns a `Select` component from a UI library. The `value` prop of the `Select` component is set to the `userType` prop, and the `onValueChange` prop is set to the `accessChangeHandler` function.

Inside the `Select` component, there is a `SelectTrigger` component with a `className` of "shad-select". Inside the `SelectTrigger`, there is a `SelectValue` component.

Below the `SelectTrigger`, there is a `SelectContent` component with a `className` of "border-none bg-dark-200". Inside the `SelectContent`, there are two `SelectItem` components.
The first `SelectItem` has a `value` of "viewer" and displays "can view".
The second `SelectItem` has a `value` of "editor" and displays "can edit". */
const UserTypeSelector = ({ userType, setUserType, onClickHandler }: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onClickHandler && onClickHandler(type);
  }

  return (
    <Select value={userType} onValueChange={(type: UserType) => accessChangeHandler(type)}>
      <SelectTrigger className="shad-select">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200">
        <SelectItem value="viewer" className="shad-select-item">can view</SelectItem>
        <SelectItem value="editor" className="shad-select-item">can edit</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default UserTypeSelector