chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { tabOutputs = {} } = await chrome.storage.local.get('tabOutputs');
  if (tabOutputs[tabId]) {
    delete tabOutputs[tabId];
    await chrome.storage.local.set({ tabOutputs });
  }
});
