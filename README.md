# Pictlify

Pictlify is a social media application built with React, TypeScript, and Vite. It allows users to create, share, and interact with posts. The application uses Appwrite for backend services, including authentication, database, and storage.

This project is an educational practice to learn and improve web development skills.

## Features

- User authentication (sign up, sign in, sign out)
- Create, update, and delete posts
- Like and save posts
- View user profiles and follow users
- Search for posts by tags
- Responsive design with Tailwind CSS

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/pictlify.git
cd pictlify
```

2. Install dependencies:

```sh
npm install
```

3. Create a `.env.local` file in the root of the project and configure the necessary environment variables for Appwrite:

```env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_URL=your_appwrite_url
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_STORAGE_ID=your_storage_id
VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
VITE_APPWRITE_POST_COLLECTION_ID=your_post_collection_id
VITE_APPWRITE_SAVES_COLLECTION_ID=your_saves_collection_id
```

4. Start the development server:

```sh
npm run dev
```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for linting errors.
- `npm run preview`: Previews the production build.

## Project Structure

```plaintext
.env.local
.gitignore
components.json
eslint.config.js
index.html
package.json
postcss.config.js
public/
  assets/
    icons/
    images/
README.md
src/
  _auth/
    AuthLayout.tsx
    forms/
  _root/
    pages/
    RootLayout.tsx
  App.tsx
  components/
    forms/
    shared/
    ui/
  constants/
    index.ts
  context/
    AuthContext.tsx
  globals.css
  hooks/
    use-toast.ts
    useDebounce.ts
  lib/
    ...
  main.tsx
  types/
  vite-env.d.ts
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## Contributions

Contributions are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.