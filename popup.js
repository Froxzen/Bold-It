document.addEventListener('DOMContentLoaded', () => {
    const toggleBoldButton = document.getElementById('toggleBold');

    toggleBoldButton.addEventListener('click', () => {
        chrome.storage.local.get('isBoldEnabled', (data) => {
            let isBoldEnabled = data.isBoldEnabled === true;
            isBoldEnabled = !isBoldEnabled;
            
            chrome.storage.local.set({ isBoldEnabled });
            sendMessageToContentScript(isBoldEnabled);
            updateButtonText(isBoldEnabled);
        });
    });

    function updateButtonText(isBoldEnabled) {
        if (isBoldEnabled) {
            toggleBoldButton.textContent = "Disable";
        } else {
            toggleBoldButton.textContent = "Enable";
        }
    }

    function sendMessageToContentScript(isBoldEnabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (isBoldEnabled) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'enableBold' });
            } else {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'disableBold' });
            }
        });
    }
});
