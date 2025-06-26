# Emel TV - Tizen Stream Player

A simple and robust Tizen web application designed to play a full-screen HLS video stream on Samsung Smart TVs. This project serves as a lightweight template for TV-based streaming applications, incorporating essential lifecycle management and common troubleshooting fixes.

## Features

- Plays a specified HLS (.m3u8) stream upon launch.
- Full-screen video playback.
- Handles basic remote control events (Play, Pause, Return/Exit).
- Correctly manages the application lifecycle (pausing on hide, cleaning up on exit) to prevent resource allocation errors on the TV.
- Includes necessary fixes for common Tizen development issues like the "black screen with audio" problem.

## Tech Stack

- **HTML5**: For the basic application structure.
- **CSS3**: For styling the player container.
- **JavaScript (ES6+)**: For all application logic.
- **Tizen Web API**: Specifically `webapis.avplay` for media playback and `tizen.application` for app control.

## Project Structure

The project follows a standard Tizen web application structure. Key source files include:

```
├── css/
│   └── style.css       # Styles for the player object and body
├── config.xml          # Tizen application configuration, privileges, and metadata
├── icon.png            # Application icon
├── index.html          # Entry point of the application
└── main.js             # Main application logic
```

## Setup and Installation

To run this application, you will need [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download) installed and configured for TV development.

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    ```

2.  **Import Project:**

    - Open Tizen Studio.
    - Go to `File > Import...`.
    - Select `Tizen > Tizen Project` and navigate to the cloned repository folder.
    - Import the project.

3.  **Build the Project:**

    - Right-click the project in the Project Explorer.
    - Select `Build Project`. This will generate a `.wgt` (widget) file.

4.  **Run on a Device:**
    - Connect your Samsung TV to Tizen Studio via the Device Manager.
    - Right-click the project.
    - Select `Run As > Tizen Web Application`.
    - Ensure your TV is selected as the target. The application will be installed and launched on the TV.

## Configuration

To change the video stream, edit the `STREAM_URL` constant in `main.js`:

```javascript
// main.js

// The URL of the HLS stream to be played.
const STREAM_URL = "https://your-new-stream-url.m3u8";
```
