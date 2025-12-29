# LLM Copy Block

**LLM Copy Block** is a Chrome extension designed to prevent text selection and copying on major Large Language Model (LLM) websites. It is intended for educational or self-discipline purposes to encourage manual typing over copy-pasting code or text.

## Features

* **🚫 Disable Text Selection:** Prevents highlighting text using the mouse or keyboard shortcuts.
* **✂️ Block Copy/Cut:** Intercepts and blocks clipboard events (`Ctrl+C`, `Ctrl+X`, Right-click > Copy).
* **🙈 Hide Copy Buttons:** Automatically detects and hides "Copy" buttons in chat interfaces (supporting ChatGPT, Claude, and Gemini) using DOM mutation observers.
* **⏸️ Temporary Pause:** Includes a popup interface to pause the blocking behavior for **1 minute**, allowing for quick, necessary copies without disabling the entire extension.

## Supported Websites

The extension is currently configured to target:
* ChatGPT (`chatgpt.com`)
* Claude (`claude.ai`)
* Google Gemini (`gemini.google.com`)

## Installation

Since this is a custom extension, you must install it in "Developer Mode":

1.  **Clone or Download** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder containing the `manifest.json` file.
6.  (Optional) Pin the extension to your toolbar for easy access to the Pause button.

## Usage

* **Active Mode:** By default, whenever you visit a supported LLM site, text selection and copying are disabled.
* **Pausing:**
    1.  Click the "LLM Copy Block" extension icon in the toolbar.
    2.  Click the **"Pause (1 min)"** button.
    3.  The protection will be lifted for 60 seconds. A countdown will appear in the popup.
    4.  Once the timer expires, blocking automatically resumes.

## Directory Structure

```text
llm-copy-block/
├── icons/              # Contains extension icons (e.g., icon128.png)
├── content.js          # Logic for blocking events and hiding buttons
├── manifest.json       # Extension configuration and permissions
├── popup.html          # HTML for the popup interface
└── popup.js            # Logic for the pause timer
