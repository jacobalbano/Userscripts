// ==UserScript==
// @name         青空縦書き
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use vertical text on aozora bunko and scroll horizontally with the mouse wheel
// @author       Jake Albano
// @match        https://www.aozora.gr.jp/cards/*/files/*.html
// @run-at document-start
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `body { writing-mode: vertical-rl !important; }`);
    document.addEventListener("wheel", evt => {
        window.scroll(window.scrollX - evt.deltaY, 0);
        evt.preventDefault();
    });
})();