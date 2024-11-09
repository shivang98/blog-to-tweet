# Twitter Thread Generator Chrome Extension

A Chrome extension that automatically generates Twitter threads from webpage content using ChatGPT and LangChain. This tool helps content creators quickly transform web articles into engaging Twitter threads while maintaining the core message and staying within Twitter's character limits.

## Features

- One-click thread generation from any webpage
- Automatic content extraction
- Smart tweet splitting to respect Twitter's 280-character limit
- Persistent thread storage across browser sessions
- Clean, modern UI with loading states and error handling
- Removes promotional content and maintains readability

## Installation Guide

### Prerequisites

1. Python 3.7+ installed on your system
2. An OpenAI API key
3. Google Chrome browser

### Server Setup

1. Clone this repository
```
bash
git clone [repository-url]
cd [repository-name]
```
2. Install required Python packages
```
pip install flask langchain openai
```
3. Set up your OpenAI API key as an environment variable
```
export OPENAI_API_KEY='your-api-key-here'
```
4. Start the Flask server
```
python server.py
```


### Chrome Extension Setup

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `chrome-extension` folder from this repository

## Usage

1. Navigate to any webpage you want to convert into a Twitter thread
2. Click the extension icon in your Chrome toolbar
3. Click the "Generate Thread" button
4. Wait for the thread to be generated
5. The generated thread will appear in the popup window

## Development Notes

- The server runs on `localhost:8000`
- The extension uses Chrome's storage API to persist generated threads
- Content script injection is handled automatically
- Error handling is implemented for both client and server-side issues

## Troubleshooting

If you encounter any issues:

1. Ensure the Flask server is running
2. Check that your OpenAI API key is valid and properly set
3. Try refreshing the webpage
4. Check the browser console for any error messages

## Technical Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Python, Flask
- AI: OpenAI GPT-4, LangChain
- Browser API: Chrome Extension API

## Known Limitations

- Requires an active internet connection
- Needs a running local server
- May not work perfectly on all webpage layouts
- Rate limited by OpenAI API quotas

## Contributing

Feel free to submit issues and enhancement requests!
