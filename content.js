let isProcessing = false;

function boldFirstHalfOfWords() {
    if (isProcessing) return;
    isProcessing = true;

    const skipTags = [
        "style", "script", "code", "pre", "strong", "b", "em", "i", "u", "a",
        "svg", "img", "textarea", "input", "iframe", "button", "select",
        "option", "noscript", "canvas", "object", "embed", "video", "audio"
    ];

    function processTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE') {
            const words = node.textContent.split(/(\s+)/);
            const modifiedWords = words.map(word => {
                if (word.trim().length === 0 || !isNaN(word)) {
                    return word;
                }
                const midIndex = Math.floor(word.length / 2);
                const firstHalf = word.slice(0, midIndex);
                const secondHalf = word.slice(midIndex);
                return `<strong>${firstHalf}</strong>${secondHalf}`;
            });

            const span = document.createElement("span");
            span.innerHTML = modifiedWords.join("");
            span.setAttribute('data-bolded', 'true');
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && !skipTags.includes(node.tagName.toLowerCase()) && !node.hasAttribute('data-bolded')) {
            Array.from(node.childNodes).forEach(processTextNodes);
        }
    }

    processTextNodes(document.body);
    isProcessing = false;
}

function restoreOriginalText() {
    if (isProcessing) return;
    isProcessing = true;

    const boldedElements = document.querySelectorAll('[data-bolded]');
    boldedElements.forEach(element => {
        const parent = element.parentNode;
        const textNode = document.createTextNode(element.textContent);
        parent.replaceChild(textNode, element);
    });

    isProcessing = false;
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "enableBold") {
        boldFirstHalfOfWords();
    } else if (request.action === "disableBold") {
        restoreOriginalText();
    }
});

boldFirstHalfOfWords();
