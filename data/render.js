$(document).ready(function() { 
		$("#ft_settings_form").hide();

		$("#ft_settings").click(function(event) { 
				// ask the add on to send the settings to us
			    self.port.emit('send_settings');	
				event.preventDefault(); 
				event.stopPropagation();
				});

		$("#ft_settings_form").submit(function(event) {
				settings = {};
				settings.hotkey = $("#hotkey").val();
				console.log(settings.hotkey);
				self.port.emit("settings_changed", settings);
				$("#ft_settings_form").hide();
				$("#ft_panel").show();
				event.preventDefault();
				event.stopPropagation();
		}); 
});

self.port.on('show_settings', function(settings) {
				$("#ft_panel").hide();
				$("#ft_settings_form").show();
				$("#hotkey").val(settings.hotkey);
});

self.port.on('render', function (store) {	
	"use strict";
	// reads the time data present in "store"
	// and renders it as a bar graph using
	// flot
	var data = [], i = 0, date, url, options;
	for (date in store) {
	    for (url in store[date]) {
		data.push(
			  {
			      label: url,
				  data: [[i,parseInt(store[date][url])]]
				  }
			  );
		i++;
	    }
	  }

	options = {
	    series: {stack:0,
		     lines: {show:false, steps:false},
		     bars:{show:true}},
	    legend : {
		show: true 
	    },
	    grid: {hoverable: true},
	};
	$.plot($("#ft_panel"), data, options);

	function showTooltip(x, y, contents) {
	    $('<div id="ft_tooltip">' + contents + '</div>').css( {
		    position: 'absolute',
			display: 'none',
			top: y - 30,
			left: x + 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80
			}).appendTo("body").fadeIn(200);
	}

	var previousLabel = null;
	$("#ft_panel").bind("plothover", function (event, pos, item) {
		    if (item) {
			if (previousLabel != item.series.label) {
			    previousLabel = item.series.label;
			    $("#ft_tooltip").remove();
			    var x = item.datapoint[0].toFixed(2),
				y = item.datapoint[1].toFixed(2);

			    showTooltip(item.pageX, item.pageY,
					item.series.label + "=" + y);
			}
		    }
		    else {
			$("#ft_tooltip").remove();
			previousLabel = null;
		    }
	    });
    });
