
	const a = 35;
	var lenX = parseInt(document.body.clientWidth/35/3*2);		
	var lenY = parseInt(document.body.clientHeight/35/3*2);

	var progressbar = new Vue({
		el: "#progressbar",
		data:{
			percent: 0,
			sleep: 30000,
		},
		created:function(){
			this.StartTimer();
		},
		computed:{
			ProgBarStyle:function(){
				return {
					width: this.percent + '%'
				}
			}
		},
		methods:{
			StartTimer:function(){
				this.percent-=0.1;
				if ( this.percent <= 0 ) {
				field.DestroyPumpkin(); 
				}

				setTimeout(()=>{this.StartTimer()},1);
			},
			SleepTimer:function(){
				this.percent = 0;
				setTimeout(()=>{ 	
					field.SetPumpkin();
					this.percent = 100;
					this.StartTimer();	
				},this.sleep);
			},
			StopTimer:function(){
				this.percent = 0;
			}
		}
	});


	var score = new Vue({
		el: '#score',
		data:{
			score: 0
		},
		methods:{
			Increment: function(val){
				this.score+=val;
				document.getElementById('score').className='score table-light';
				setTimeout(()=>{
				document.getElementById('score').className='score table-simple';
				},1000);
			},
			ResetScore: function(){
				this.score = 0;
			}
		}
	});

	var menu = new Vue({
		el: "#winMenu",
		data:{

		},
		computed:{
			wMenuStyle: function(){
				var width = lenX*a;
				var height = lenY*a;
				var top = document.body.clientHeight/lenY;
				var left = document.body.clientWidth/lenX;
				//console.log(this.lenX);
				//console.log(width);
				 return {
			    				width: width + "px",
			    				left: (document.body.clientWidth-width)/2 + "px", 
			    				top: (document.body.clientHeight-height)/4 + "px",
			    				height: height + "px",
				 }
			}
		},
		methods:{
			SetSnake: function(){
				document.getElementById('winMenu').className="windowMenu hidden";
				score.ResetScore();
				field.SetField();
				//field.SetSnake();
				//field.MoveIt();
			},
		}
	});

