/**
 * @file Main application logic for the Emel TV Tizen Web App.
 * @author Your Name
 * @version 1.0.0
 */

// Use an Immediately Invoked Function Expression (IIFE) to avoid polluting the global scope.
(function() {
    'use strict';

    // The URL of the HLS stream to be played.
    // I have set it back to your original stream. The test stream is kept here for easy debugging.
    const STREAM_URL = 'https://emelplayout.ddnsguru.com/live/tv_emel_test101.m3u8';
    // const TEST_STREAM_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    /**
     * Initializes the application, sets up listeners, and starts playback.
     */
    function init() {
        console.log('Application initialized.');

        // Set up listeners for remote control keys and application lifecycle events.
        registerKeys();
        document.addEventListener('visibilitychange', onVisibilityChange);

        // Create the <object> element that will host the AVPlay instance.
        createPlayerObject();
        
        // CRITICAL: A short delay before starting playback.
        // This prevents a race condition where the player tries to open before the
        // <object> element is fully ready in the DOM.
        setTimeout(startPlayback, 100);
    }

    /**
     * Creates the AVPlay <object> element and appends it to the player container.
     */
    function createPlayerObject() {
        const container = document.getElementById('player-container');
        const avPlayer = document.createElement('object');
        avPlayer.type = 'application/avplayer';
        container.appendChild(avPlayer);
        console.log('Player object created and appended to DOM.');
    }

    /**
     * Configures and starts the media playback using the AVPlay API.
     */
    function startPlayback() {
        console.log('Attempting to start playback for URL:', STREAM_URL);
        try {
            // Define listeners for various player events.
            const avPlayerListener = {
                onbufferingstart: () => console.log('Buffering started...'),
                onbufferingcomplete: () => console.log('Buffering complete.'),
                onstreamcompleted: () => {
                    console.log('Stream completed.');
                    cleanupPlayer(); // Clean up when the stream ends.
                },
                onerror: (err) => console.error('Player error:', JSON.stringify(err))
                // For detailed debugging, you can uncomment the following line:
                // oncurrentplaytime: (time) => console.log('Current time: ' + time),
            };

            webapis.avplay.open(STREAM_URL);
            webapis.avplay.setListener(avPlayerListener);

            // Set the display area to full screen (standard Full HD resolution).
            // Using a fixed resolution is more reliable at startup than window.innerWidth/Height.
            webapis.avplay.setDisplayRect(0, 0, 1920, 1080);

            webapis.avplay.prepareAsync(() => {
                console.log('Prepare complete. Starting playback.');
                webapis.avplay.play();
            }, (err) => {
                console.error('Prepare async error:', JSON.stringify(err));
            });
        } catch (e) {
            console.error('Error in startPlayback:', e.message);
        }
    }

    /**
     * Gracefully stops and closes the AVPlay instance to release hardware resources.
     */
    function cleanupPlayer() {
        console.log('Cleaning up player...');
        const state = webapis.avplay.getState();
        if (state !== 'IDLE' && state !== 'NONE') {
            try {
                webapis.avplay.stop();
                // close() is essential to deallocate the player resource.
                webapis.avplay.close();
                console.log('Player closed successfully.');
            } catch (e) {
                console.error('Error during player cleanup:', e.message);
            }
        } else {
            console.log('Player was already in a cleaned-up state.');
        }
    }

    /**
     * Handles key events from the remote control.
     */
    function registerKeys() {
        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 10009: // Return/Back key
                    cleanupPlayer();
                    tizen.application.getCurrentApplication().exit();
                    break;
                case 415:   // Play key
                case 10252: // Play/Pause key (Samsung specific)
                    const state = webapis.avplay.getState();
                    if (state === 'PAUSED') {
                        webapis.avplay.play();
                    }
                    break;
                case 19:    // Pause key
                    webapis.avplay.pause();
                    break;
                case 413:   // Stop key
                    cleanupPlayer();
                    break;
            }
        });
    }

    /**
     * Handles application visibility changes (e.g., user presses Home key).
     */
    function onVisibilityChange() {
        if (document.hidden) {
            // App is now hidden, release player resources.
            console.log('Application is now hidden. Cleaning up player.');
            cleanupPlayer();
        } else {
            // App is visible again, restart playback.
            console.log('Application is now visible. Restarting playback.');
            startPlayback();
        }
    }

    // Register the 'init' function to run when the page is fully loaded.
    window.onload = init;

})();