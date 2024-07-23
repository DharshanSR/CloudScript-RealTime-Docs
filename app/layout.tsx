// Import the Inter font from Google Fonts using next/font
import { Inter as FontSans } from "next/font/google";

// Import utility functions and global styles
import { cn } from "@/lib/utils";
import './globals.css';

// Import necessary components and configurations from Next.js and Clerk
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./Provider";

// Configure the Inter font with specific subsets and a custom CSS variable
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Define metadata for the application
export const metadata: Metadata = {
  title: 'CloudScript-Docs',
  description: 'Your go-to collaborative editor',
}

// Define the RootLayout component that wraps the entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Configure the ClerkProvider with a dark theme and custom variables
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { 
          colorPrimary: "#3371FF",
          fontSize: '16px'
        },
      }}
    >
      {/* Define the HTML structure with language and hydration settings */}
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen font-sans antialiased", // Apply minimum height, font, and antialiasing styles
            fontSans.variable // Include the custom font variable
          )}
        >
          {/* Wrap children components with the custom Provider */}
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
