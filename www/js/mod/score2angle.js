/**
	分数转化为角度
	关键刻度
	[350,400,550,600,625,650,675,700,725,750,1000]
	每等分27度

*/

export default function score2angle(score){
	if(score<=350){
		return 0
	}
	else if(score<=400){
		return (score-350)/(400-350)*25.5
	}
	else if(score<=550){
		return 25.5 + (score-400)/(550-400)*25.5
	}
	else if(score<=600){
		return 52 + (score-550)/(600-550)*25.5
	}
	else if(score<=625){
		return 77 + (score-600)/(625-600)*27.8
	}
	else if(score<=650){
		return 105 + (score-625)/(650-625)*29.8
	}
	else if(score<=675){
		return 134.5 + (score-650)/(675-650)*29.8
	}
	else if(score<=700){
		return 164.5 + (score-675)/(700-675)*27.8
	}
	else if(score<=725){
		return 193.3 + (score-700)/(725-700)*25.5
	}
	else if(score<=750){
		return 218.8 + (score-725)/(750-725)*25.5
	}
	else if(score<=1000){
		return 245 + (score-750)/(1000-750)*25.5
	}
	else{
		return 27*10
	}
}