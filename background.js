'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains 'app.getblueshift.com'
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: 'app.getblueshift.com' },
					})
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function applyDev(){
	chrome.tabs.query(
		{ active: true, currentWindow: true}, 
		function (tabs) {
			if (tabs[0] && tabs[0].url) {
				let additionalParam = "dev=true";
				let currentUrl =  new URL(tabs[0].url)
				let urlParams = currentUrl.search
				if(currentUrl.href.search("dev=true") >= 0) {
					let updatedUrl = currentUrl.toString().replace('?dev=true','');
					updatedUrl = updatedUrl.replace('&dev=true','');
					chrome.tabs.update(tabs[0].id, {url: updatedUrl});
					return
				}
				const querySymbol = (currentUrl.toString().indexOf('?') === -1) ? '?' : '&';
			  chrome.tabs.update(tabs[0].id, {url: currentUrl + querySymbol + additionalParam});
			}
		}
	);
}

function enableBrowserAction(tabId, changeInfo, tabInfo) {
	chrome.tabs.get(tabId, function (tab) {
		if (tab.url.search("app.getblueshift.com") >= 0) {
  		chrome.browserAction.enable(tab.id);
			chrome.browserAction.setIcon({path: "assets/dev_enabled.png"});
		} else {
			chrome.browserAction.setIcon({path: "assets/dev_disabled.png"});
			chrome.browserAction.disable(tab.id);	
		}
	})
}


chrome.tabs.onUpdated.addListener(enableBrowserAction)

chrome.browserAction.onClicked.addListener(applyDev)
