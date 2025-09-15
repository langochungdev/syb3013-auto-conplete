document.getElementById("part1").addEventListener("click", () => {
  runPart("part1");
});

document.getElementById("part2").addEventListener("click", () => {
  runPart("part2");
});

function runPart(part) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (chosenPart) => {
        window.__udemyPart = chosenPart; // gắn biến global để content.js đọc
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("content.js");
        document.body.appendChild(script);
      },
      args: [part] // dùng được vì ở đây là func
    });
  });
}
