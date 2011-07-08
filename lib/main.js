var tabs = require("tabs");
var timers = require("timers");

var contextMenu = require("context-menu");
var panel = require("panel");

var pageMod = require("page-mod");

var currentTab = "";

var store = {};
var interval = 1000;

var self = require("self");
var data = self.data;


// Gets called at each interval
// Increments the current tab's URL's count.
function timerCallback() {
    incTimes();    
    // Enque ourselves back
    timers.setTimeout(timerCallback, interval);
}

function incTimes() {
    var now  = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var year = now.getFullYear();
    var date = day.toString() + "."
	+ month.toString() + "." 
	+ year;

    var domain = getDomainName(currentTab);
    if(domain) {
	if(!store[date]) {
	    store[date] = {}
	}
	if(!store[date][domain]) {
	    store[date][domain] = 0;
	}
	
	store[date][domain]++;
    }

}

function setCurrentTab(url) {
    currentTab = url;
}

function printTimes() {
    for(var date in store) {
	for(var url in store[date]) {
	    console.log(url);
	    console.log(store[date][url]);
	}
    }
}


    

function getDomainName(url) {
    // Yuck!
    var match = url.match(/:\/\/(.[^/]+)/);
    if(match)
	return match[1];
    return null;
	    
}

exports.main = function(options, callbacks) {
    var current_worker = null;
    timers.setTimeout(timerCallback, interval);
    tabs.on('activate',function(tab) {
	    setCurrentTab(tab.url);
	});
    tabs.on('ready', function(tab) {
	    setCurrentTab(tab.url);
	});
    pageMod.PageMod({
	    include: ["*"],
		contentScriptFile: data.url("render.js"),
		onAttach: function(worker) {
		current_worker = worker;
	    }
	});


    var ftItem = contextMenu.Item( {
	    label: "Firetrack",
	    contentScript: "self.on('click', function (node, data) {"+
	    "self.postMessage(document.URL); });",	    
	    onMessage: function(url) {		
		current_worker.port.emit('render', store);
	    }});

};

// print all counts for today on exit
exports.onUnload = function(reason) {
    printTimes();   
}