self.port.on('render', function(store) {

	// reads the time data present in "store"
	// and renders it as a bar graph using
	// flot
	var data = new Array();
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
		     bars:{show:true}},
	    legend : {
		show: false
	    },
	    grid: {hoverable: true},
	};
	$.plot($("#placeholder"), data, options);

	function showTooltip(x, y, contents) {
	    $('<div id="tooltip">' + contents + '</div>').css( {
		    position: 'absolute',
			display: 'none',
			top: y + 5,
			left: x + 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80
			}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#placeholder").bind("plothover", function (event, pos, item) {
		    if (item) {
			if (previousPoint != item.dataIndex) {
			    previousPoint = item.dataIndex;
			    $("#tooltip").remove();
			    var x = item.datapoint[0].toFixed(2),
				y = item.datapoint[1].toFixed(2);

			    showTooltip(item.pageX, item.pageY,
					item.series.label + "=" + y);
			}
		    }
		    else {
			$("#tooltip").remove();
			previousPoint = null;
		    }
	    });
    });
