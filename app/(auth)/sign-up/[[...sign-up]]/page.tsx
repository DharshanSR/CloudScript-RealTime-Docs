// Import the SignUp component from the @clerk/nextjs package
import { SignUp } from '@clerk/nextjs'

// Define a functional component called SignUpPage
const SignUpPage = () => {
  return (
    // Return a main element with a class of "auth-page"
    <main className="auth-page bg-[url('/assets/images/signin-singup.jpg')] bg-cover bg-center h-screen">
      {/* Render the SignUp component from @clerk/nextjs */}
      <SignUp />
    </main>
  )
}

// Export the SignUpPage component as the default export of this module
export default SignUpPage
