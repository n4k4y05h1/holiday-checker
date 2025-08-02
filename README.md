# Holiday Checker App

This project is a React application built with Vite and TypeScript. It allows users to check public holidays for various countries, displaying information for today, tomorrow, and the next upcoming holiday.

## Demo

Visit the live application: https://holiday-checker.pages.dev/

## Features

*   **Holiday Information:** Displays whether today or tomorrow is a weekday, weekend, or a public holiday.
*   **Next Holiday:** Shows the date and name of the next upcoming public holiday.
*   **Multi-country Support:** Fetches holiday data for several countries (Japan, USA, UK, France, Germany, Italy, Canada, Australia, Philippines) using the [Nager.Date API](https://date.nager.at/).
*   **Multi-language Support:** User interface is available in English and Japanese.

## Development Setup

To set up the project for development, follow these steps:

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone <repository-url>
    cd holiday-checker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the development server and open the application in your browser (usually at `http://localhost:5173/`). Any changes you make to the source code will trigger a hot reload.

## Running in Production

To build the application for production and serve it, follow these steps:

1.  **Build the application:**

    ```bash
    npm run build
    ```

    This command bundles the application into static files in the `dist` directory, optimized for production.

2.  **Serve the production build:**

    **Important:** The built application must be served by a web server. Directly opening `dist/index.html` from the file system (`file://` protocol) will likely cause issues with asset loading due to browser security restrictions (e.g., "Provisional headers are shown" errors).

    You can use a simple static file server like `serve` (install globally if you haven't already: `npm install -g serve`):

    ```bash
    serve -s dist
    ```

    This will serve the application at `http://localhost:3000` (or another available port).

    Alternatively, you can deploy the contents of the `dist` directory to any static hosting service (e.g., Netlify, Vercel, Cloudflare Pages/Workers, GitHub Pages).
