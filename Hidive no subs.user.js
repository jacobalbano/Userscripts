// ==UserScript==
// @name         Hidive no subs
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide subtitles on hidive
// @author       Jacob Albano
// @match        https://www.hidive.com/stream/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hidive.com
// @grant        GM_addStyle
// ==/UserScript==

(() => GM_addStyle('span[class*="Subtitle"], span[class*="Caption"], span[class*="Song"] { display: none !important; }'))();