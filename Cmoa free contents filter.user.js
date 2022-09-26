// ==UserScript==
// @name         Cmoa free contents filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Filter out some stuff on cmoa's free page
// @author       You
// @match        https://www.cmoa.jp/freecontents*
// @icon         https://www.google.com/s2/favicons?domain=cmoa.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// ==/UserScript==
const cfg = new MonkeyConfig({
    title: 'Configuration',
    menuCommand: true,
    buttons: ['save', 'cancel'],
    params: {
        hide_BL: {
            type: 'checkbox',
            default: true
        },
        hide_TL: {
            type: 'checkbox',
            default: true
        },
        hide_novels: {
            type: 'checkbox',
            default: true
        }
    }
});

const blocklist = GM_getValue('blocklist') || {};

~function() {
	var styleSheet = document.createElement("style");
	styleSheet.innerText = `
		.position_r button {
			visibility: hidden;
		}

		.position_r:hover button {
			visibility: visible;
		}

        .blacklist-parent {
			position: relative;
        }

		.blacklist {
			position: absolute;
			right: 5px;
			top: 5px;
			cursor: pointer;
		}`;
	document.head.appendChild(styleSheet);
}();



~function() {
	const template = new DOMParser().parseFromString(
	`<button class="blacklist">
		❌
	</button>`, 'text/html').body.firstChild;

    for (const a of document.querySelectorAll('.thum_box > .position_r')) {
        a.classList.toggle('blacklist-parent', true);
        const button = template.cloneNode(true);
        button.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();

            blocklist[a.href] = true;
            GM_setValue('blocklist', blocklist);

            let li = a;
            while (li.localName != 'li')
                li = li.parentElement;

            li.remove();
            reflow(false);
        });
        a.appendChild(button);
    }
}();

function reflow(redirect) {
    'use strict';
    const filterOut = [...getFilterList()];
    const freeContainer = document.querySelector('#freeTitle > .fixBox');
    const elements = Array.from(document.querySelectorAll('.genre_name > a'))
        .map(a => ({ a, li: a.parentElement.parentElement }));

    if (elements.length == 0)
        return;

    for (const {li} of elements)
        li.parentElement.removeChild(li);

    for (const e of document.querySelectorAll('.fixBox > .clearfix'))
        e.parentElement.removeChild(e);

    let total = 0;
    let row = 0;
    let clearfix = null;
    for (const {a, li} of elements) {
        if (filterOut.indexOf(a.innerHTML) >= 0) continue;
        if (blocklist[li.querySelector('.blacklist-parent').href]) continue;

        total++;

        if (clearfix == null) {
            clearfix = document.createElement('div');
            clearfix.classList.add('clearfix');
            freeContainer.appendChild(clearfix);
        }

        clearfix.appendChild(li);
        if (++row == 5) {
            clearfix = null;
            row = 0;
        }
    }

    if (total == 0 && redirect) {
        const params = new URLSearchParams(window.location.search);
        params.set('page', Number(params.get('page')) + 1);
        location.assign(location.origin + location.pathname + '?' + params.toString());
    }

    function* getFilterList() {
        const filter = {
            hide_BL: 'BLコミック',
            hide_novels: 'ライトノベル',
            hide_TL: 'TLコミック'
        };

        for (const key of Object.keys(filter))
            if (cfg.get(key)) yield filter[key];
    }
}

reflow(true);