document.addEventListener("DOMContentLoaded", () => {
  const generateThreadButton = document.getElementById("generateThread");

  if (generateThreadButton) {
    generateThreadButton.addEventListener("click", async () => {
      try {
        console.log("Generate Thread button clicked");

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab) {
          throw new Error("No active tab found");
        }

        const response = await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(
            tab.id,
            { action: "getPageContent" },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(response);
              }
            }
          );
        });

        if (response && response.content) {
          console.log("Content extracted from page:", response.content);
          await generateTwitterThread(response.content);
        } else {
          throw new Error("No content received from content script.");
        }
      } catch (error) {
        console.error("Error:", error);
        const outputElement = document.getElementById("output");
        if (outputElement) {
          outputElement.innerText = `Error: ${error.message}`;
        }
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
    outputElement.innerText = result.thread.join("\n\n");
  } catch (error) {
    console.error("Error generating Twitter thread:", error);
    // Display error to user
    const outputElement = document.getElementById("output");
    if (outputElement) {
      outputElement.innerText = `Error: ${error.message}`;
    }
  }
}