var field = new Vue({
	el: '#field',
	created:function(){
		this.SetField();
	},
	data:{
		fieldArray:[],
		apple: -1,
		pumpkin: -1,
		snake: { body:[], way: 'E', alive: false}
	},
	computed:{
		lenX:function(){
			//return parseInt(document.body.clientWidth/35/3*2);
			return lenX;
		},
		lenY: function(){
			//return parseInt(document.body.clientHeight/35/3*2);
			return lenY;
		},
		FieldStyle: function(){
			var width = this.lenX*a;
			var height = this.lenY*a;
			var top = document.body.clientHeight/this.lenY;
			var left = document.body.clientWidth/this.lenX;
			//console.log(this.lenX);
			//console.log(width);
			 return {
		    				width: width + "px",
		    				left: (document.body.clientWidth-width)/2 + "px", 
		    				top: (document.body.clientHeight-height)/4 + "px",
		    				height: height + "px",
			 }
		},
	},
	methods:{
		SetField: function () {
			var id=1;
			console.log(this.lenX);
			console.log(this.lenY);
			for (var i=0; i < this.lenX; i++){
				for (var j=0; j < this.lenY; j++){
					this.fieldArray.push({ 
					id: id++,
		  			x: i, 
		  			y: j 
		  		}); 	
		  		}	
		  	}  	
		  	setTimeout(this.SetSnake,250);
		  	setTimeout(this.SetApple,250);
		  	setTimeout(progressbar.SleepTimer(),250);
		  	setTimeout(this.MoveIt,250);
		},
		SetSnake: function(){
				var headPos = this.Rand(0, 256);
				this.snake.body.push(headPos);
				this.snake.body.push(headPos-1);
				this.snake.way = 'E';
				this.snake.alive = true;
				for (var i=0; i<this.snake.body.length;i++)
				document.getElementById(this.fieldArray[this.snake.body[i]].id).className= "block block-selected";
		},
		MoveIt: function(){
				var snake = this.snake.body;
				var tail = snake[snake.length-1];
				var head = this.snake.body[0];
				var destroy = false;

				if (this.apple>0)document.getElementById(this.apple).className= "block apple";
				if (this.pumpkin>0)document.getElementById(this.pumpkin).className= "block pumpkin";

				for(var i = 1; i<this.snake.body.length;i++)
				if (head==this.snake.body[i]) destroy = true;

				if (destroy) this.DestroySnake();
				else{
				if (this.snake.way == 'E') {
					if ((head)%(this.lenX)==0) head-=this.lenX;
					snake.unshift(head+1);
				}
				if (this.snake.way == 'W') {
					if ((head-1)%this.lenX==0) head+=this.lenX;
					snake.unshift(head-1);
				}
				if (this.snake.way == 'N') {
					if ((head-this.lenX)<1) head+=(this.lenY*this.lenX);
					snake.unshift(head-this.lenX);
				}
				if (this.snake.way == 'S') {
					if ((head+this.lenX)>this.fieldArray.length) head-=(this.lenY*this.lenX);
					snake.unshift(head+this.lenX);
				}
				if ((this.snake.body[0]!=this.apple) && (this.snake.body[0]!=this.pumpkin)) snake.pop();
				else {
					if (this.snake.body[0]==this.pumpkin) { score.Increment(Math.round(5*progressbar.percent)); this.DestroyPumpkin(); }
					if (this.snake.body[0]==this.apple) { score.Increment(100); this.SetApple(); }		
				}


				document.getElementById(tail).className= "block";
				document.getElementById(snake[0]).className= "block block-selected";
				this.clock++;
			 	setTimeout(this.MoveIt,200);	
			 	} 	
		},
		SetApple:function(){
			var n = this.Rand(1, 256);
			var flag = false;
			for (var i=0; i<this.snake.body.length;i++)
			if (this.snake.body[i]==n) flag=true;
			if (!flag) this.apple = n;
			else this.SetApple();
		},
		SetPumpkin:function(){
			var n = this.Rand(1, 256);
			var flag = false;
			for (var i=0; i<this.snake.body.length;i++)
			if (this.snake.body[i]==n) flag=true;
			if (n==this.apple) flag=true;
			if (!flag) this.pumpkin = n;
			else this.SetPumpkin();
		},
		Rand: function (min, max)
		{
		    return Math.floor(Math.random()*(max-min+1)+min);
		},
		ClickTurn: function(e){
			var way = this.snake.way;
			var snake = this.snake.body;
			var snakehead = document.getElementById(snake[0]);
/*			
			if (this.snake.way=='W' || this.snake.way=='E') {
				if (e.pageY < snakehead.offsetTop) this.snake.way='N';
				else if (e.pageY > snakehead.offsetTop + snakehead.clientHeight) this.snake.way='S';
			}
			else {
				if (e.pageX < snakehead.offsetLeft) this.snake.way='W';
				else if (e.pageX > snakehead.offsetLeft + snakehead.clientWidth) this.snake.way='E';
			}
*/
			console.log(e.keyCode);
			keys.Turn(e.keyCode);
		},
		DestroySnake: function(){	
			for (var i=0; i<this.snake.body.length;i++)
				document.getElementById(this.snake.body[i]).className= "block blowed";
						
			setTimeout(()=>{
			this.fieldArray=[];
			this.snake.body = [];
			this.snake.alive = false;
			this.showMenu();
			},1000)
		},
		DestroyPumpkin:function(){
			document.getElementById(this.pumpkin).className= "block";
			this.pumpkin =- 1;
			progressbar.SleepTimer();
		},
		showMenu: function(){
			document.getElementById('winMenu').className="windowMenu showen";
			progressbar.StopTimer();
		}
	}
});

	
var keys = new Vue({
	el: '#keys',
	data:{
		currentWay: ''
	},
	computed:{
		KeyStyle:function(){
			var proportion = document.getElementById('keys').clientWidth/document.body.clientWidth*100;

			return {
				left : 50 - (proportion/2) + "%"
			}
		}
	},
	methods:{
		Turn: function(keyCode){
			switch (keyCode){
				case 119: //EN key 'w'
				case 1094: //RU key 'ц'
				this.currentWay='N';
				
				document.getElementById('w').className="key pressed";
				break;

				case 115: //EN key 's'
				case 1110: //RU key 'ы'
				case 1099: //UA key 'і'
				this.currentWay='S';

				document.getElementById('s').className="key pressed";
				break;

				case 97: //EN key 'a'
				case 1092: //RU key 'ф'
				this.currentWay='W';

				document.getElementById('a').className="key pressed";
				break;

				case 100: //EN key 'd'
				case 1074: //RU key 'в'
				this.currentWay='E';

				document.getElementById('d').className="key pressed";
				break;

				//default:
			}
				field.snake.way=this.currentWay; 
			setTimeout(()=>{this.KeyReset();},250);
		},
		KeyReset:function(){
			switch(this.currentWay){
			case 'N': document.getElementById('w').className="key"; brake;
			case 'S': document.getElementById('s').className="key"; brake;
			case 'W': document.getElementById('a').className="key"; brake;
			case 'E': document.getElementById('d').className="key"; brake;
			}
		}
	}
});

		addEventListener('keypress', field.ClickTurn);
		addEventListener('keyup', keys.KeyReset);
		//addEventListener('click', field.ClickTurn, false);
		addEventListener('touchstart', function(){}, false);
    	addEventListener('touchmove', function(){}, false);
