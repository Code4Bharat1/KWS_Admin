# KWS Frontend Documentation

## Overview
The frontend of the **KWS (Kokan Welfare Society)** project is a highly responsive, scalable, and modern web application. Built with **Next.js 15** and styled with **Tailwind CSS 3.4.1**, it incorporates advanced features such as QR code scanning, PDF management, and robust data visualization to enhance user experience.

---

## Features

### Core Features
- **Dynamic User Interface**: Built with Next.js' App Router for server-side rendering and improved performance.
- **Modern Styling**: Styled with Tailwind CSS and enhanced with Material UI for pre-designed components.
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens.

### Advanced Capabilities
1. **QR Code Functionality**:
   - Generate QR codes using `qrcode.react`.
   - Scan QR codes with `react-qr-scanner` and `react-qr-reader`.
   - Decode QR codes using ZXing library.

2. **PDF Management**:
   - Render and interact with PDFs using `react-pdf` and `pdfjs-dist`.
   - Advanced layout support for PDFs via `@react-pdf-viewer/default-layout`.

3. **Form Handling**:
   - Intuitive forms with `react-hook-form` and `@hookform/resolvers`.
   - Schema-based validation using `yup`.

4. **Data Visualization**:
   - Dynamic charts with `chart.js` and `react-chartjs-2`.

5. **Data Export/Import**:
   - Export data as CSV files using `react-csv`.

6. **Date and Time Utilities**:
   - Manipulate dates effortlessly with `date-fns`.

7. **Environment Management**:
   - Secure environment variables using `dotenv`.

---

## Prerequisites
Ensure the following are installed on your system:
- **Node.js**: Version 18.x or later.
- **NPM**: Version 7.x or later.

---

## Next.js Basics for New Users

Next.js is a React framework that enables fast, server-rendered websites and static websites. It allows you to build **single-page applications (SPAs)** with improved performance, SEO, and scalability. Here's a brief guide on the basics of Next.js and how it powers the **KWS Frontend**.

### Key Features of Next.js

1. **App Router**:
   - Next.js uses the **App Router** to handle server-side rendering and navigation within the application.
   - The **App Router** simplifies routing by automatically linking files from the `app/` directory to specific routes.
   - For example:
     - `app/page.jsx` will render the homepage (`/`).
     - `app/about/page.jsx` will render the `/about` page.
   
2. **Server-Side Rendering (SSR)**:
   - Next.js pre-renders pages on the server to ensure better performance and SEO.


3. **Client-Side Navigation**:
   - Next.js uses **React’s client-side routing** to enable fast navigation between pages without a full page reload, improving user experience.

### How Next.js is Structured in the KWS Frontend

The **KWS Frontend** makes extensive use of **Next.js' App Router** for routing and navigation. Here’s a breakdown of how the app is structured:

- **App Router**: All pages are handled by the `app/` directory. The routing is automatically linked to the file names within this folder.
- **Components**: All reusable components (e.g., buttons, headers, forms) are stored in the `components/` folder. These components can be imported into various pages within the app.
- **Navigation**: The **Next Navigation** library is used for navigating between pages without full reloads, providing a seamless experience.

### Example of Basic Routing

Here’s how the routing works in a typical Next.js application using the App Router:

- **File**: `app/page.jsx`
  - This corresponds to the root route (`/`).
- **File**: `app/about/page.jsx`
  - This corresponds to the `/about` route.

In the **KWS Frontend**, you can find the app structure as follows:

- **`app/`**: Contains all the pages and the routing logic for the application.
- **`components/`**: Reusable components such as headers, footers, buttons, etc.
  
Each page inside the `app/` directory automatically maps to a specific route based on the file name. This structure is simple and easy to navigate for both developers and users.

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/kws-frontend.git
cd kws-frontend


2. Install Dependencies
bash
Copy
npm install --legacy-peer-deps  or  npm install --force


3. Start Development Server
bash
Copy
npm run dev
Visit http://localhost:3000 in your browser.



4. Build for Production
bash
Copy
npm run build



5. Start the Production Server
bash
Copy
npm run start


Folder Structure

kws-frontend/
├── public/                # Static assets (images, videos, pdf, etc.)
├── src/
│   ├── app/               # App Router pages (all route logic is here)
│   ├── components/        # Reusable React components            
├── .env.local             # Environment variables
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
└── package.json           # Project metadata and dependencies


Scripts
Command	Description
npm run dev	Starts the development server
npm run build	Builds the application for production
npm run start	Runs the application in production mode
npm run lint	Runs ESLint to analyze and fix code issues




This should now be a comprehensive README for both new users and contributors! 


Developers: Sanad Naqvi , Juned khan and Team.