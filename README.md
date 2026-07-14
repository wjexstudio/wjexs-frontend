# WJEXSTUDIO OS - Frontend

This is the Next.js frontend for **WJEXSTUDIO OS**, representing the unified "App" and "Dashboard" tier. 
It replaces the older Go-based frontend to provide a rich, interactive, Glassmorphism-style UI.

## Technologies Used
- Next.js 15+ (App Router)
- React 19
- Tailwind CSS
- NextAuth.js (Auth.js) / Google OAuth
- Lucide React & Boxicons

## Project Structure
- `src/app`: Contains all Next.js pages (Home, Dashboard, Quests, Skills, Gates, etc.).
- `src/components`: UI components like Sidebar, Navbar, and layout wrappers.
- `src/auth.ts`: Configuration for NextAuth Google Provider and Admin whitelisting.

## Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   AUTH_SECRET=your_secret
   AUTH_GOOGLE_ID=your_google_id
   AUTH_GOOGLE_SECRET=your_google_secret
   ADMIN_EMAILS=your_email@gmail.com
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment
This app is designed to be easily deployed on **Vercel**. Ensure all environment variables are correctly mapped in your Vercel project settings.

## Integration
This frontend connects to the **WJEXSTUDIO Backend API** (running on Node.js/Express) which serves files and handles logic from the `knowledge-base` local files.
