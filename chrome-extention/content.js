// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    // Get the page content (modify this according to your needs)
    const content = document.body.innerText;
    sendResponse({ content });
  }
  return true; // Required for async response
});
