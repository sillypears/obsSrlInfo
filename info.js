//Global stuffs

var srlAPI = "http://api.speedrunslive.com"; 

function get_parameters() {
	
	if (location.search.split('game=')[1] != null) {
		return location.search.split('game=')[1]
	} else {
		return 'default'
	} 
}

function get_races() {
    $.ajax({
		type : "GET",
        url : srlAPI + "/races/",
        cache : false,
		}).done(print_response);	
}

function make_list(entrants) {
    var names = [];
    for(var name in entrants) {
    	names.push(name);
    }
    return names;
}

function print_response(data) {
	race_list = {};
	current_game = get_parameters();
	$.each(data.races, function (x, object) {
		//if (object.game.abbrev == current_game && object.statetext == "In Progress") {
		if (object.statetext == "In Progress") {
			if (object.game.abbrev == current_game) {
				race_list[object.id] = object;
			} else if (current_game == 'default') {
				race_list[object.id] = object;
			}
		}
		});
	if (Object.keys(race_list).length > 0) {
		var some_html = $('<div class=info>Current Races:<div class=entrants ></div></div>');
	    $.each(race_list, function(x, obj){
	    	var d = new Date(0);
	    	d.setUTCSeconds(obj.time);
	    	var time = new Date(Math.abs(new Date() - d));
		    some_html.children('div').append('<div class=goal>Goal: '+obj.goal+
		    '<div class=time>Time: '+time.getMinutes()+":"+time.getSeconds()+'</div>'+
			'<div class=racer>'+
			'<list><li>'+
			make_list(obj.entrants).join('</li><li>')+
			'</li></div></div>&nbsp</div>');
	  });
    } else {
    	some_html = $('<div class=info>No Races In Progress</div>');
    }   
	var date = new Date();
	//console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());

	$('#content').html(some_html);
}

$(document).ready( function(){
	get_races();
	setInterval(function(){
		get_races();
	}, 30000);
 }
)