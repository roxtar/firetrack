var tabs = require("tabs");
var timers = require("timers");
var currentTab = "";

var store = {};
var interval = 1000;

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
    timers.setTimeout(timerCallback, interval);
    tabs.on('activate',function(tab) {
	    setCurrentTab(tab.url);
	});
    tabs.on('ready', function(tab) {
	    setCurrentTab(tab.url);
	});
};

// print all counts for today on exit
exports.onUnload = function(reason) {
    printTimes();   
}