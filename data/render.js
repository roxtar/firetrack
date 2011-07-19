self.port.on('render', function(store) { 
	var str = " " ;
	var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];
	var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
	for(var date in store) {
	    $.plot($("#placeholder"), [{
			data: store[date],
			lines: {show: true, fill: true}
		    }]);

	} 
	    // for(var url in store[date]) {
	    // 	str += url + " ";
	    // 	str += store[date][url];
	    // 	str += "<br/>";
	    // }
	  //}
	  //document.body.innerHTML = str;
    });