//Global stuffs

var srlAPI = "http://api.speedrunslive.com"; 

function get_parameters() {
	
	if (location.search.split('game=')[1] != null) {
		return location.search.split('game=')[1]
	} else {
		return 'default'
	} 
}

function getTrueskill(skill){
	if(skill==0){
		skill="unranked";
	}
	return skill;
}

function get_races() {
    $.ajax({
		type : "GET",
        url : srlAPI + "/races/",
        cache : false,
		}).done(print_response);	
}

function getPlace(place){
	if (place < 9994){
		return getRank(place)
	} else if (place==9999) {
		return 'DQ'
	} else if (place==9998) {
		return 'forfeit'
	} else {
		return ''
	}
};

function getRank(rank){
	if (rank==1){
		return '1st'
	} else if(rank==2){
		return '2nd'
	} else if (rank==3){
		return '3rd'
	} else if ((rank==11)||(rank==12)||(rank==13)){
		return rank+'th'
	} else if (rank%10==1){
		return rank+'st'
	} else if (rank%10==2){
		return rank+'nd'
	} else if (rank%10==3){
		return rank+'rd'
	} else {
		return rank+'th'
	}
};

function make_list(entrants) {
    var names = [];
    console.log(entrants);
    for(var name in entrants) {
    	var	place = getPlace(entrants[name].place);
    	var sep = ''
    	if (place != '') {
    		sep = ' - ';
    	}
    	time = ''
    	if (entrants[name].time > 0) {
    		time = getTime(entrants[name].time,entrants[name].place);
    	} else {
    		time = 'na';
    	}
        names.push(name+sep+place+sep+time);
    }
    return names;
}

function getTime(secs,place,firstPlaceTime){
	
	if(secs>0){
		convert=secondsToTime(secs)
		secondsDifference=secs-firstPlaceTime
		difference=secondsToTime(secondsDifference)
		timeDifference=''
		if(secondsDifference>0){
			return'<span title=\"+'+difference.h+':'+difference.m+':'+difference.s+'\">'+convert.h+':'+convert.m+':'+convert.s+'</span>';}else{return convert.h+':'+convert.m+':'+convert.s;
		}
	} else {
		return''
	}
	
};

function secondsToTime(secs){
	var hours=Math.floor(secs/(60*60));
	hours+='';
	while(hours.length<2){
		hours='0'+hours
	};
	var divisor_for_minutes=secs%(60*60);
	var minutes=Math.floor(divisor_for_minutes/60);
	minutes+='';
	while(minutes.length<2){
		minutes='0'+minutes
	};
	var divisor_for_seconds=divisor_for_minutes%60;
	var seconds=Math.ceil(divisor_for_seconds);
	seconds+='';
	while(seconds.length<2){
		seconds='0'+seconds
	};
	var obj= { 
			"h":hours,"m":minutes,"s":seconds
	};
	return obj;
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
	    	//console.log(obj);
	    	//var d = new Date(0);
	    	race_time = obj.time
		    some_html.children('div').append(
			//'<div class=game>Game: '+obj.game.name+'</div>'+
			'<div class=goal>Goal: '+obj.goal+
		    //'<div class=time>Time: '+time.getMinutes()+":"+time.getSeconds()+'</div>'+
			'<div class=racer>'+
			'<list><li>'+
			make_list(obj.entrants).join('</li><li>')+
			'</li></div></div>&nbsp</div>');
	  });
    } else {
    	some_html = $('<div class=info>No Races In Progress</div>');
    }   
	//var date = new Date();
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