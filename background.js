chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url.includes("udemy.com/course/")) return;

  // chạy script trong tab hiện tại
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});
