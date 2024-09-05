
# CloudScript-Docs

**CloudScript-Docs** is a sophisticated real-time document editor, designed as an advanced clone of Google Docs. This application is built with **[Next.js](https://nextjs.org/)** and **[TypeScript](https://www.typescriptlang.org/)**, ensuring a robust and type-safe foundation. It integrates **[Clerk](https://clerk.dev/)** for secure user authentication and session management, **[Liveblocks](https://liveblocks.io/)** for seamless real-time collaboration, and **[Lexical Editor](https://lexical.dev/)** for a dynamic text editing experience. The user interface is styled with **[Tailwind CSS](https://tailwindcss.com/)** for a responsive and modern look, while **[Sentry](https://sentry.io/)** is utilized for comprehensive application and performance monitoring.

## Key Features

👉 **Authentication**: Implemented secure user sign-in and session management with Clerk, offering a reliable and streamlined authentication process.

👉 **Collaborative Text Editor**: Supports simultaneous document editing by multiple users with real-time updates, facilitated by Liveblocks.

👉 **Document Management**:
- **Create Documents**: Users can effortlessly create and save new documents.
- **Delete Documents**: Provides functionality to manage and remove documents as needed.
- **Share Documents**: Allows sharing of documents through email or link with customizable permissions.
- **List Documents**: Enables users to view, search, and manage all documents owned or shared with them.

👉 **Comments**: Supports inline and general comments with threading for interactive discussions.

👉 **Active Collaborators**: Shows real-time presence indicators to highlight users currently editing the document.

👉 **Notifications**: Keeps users informed of document shares, new comments, and collaborator activities.

👉 **Responsive Design**: Ensures an optimal user experience across all devices.

---

## 🛠️ Tech Stack

This project utilizes cutting-edge technologies and tools to deliver a seamless experience:

- **[Next.js](https://nextjs.org/)**: Framework for server-side rendering and static site generation.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language for scalable development.
- **[Liveblocks](https://liveblocks.io/)**: Real-time collaboration and presence management.
- **[Lexical Editor](https://lexical.dev/)**: Advanced text editor for rich document editing.
- **[ShadCN](https://shadcn.dev/)**: Utility-first component library for building interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for responsive design.
- **[Sentry](https://sentry.io/)**: Error and performance monitoring to improve reliability.
- **[Clerk](https://clerk.dev/)**: Authentication solution for secure user management.

To work effectively with this project, it’s beneficial to have familiarity with the following:
- **React.js**
- **CSS (Tailwind CSS is used for styling)**
- **Next.js**
- **TypeScript**

**CloudScript-Docs** exemplifies my proficiency in developing real-time collaborative applications, showcasing my ability to build scalable and user-centric interfaces. The project mirrors the functionality of Google Docs while incorporating advanced features and a polished design.

---

## 🛠️ Getting Started

Follow the steps below to set up and run **CloudScript-Docs** locally:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/CloudScript-Docs.git
   cd CloudScript-Docs
   ```

2. Install dependencies:

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

   Or using pnpm:

   ```bash
   pnpm install
   ```

3. Configure environment variables:

   Copy the `.env.example` file and rename it to `.env`, then add your configuration values.

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   Or using pnpm:

   ```bash
   pnpm dev
   ```

   Or using bun:

   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

### Project Structure

You can start editing the main page by modifying the file `app/page.tsx`. Any changes you make will automatically update in the browser.

This project also uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to optimize and load Inter, a custom Google Font.

---

## 📚 Learn More

To learn more about **Next.js**, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and APIs.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

You can also check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) for further exploration and to contribute your feedback!

## 🚀 Deploy on Vercel

The easiest way to deploy this application is by using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

For detailed instructions, visit the official [Next.js deployment documentation](https://nextjs.org/docs/deployment).
