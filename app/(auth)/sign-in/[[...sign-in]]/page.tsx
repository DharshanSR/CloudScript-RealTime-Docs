// Import the SignIn component from the @clerk/nextjs package
import { SignIn } from '@clerk/nextjs'

// Define a functional component called SignInPage
const SignInPage = () => {
  return (
    // Return a main element with a class of "auth-page"
    <main className="auth-page">
      {/* Render the SignIn component from @clerk/nextjs */}
      <SignIn />
    </main>
  )
}

// Export the SignInPage component as the default export of this module
export default SignInPage
