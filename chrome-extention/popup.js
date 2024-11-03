document.addEventListener("DOMContentLoaded", async () => {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const tabId = currentTab.id;

  const outputElement = document.getElementById("output");
  if (outputElement) {
    const { tabOutputs = {} } = await chrome.storage.local.get("tabOutputs");
    if (tabOutputs[tabId]) {
      outputElement.innerHTML = tabOutputs[tabId];
    } else {
      outputElement.innerHTML = "";
    }
  }

  const generateThreadButton = document.getElementById("generateThread");

  if (generateThreadButton) {
    generateThreadButton.addEventListener("click", async () => {
      try {
        console.log("Generate Thread button clicked");

        // Add loading state
        const outputElement = document.getElementById("output");
        outputElement.innerHTML = "Generating thread...";
        outputElement.classList.add("loading");
        generateThreadButton.disabled = true;

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab) {
          throw new Error("No active tab found");
        }

        // Try to inject content script if it's not already there
        await injectContentScriptIfNeeded(tab.id);

        // Add a small delay to ensure content script is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
          const response = await new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(
              tab.id,
              { action: "getPageContent" },
              (response) => {
                if (chrome.runtime.lastError) {
                  reject(new Error("Please refresh the page and try again."));
                } else {
                  resolve(response);
                }
              }
            );
          });

          if (response?.content) {
            console.log("Content extracted from page:", response.content);
            await generateTwitterThread(response.content);
          } else {
            throw new Error("No content received. Please refresh the page and try again.");
          }
        } catch (messageError) {
          throw new Error("Unable to access page content. Please refresh the page and try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        const outputElement = document.getElementById("output");
        if (outputElement) {
          const errorHtml = `<div class="error">Error: ${error.message}</div>`;
          outputElement.innerHTML = errorHtml;

          // Save error to storage
          const tabId = currentTab.id;
          const { tabOutputs = {} } = await chrome.storage.local.get(
            "tabOutputs"
          );
          tabOutputs[tabId] = errorHtml;
          await chrome.storage.local.set({ tabOutputs });
        }
      } finally {
        const outputElement = document.getElementById("output");
        outputElement.classList.remove("loading");
        generateThreadButton.disabled = false;
      }
    });
  } else {
    console.error("Generate Thread button not found.");
  }
});

async function generateTwitterThread(content) {
  try {
    console.log("Sending content to server for processing:", content);
    const outputElement = document.getElementById("output");
    if (!outputElement) {
      throw new Error("Output element not found");
    }

    const response = await fetch("http://localhost:8000/generate_thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Server response error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Received thread from server:", result.thread);
    const threadHtml = result.thread
      .map((tweet) => `<div class="tweet">${tweet}</div>`)
      .join("");

    // Save the thread to storage before displaying
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = currentTab.id;
    const { tabOutputs = {} } = await chrome.storage.local.get("tabOutputs");
    tabOutputs[tabId] = threadHtml;
    await chrome.storage.local.set({ tabOutputs });

    outputElement.innerHTML = threadHtml;
  } catch (error) {
    console.error("Error generating Twitter thread:", error);
    throw error; // Let the main error handler deal with it
  }
}

async function injectContentScriptIfNeeded(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
  } catch (error) {
    console.log('Content script already exists or cannot be injected');
  }
}
