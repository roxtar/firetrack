self.port.on('render', function(store) { 
	var data = [];
	var i = 0;
	for(var date in store) {
	    for(var url in store[date]) { 
		data.push(
			  {
			      label: url, 
				  data: [[i,parseInt(store[date][url])]]
				  }	
			  );
		i++;
	    }
	  }
	var options = {
	    series: {stack:0,
		     lines: {show:false, steps:false},
		     bars:{show:true}}
	};

	    $.plot($("#placeholder"), data, options);	
    });