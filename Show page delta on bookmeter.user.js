// ==UserScript==
// @name         Show page delta on bookmeter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the page delta when adding a book on bookmeter.
// @author       You
// @match        https://bookmeter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookmeter.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const unsubInstall = observeDOM(document, function() {
        if (document.querySelector('#modals') == null)
            return;

        let url = document.URL;
        setInterval(function() {
            if (url != document.URL) {
                url = document.URL;
                install();
            }
        }, 1000)

        unsubInstall();
        install();
    });

    function install() {
        console.log('installing');
        const deltaElement = new DOMParser().parseFromString(`<div id="TM_delta"></div>`, 'text/html').body.firstChild;
        for (const x of document.querySelectorAll('.result__new div:nth-child(1)')) {
            if (x.nextSibling.id != deltaElement.id)
                x.insertAdjacentElement('afterend', deltaElement.cloneNode(true));

            watch(x);
            console.log('watching', x);
        }
    }

    function watch(node) {
        const unsub = observeDOM(node, function() {
            unsub();

            const delta = getDelta(node);
            const from = node.firstChild;
            node.nextSibling.innerText = `読んだページ数 +${delta}`;
            watch(node);
        });
    }

    function getDelta(newBeforeAfter) {
        const [nodeA, nodeB] = newBeforeAfter.childNodes;
        const a = Number(nodeA.innerText.match(/\d+/));
        const b = Number(nodeB.innerText.match(/\d+/));
        return b - a;
    }
})();


function observeDOM(obj, callback){
    if( !obj || !obj.nodeType === 1 ) throw 'bad node'; // validation

    const obs = new MutationObserver((mutations, observer) => callback(mutations));
    obs.observe( obj, { childList:true, subtree:true });
    return () => obs.disconnect();
}