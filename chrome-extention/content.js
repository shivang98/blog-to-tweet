// Function to get the page content
function getPageContent() {
  return document.body.innerText;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    const content = getPageContent();
    console.log("Extracted page content:", content); // Log page content for verification
    sendResponse({ content: content });
  }
});
