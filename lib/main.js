var tabs = require("tabs");
var timers = require("timers");

var contextMenu = require("context-menu");
var panel = require("panel");

const { Hotkey } = require("hotkeys");

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


// Called every second on current tab
// Increments the count of current tab's domain by 1
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
    
    var p = panel.Panel({	    
	    contentScriptFile: [data.url('jquery.min.js'), data.url("render.js"), data.url("jquery.flot.min.js"), data.url("jquery.flot.stack.js")],
	    contentURL: data.url("stats.html"),
	    width: 640,
	    height: 480,
	});
	

    var ftItem = contextMenu.Item( {
	    label: "Firetrack",
	    contentScript: "self.on('click', function (node, data) {"+
	    "self.postMessage(document.URL); });",	    
	    onMessage: function(url) {
		showFireTrack(p);
	    }});

    var showHotKey = Hotkey( {
	    combo: "accel-alt-i",
	    onPress: function() {
		toggleFireTrack(p);
	    }
	});

    function toggleFireTrack(panel) {
	if(panel.isShowing) {
	    panel.hide();
	}
	else {
	    showFireTrack(panel);
	}
    }

    function showFireTrack(panel) {
	panel.show();
	panel.port.emit("render", store);

    }

};

// print all counts for today on exit
exports.onUnload = function(reason) {
    printTimes();   
}