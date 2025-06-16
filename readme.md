Was able to get a deployment to: https://asls.filmwhisper.dev/ --- No sports are playing right now, so I'm not sure if it works.

**Disclaimer:** This addon is a test project, and its creator is not responsible for its use. The user is solely responsible for the content accessed and for complying with copyright laws.

---

## Installation Video Tutorial & Easy Installer

Having trouble installing this addon? I've created a **step-by-step video tutorial** and an **installer (.bat file)** to simplify the process.






https://github.com/user-attachments/assets/4013acab-c5c4-4bba-9403-7419817a5da2




For a simpler installation, you can use the **INSTALLER.bat** available in the [releases section](https://github.com/WebStaticCS/Addon-Sport-Live-Stremio/releases/tag/v1.0).

---

# Sports Live Stremio Addon

This Stremio addon allows you to watch live, upcoming, and finished sports events, fetching information from a JSON source and providing streams from various providers.

### Requirements

-   Node.js (v14+ recommended)

-   npm (included with Node.js)

### Installation

1.  **Clone:**

    ```
    git clone [https://github.com/WebStaticCS/Addon-Sport-Live-Stremio](https://github.com/WebStaticCS/Addon-Sport-Live-Stremio)
    cd Addon-Sport-Live-Stremio
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

### Configuration (config.js)

Open config.js and adjust these variables. You can use environment variables for production.

-   ADDON_PORT: Port where the addon will run (default: 7000).

-   IMAGE_GENERATOR_BASE_URL: URL of your image generation server. Required for dynamic posters. Deploy from:
    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FWebStaticCS%2FImage-Generator.git&project-name=image-generator&repo-name=Image-Generator)

    Use your Vercel deployment URL (e.g., https://your-generator.vercel.app/api/generate-image).

-   TIMEZONE_OFFSET_HOURS: UTC offset for displaying event times (default: -5).
-   Note: You can add more event images to poster_data.js if needed

### Running the Addon

1.  **Start:**

    ```
    node app.js
    ```

2.  The console will show the installation URL (e.g., http://127.0.0.1:7000/manifest.json). Paste it into Stremio > Addons > Install Addon.

### Important Notes

-   Streams: Playback issues are usually due to CORS.

-   Cache: If changes don't appear, clear the addon cache in Stremio or reinstall the addon.

-   Environment Variables: For production deployment (e.g., Vercel), use environment variables for configurations.
