(function () {
    const CHAT_URL_PLACEHOLDER = "";
    const CHAT_TITLE = "AI Assistant";
    const OPEN_LABEL = "Open assistant";
    const RESIZE_LABEL = "Resize panel";
    const KICKER_LABEL = "Interactive Helper";
    const EXPAND_LABEL = "Toggle expanded panel";
    const CLOSE_LABEL = "Close chat panel";
    const PLACEHOLDER_TITLE = "Chat URL required";
    const PLACEHOLDER_TEXT =
        "The widget is using placeholder content because no chat URL is available.";
    const PLACEHOLDER_HINT =
        "Set <code>data-chat-url</code> on the current page <code>body</code> to load a page-specific assistant.";
    const SCENE_SRC = "../../assets/videos/scene.webm";

    function hasValidChatUrl(url) {
        return /^https?:\/\//.test(url || "");
    }

    function createSceneChip() {
        const chip = document.createElement("div");
        chip.className = "cw-chat-scene-chip";

        const video = document.createElement("video");
        video.className = "cw-chat-scene-video";
        video.src = SCENE_SRC;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("aria-hidden", "true");
        video.tabIndex = -1;

        chip.appendChild(video);
        return chip;
    }

    function createWidget() {
        if (document.querySelector(".cw-chat-launcher")) {
            return;
        }

        const body = document.body;
        if (!body) {
            return;
        }

        const chatUrl = body.dataset.chatUrl || CHAT_URL_PLACEHOLDER;

        const launcher = document.createElement("div");
        launcher.className = "cw-chat-launcher";

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "cw-chat-trigger";
        trigger.setAttribute("aria-label", OPEN_LABEL);
        trigger.innerHTML =
            '<span class="cw-trigger-icon">AI</span><span class="cw-trigger-text">' +
            CHAT_TITLE +
            "</span>";

        const overlay = document.createElement("div");
        overlay.className = "cw-chat-overlay";
        overlay.hidden = true;

        const panel = document.createElement("aside");
        panel.className = "cw-chat-panel";
        panel.setAttribute("aria-hidden", "true");
        panel.innerHTML =
            '<div class="cw-chat-resize-handle" title="' + RESIZE_LABEL + '"></div>' +
            '<div class="cw-chat-panel-header">' +
                "<div>" +
                    '<p class="cw-chat-panel-kicker">' + KICKER_LABEL + "</p>" +
                    '<h3 class="cw-chat-panel-title">' + CHAT_TITLE + "</h3>" +
                "</div>" +
                '<div class="cw-chat-panel-actions">' +
                    '<button class="cw-chat-action-btn" type="button" aria-label="' + EXPAND_LABEL + '">&#x2922;</button>' +
                    '<button class="cw-chat-close" type="button" aria-label="' + CLOSE_LABEL + '">&times;</button>' +
                "</div>" +
            "</div>" +
            '<div class="cw-chat-panel-body"></div>';

        launcher.appendChild(createSceneChip());
        launcher.appendChild(trigger);
        body.appendChild(launcher);
        body.appendChild(overlay);
        body.appendChild(panel);

        const panelBody = panel.querySelector(".cw-chat-panel-body");
        const closeBtn = panel.querySelector(".cw-chat-close");
        const sizeToggle = panel.querySelector(".cw-chat-action-btn");
        const resizeHandle = panel.querySelector(".cw-chat-resize-handle");

        if (hasValidChatUrl(chatUrl)) {
            const iframe = document.createElement("iframe");
            iframe.className = "cw-chat-frame";
            iframe.title = CHAT_TITLE + " chat panel";
            iframe.loading = "lazy";
            iframe.allow = "clipboard-write; microphone";
            iframe.src = chatUrl;
            panelBody.appendChild(iframe);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "cw-chat-placeholder";
            placeholder.innerHTML =
                "<h4>" + PLACEHOLDER_TITLE + "</h4>" +
                "<p>" + PLACEHOLDER_TEXT + "</p>" +
                "<p>" + PLACEHOLDER_HINT + "</p>";
            panelBody.appendChild(placeholder);
        }

        function isMobile() {
            return window.innerWidth <= 768;
        }

        function resetDesktopPanelSize() {
            panel.style.width = "";
            panel.style.height = "";
            panel.style.right = "";
            panel.style.bottom = "";
        }

        function openPanel() {
            panel.classList.add("cw-is-open");
            panel.setAttribute("aria-hidden", "false");
            overlay.hidden = false;
            body.style.overflow = "hidden";
        }

        function closePanel() {
            panel.classList.remove("cw-is-open");
            panel.classList.remove("cw-is-expanded");
            panel.setAttribute("aria-hidden", "true");
            overlay.hidden = true;
            body.style.overflow = "";
            resetDesktopPanelSize();
        }

        function togglePanelSize() {
            panel.classList.toggle("cw-is-expanded");
        }

        trigger.addEventListener("click", openPanel);
        closeBtn.addEventListener("click", closePanel);
        overlay.addEventListener("click", closePanel);
        sizeToggle.addEventListener("click", togglePanelSize);

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closePanel();
            }
        });

        window.addEventListener("resize", function () {
            if (isMobile()) {
                resetDesktopPanelSize();
            }
        });

        if (resizeHandle) {
            let isResizing = false;
            let startX = 0;
            let startY = 0;
            let startWidth = 0;
            let startHeight = 0;

            resizeHandle.addEventListener("mousedown", function (event) {
                if (isMobile()) {
                    return;
                }

                isResizing = true;
                startX = event.clientX;
                startY = event.clientY;
                startWidth = panel.offsetWidth;
                startHeight = panel.offsetHeight;
                body.style.userSelect = "none";
                event.preventDefault();
            });

            window.addEventListener("mousemove", function (event) {
                if (!isResizing) {
                    return;
                }

                const dx = startX - event.clientX;
                const dy = startY - event.clientY;
                const newWidth = Math.min(Math.max(startWidth + dx, 320), window.innerWidth - 24);
                const newHeight = Math.min(Math.max(startHeight + dy, 420), window.innerHeight - 24);

                panel.style.width = newWidth + "px";
                panel.style.height = newHeight + "px";
            });

            window.addEventListener("mouseup", function () {
                if (!isResizing) {
                    return;
                }

                isResizing = false;
                body.style.userSelect = "";
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWidget);
    } else {
        createWidget();
    }
})();
