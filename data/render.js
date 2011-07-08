self.port.on('render', function(store) { 
	var str = " " 
	for(var date in store) {
	    for(var url in store[date]) {
		str += url + " ";
		str += store[date][url];
		str += "<br/>";
	    }
	}
	document.body.innerHTML = str;
    });