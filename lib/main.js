

var currentTab = "";

var store = {};
var interval = 1000;
// This is the entry point for FireTrack
exports.main = function(options, callbacks) {
    
    var contextMenu = require("context-menu");
	var panel = require("panel");
	var storage = require("simple-storage");
	var tabs = require("tabs");
	var timers = require("timers");

	var self = require("self");
	var data = self.data;


    // try to get user stored settings, if we dont' get
    // anything set some defaults and store it
    var settings = storage.settings;
    if(!settings) {
		settings = {};
	    settings.hotkey = "accel-alt-i";
	    storage.settings = settings;
    }

    // the timer call back is used to increment the 
    // the timer for each tab
    timers.setTimeout(timerCallback, interval);
    tabs.on('activate',function(tab) {
	    setCurrentTab(tab.url);
	});
    tabs.on('ready', function(tab) {
	    setCurrentTab(tab.url);
	});

    // the panel is used to display the FireTrack dashboard
    
    var ftpanel = panel.Panel({	    
	    contentScriptFile: [data.url('jquery-1.6.2.js'), data.url("render.js"),
		data.url("jquery.flot.js"), data.url("jquery.flot.stack.js")],
	    contentURL: data.url("stats.html"),
	    width: 640,
	    height: 480,
	});


	var currentHotKey = setHotKey(settings.hotkey, ftpanel);

	ftpanel.port.on("settings_changed", function(settings) {
			console.log("Settings changed");
			console.log(settings.hotkey);
			storage.settings = settings;
			currentHotKey.destroy();
			currentHotKey = setHotKey(settings.hotkey, ftpanel);
			showFireTrack(ftpanel);
	});

	ftpanel.port.on("send_settings", function() {
			sendSettings(ftpanel, storage);
	});

	
    // attach the FireTrack option to the context menu
    var ftItem = contextMenu.Item( {
	    label: "Firetrack",
	    contentScript: "self.on('click', function (node, data) {"+
	    "self.postMessage(document.URL); });",	    
	    onMessage: function(url) {
		showFireTrack(ftpanel);
	    }});


};

// print all counts for today on exit
exports.onUnload = function(reason) {
    //printTimes();   
}


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

function sendSettings(panel, storage) {
		panel.port.emit("show_settings", storage.settings);
}

function setHotKey(key, panel) {
	
	const { Hotkey } = require("hotkeys");
    // attach hotkey
    var showHotKey = Hotkey( {
	    combo: key,
	    onPress: function() {
		toggleFireTrack(panel);
	    }
	});
	return showHotKey;
}
// Gets called at each interval
// Increments the current tab's URL's count.
function timerCallback() {
    var timers = require("timers");
    incTimes();    
    // Enque ourselves back
    timers.setTimeout(timerCallback, interval);
}


// Called every second on current tab
// Increments the count of current tab's domain by 1
function incTimes() {
	
	var privateBrowsing = require("private-browsing");
    var now  = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var year = now.getFullYear();
    var date = day.toString() + "."
	+ month.toString() + "." 
	+ year;

    var domain = getDomainName(currentTab);
    if(domain && privateBrowsing.isActive == false) {
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


