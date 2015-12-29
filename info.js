//Global stuffs

var srlAPI = "http://api.speedrunslive.com"; 

function get_game() {
	
	if (location.search.split('game=')[1] != null) {
		return location.search.split('game=')[1]
	} else {
		return 'default'
	} 
};

function gup(name){
	name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS="[\\?&]"+name+"=([^&#]*)";
	var regex=new RegExp(regexS);
	var results=regex.exec(window.location.href);
	if(results==null) return "default"; else return results[1];
};

function get_user() {
	
	if (location.search.split('user=')[1] != null) {
		return location.search.split('user=')[1]
	} else {
		return 'default'
	} 
};

function get_trueskill(skill){
	if(skill==0){
		skill="unranked";
	}
	return skill;
};

function get_races() {
    $.ajax({
		type : "GET",
        url : srlAPI + "/races/",
        cache : false,
		}).done(print_response);	
};


function get_rank(rank, name, time){
	if (rank < 9994){
		if (rank==1){
			return '<div class=racergold>'+name+' - 1st - '+get_time(time, name)+'</div>'
		} else if(rank==2){
			return '<div class=racersilver>'+name+' - 2nd - '+get_time(time, name)+'</div>'
		} else if (rank==3){
			return '<div class=racerbronze>'+name+' - 3rd - '+get_time(time, name)+'</div>'
		} else if ((rank==11)||(rank==12)||(rank==13)){
			return '<div class=racerdone>'+name+' - '+rank+'th - '+get_time(time, name)+'</div>'
		} else if (rank%10==1){
			return '<div class=racergold>'+name+' - '+rank+'st - '+get_time(time, name)+'</div>'
		} else if (rank%10==2){
			return '<div class=racersilver>'+name+' - '+rank+'nd - '+get_time(time, name)+'</div>'
		} else if (rank%10==3){
			return'<div class=racerbronze>'+name+' - '+rank+'rd - '+get_time(time, name)+'</div>'
		} else {
			return '<div class=racerdone>'+name+' - '+rank+'th - '+get_time(time, name)+'</div>'
		}
	} else if (rank==9999) {
		return '<div class=racerdq>'+name+' - DQ</div>'
	} else if (rank==9998) {
		return '<div class=racerquit>'+name+' - forfeit</div>'
	} else {
		return '<div class=racer>'+name+'</div>'
	} 
};

function make_list(entrants) {
    var names = [];
    for(var name in entrants) {

    	var holder = get_rank(entrants[name].place, name, entrants[name].time);
        names.push(holder);

		
    }
    return names
};

function get_race_time(secs,firstPlaceTime) {
	if (secs > 0) {
		var d = new Date();
		var dd = new Date(0);
		dd.setUTCSeconds(secs);
		convert = seconds_to_time((d.getTime()-dd.getTime())/1000);
		secondsDifference=secs-firstPlaceTime
		return ' - '+convert.h+':'+convert.m+':'+convert.s
		
	} else {
		return ''
	}	
		
}
function get_time(secs,place,firstPlaceTime){
	
	if(secs>0){
		convert=seconds_to_time(secs)
		secondsDifference=secs-firstPlaceTime
		difference=seconds_to_time(secondsDifference)
		timeDifference=''
		if(secondsDifference>0){
			return'<span title=\"+'+difference.h+':'+difference.m+':'+difference.s+'\">'+convert.h+':'+convert.m+':'+convert.s+'</span>';}else{return convert.h+':'+convert.m+':'+convert.s;
		}
	} else {
		return ''
	}
	
};

function seconds_to_time(secs){
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
	return obj
};

function print_response(data) {
	race_list = {};
	var current_game = gup('game');
	var current_user = gup('user');
	var disp_title = gup('title');
	var disp_state = gup('state');
	var disp_state = gup('time');
	var disp_entrants = gup('entrants');
	var disp_goal = gup('goal');
	$.each(data.races, function (x, object) {
		
		//if (object.game.abbrev == current_game && object.statetext == "In Progress") {
		if (object.statetext == "In Progress" || object.statetext == "Entry Open") {
			if ((object.game.abbrev == current_game)) {
				race_list[object.id] = object;
			} else if (current_game == 'default') {
			//} else if (object.game.abbrev == current_game) {
			//	race_list[object.id] = object;
			//} else {
				race_list[object.id] = object;
			}
		}
		});
	
	if (Object.keys(race_list).length > 0) {
	
		var some_html = $('<div class=info> <div class=entrants ></div></div>');
		
	    $.each(race_list, function(x, obj){
	    	//console.log(obj);
			entrant_list = make_list(obj.entrants);
	    	race_time = get_race_time(obj.time);
			some_html.children('div').append('<div class=goal>Goal: '+obj.goal);
			some_html.children('div').append(		
		    '<div class=state>'+obj.statetext+'<span class=time>'+race_time+'</span></div>'+
			'<div class=racer>'+
			'<list><li>'+
			entrant_list.join('</li><li>')+
			'</li></div></div>&nbsp</div>');
	  });
    } else {
    	some_html = $('<div class=info>No Races In Progress</div>');
    }   
	//var date = new Date();
	//console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());

	$('#content').html(some_html);
};


$(document).ready( function(){
	get_races();
	setInterval(function(){
		get_races();
	}, 30000);
 }
)
