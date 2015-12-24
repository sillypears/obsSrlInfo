//Global stuffs

var srlAPI = "http://api.speedrunslive.com"; 
var currentRaces = {}; // 

function get_races() {
    $.ajax({
		type : "GET",
        url : srlAPI + "/races/",
        cache : false,
		}).done(printResponse);	
}

function make_list(entrants) {
    var names = [];
    for(var name in entrants) {
    	names.push(name);
    }
    
    return names;
}

function printResponse(data) {
	race_list = {};
	$.each(data.races, function (x, object) {
		//if (object.game.abbrev == "isaacafterbirth" && object.statetext == "In Progress") {
		if (object.statetext == "In Progress") {
			race_list[object.id] = object;
		}
		});
	if (Object.keys(race_list).length > 0) {
	  var someHtml = $('<div class=info>Current Races:<div class=entrants ></div></div>');
	  $.each(race_list, function(x, obj){
		someHtml.children('div').append('<div class=game>Game: '+obj.game.name+
			'<div class=goal>Goal: '+obj.goal+
			'<div class=racer>'+
			'<list><li>'+
			make_list(obj.entrants).join('</li><li>')+
			'</li></div></div>&nbsp</div>');
	  });
    } else {
    	someHtml = $('<div class=info>No Races In Progress</div>');
    }   
	var date = new Date();
	console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());

	$('#content').html(someHtml);
}

$(document).ready( function(){
	get_races();
	setInterval(function(){
		get_races();
	}, 60000);
 }
)