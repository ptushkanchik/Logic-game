function Game(option){
	var game = option;
	var coordsEmpty;//координаты пустой ячейки
//координаты центра пустой ¤чейки
	var coordsEmptyCenterX;
	var coordsEmptyCenterY;
	
	var topElem, bottomElem, leftElem, rightElem;//переменные дл¤ элементов расположенных вокруг пустой ¤чейки
	var empty;// переменна¤ дл¤ пустой ¤чейки
	var randomNumber;//случайное число дл¤ функции moveRandomElement
	var coordsTarget;//координаты передвигаемой игроком ¤чейки
	var aroundEmpty;//коллекци¤ элементов расположенных вокруг пустой ¤чейки (дл¤ функции moveRandomElement)
	var coordsRandom;//координаты случайно выбранного дл¤ перемещени¤ элемента (дл¤ функции moveRandomElement)
	var self = this;//лексическое окружение
	var count = 50;//количество ходов выполненных программой при перемешивании фишек
	var mode = "";//переменна¤ дл¤ хранени¤ последовательности цифр в пор¤дке фишек
	var collectionDIV = $("td:lt(16)");//переменна¤ дл¤ коллекции играющих ¤чеек таблицы
	var collectionRadio = $(":radio");//переменна¤ дл¤ коллекции радиокнопок 
	
	function getEmpty(){
		var collection = game.querySelectorAll("td");
		for(var i=0;i<18;i++){
			if(collection[i].childNodes.length==0){
				collection[i].className = "empty";
				empty = collection[i];
			}
		}
		coordsEmpty = empty.getBoundingClientRect();
		coordsEmptyCenterY = coordsEmpty.top + empty.offsetHeight/2;
		coordsEmptyCenterX = coordsEmpty.left + empty.offsetWidth/2;	
	}
	
	function findAround(){
		topElem = document.elementFromPoint(coordsEmptyCenterX, (coordsEmptyCenterY-100));
		bottomElem = document.elementFromPoint(coordsEmptyCenterX,(coordsEmptyCenterY + 100));
		leftElem = document.elementFromPoint((coordsEmptyCenterX - 100), coordsEmptyCenterY);
		rightElem = document.elementFromPoint((coordsEmptyCenterX + 100), coordsEmptyCenterY);
	
		if(empty!=game.querySelectorAll("td")[17]){	
			if(topElem!=null && topElem.classList.contains("playing") && topElem.classList.contains("random")==false)topElem.classList.add("around");
			if(bottomElem!=null && bottomElem.classList.contains("playing") && bottomElem.classList.contains("random")==false)bottomElem.classList.add("around");
			if(leftElem!=null && leftElem.classList.contains("playing") && leftElem.classList.contains("random")==false)leftElem.classList.add("around");
			if(rightElem!=null && rightElem.classList.contains("playing") && rightElem.classList.contains("random")==false)rightElem.classList.add("around");
		}else{
			topElem.classList.add("around");
		}
		if(game.querySelector(".random")){
			game.querySelector(".random").classList.remove("random");
		}
	}
	
	function move(target, time){
		if(target.classList.contains("around")){
			coordsTarget = target.getBoundingClientRect();
			$(target).css({position:"absolute",
							top:coordsTarget.top + "px",
							left:coordsTarget.left + "px"}).animate({top:coordsEmpty.top + "px",
																	left:coordsEmpty.left + "px"},time).appendTo($(empty));
			setTimeout(function(){
				$(target).css("position","");
			},time);
			
			$(empty).append(target).removeClass("empty");
			
		}
		$(".around").removeClass("around");
	}
	
	function moveRandomElement(){
		aroundEmpty = game.querySelectorAll(".around");
		randomNumber = (aroundEmpty.length>1)? Math.floor(Math.random()*aroundEmpty.length):0;
		aroundEmpty[randomNumber].classList.add("random");
		move(aroundEmpty[randomNumber], 50);
		setTimeout(function(){			
			aroundEmpty.length = 0;
			if(count!=0){
			count--;
			self.mix();
			}
			},50);
		}
		
	function check(){
	//соберем коллекцию 16 первых ¤чеек таблицы
	//проверим их на наличие потомков
	//если есть потомки - в переменную mode добавим текст из потомка
	//соберем коллекцию элементов radio, найдем пор¤дковый номер элемента со свойством checked
	//проверим значение mode на соответствие варианту выбранного элемента radio
	//если соответствует - выведем сообщение о успехе
		mode = "";
		var numberRadio;
		for(var i=0;i<collectionDIV.length;i++){
			if(collectionDIV[i].children.length==0){
				continue;
			}
			mode += collectionDIV[i].children[0].innerHTML;			
		}
		
		for(var i=0;i<collectionRadio.length;i++){
			if(collectionRadio[i].checked==true){
				numberRadio=i;
			}
		}
	
		switch(numberRadio){
			case 0:
				if(mode == "12345678910111213141516"){
					showWin();
				};
				break;
			case 1:
				if(mode == "12348765910111216151413"){
					showWin();
				};
				break;
			case 2:
				if(mode == "15913261014371115481216"){
					showWin();
				};
				break;
			case 3:
				if(mode == "18916271015361114451213"){
					showWin();
				};
				break;
			case 4:
				if(mode == "12341213145111615610987"){
					showWin();
				};
				break;
			case 5:
				if(mode == "11211102131693141584567"){
					showWin();
				};
				break;
		}
		
	}

	function showWin(){
		$(".control_mix, .control_mode, .control_info").attr("disabled", true);
		var coordsGame = game.getBoundingClientRect();
		$(".win").css({position:"absolute",
			top:coordsGame.top + 35 + "px",
			left:coordsGame.left - 70 + "px",
			display:"block"
		});
	}
	
	this.onmousedown = function(){
		return false;
	}
	
	this.start = function(target){
		getEmpty();
		findAround();
		move(target, 300);
        setTimeout(check, 300);		
	}
	
	this.mix = function(target){
		getEmpty();
		findAround();
		moveRandomElement();
	}
			
	this.restart = function(){
	//если есть картинка "Собрано!" - удалить ее и разблокировать кнопки "Перемешать","Об игре","Порядок"
		$(".win").css("display","none");
		$(".control_mix, .control_mode, .control_info").removeAttr("disabled");
	//удалим все div с классом playing
	//d играющие ¤чейки таблицы заново поместим блоки div с классом playing
	//найдем пор¤дковый номер радиокнопки со свойством checked в коллекции
	//в зависимости от номера радиокнопки с checked создадим массив цифр в том или ином пор¤дке
	//запишем цифры из массива по очереди в div  с классом playing и обновим счетчик перемещений count
		$(".playing").remove();
		$("td:lt(16)").append("<div class='playing'></div>");
		var collectionPlaying = game.querySelectorAll(".playing");
		var randomNumber;
		for(var i=0;i<collectionRadio.length;i++){
			if(collectionRadio[i].checked==true){
				randomNumber = i;
			}
		}
		var arr = [];
		
		switch(randomNumber){
			case 0:
				arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
				break;
			case 1:
				arr = [1,2,3,4,8,7,6,5,9,10,11,12,16,15,14,13];
				break;
			case 2:
			    arr = [1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16];
				break;
			case 3:
				arr = [1,8,9,16,2,7,10,15,3,6,11,14,4,5,12,13];
				break;
			case 4:
				arr = [1,2,3,4,12,13,14,5,11,16,15,6,10,9,8,7];
				break;
			case 5:
				arr = [1,12,11,10,2,13,16,9,3,14,15,8,4,5,6,7];
				break;
						
		}
		
		for(var i=0;i<16;i++){
			collectionPlaying[i].innerHTML = arr[i];
		}
		count=50;
	}
	
	this.showInfo = function(){
		$(".button").attr("disabled", true);
		var coordsGame = game.getBoundingClientRect();
		$(".information").css({position:"absolute",
							   top:coordsGame.top + 20 + "px",
							   left:coordsGame.left + 20 + "px",
							   display:"block"
							   });
		
	}
	
	this.hideInfo = function(){
		$(".button").removeAttr("disabled");
		$(".information").css("display","");
	}
	
	this.showMode = function(){
		$(".button").attr("disabled", true);
		var coordsGame = game.getBoundingClientRect();
		$(".mode").css({position:"absolute",
							   top:coordsGame.top + 20 + "px",
							   left:coordsGame.left + 20 + "px",
							   display:"block"
							   });
		}
	
	this.hideMode = function(){
		$(".button").removeAttr("disabled");
		$(".mode").css("display","");
	}
	

	
	game.onclick = function(event){
		if(event.target.classList.contains("playing")){
		    self.start(event.target);
			}
	}
	
	
}


var game = new Game(document.getElementById("game"));