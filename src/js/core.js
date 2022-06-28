let maxLevel = 5;
let width = col = 8;
let height = row = 8;
let AllCubeDataArr = [];
let score = 0;
let blackArr = [19, 20, 21, 27, 28, 29];
let startArr = [0, 1, 2, 8, 9, 10];
let endArr = [63, 62, 61, 55, 54, 53];
let moveArr = [0, 1, 2, 8, 9, 10];
let moveArrTemp = [];
let levelNoArr = [];
let currentLevel = 0;
let currentLeveIndex = 0;
let up=0,down=1,left=2,right=3;
let stepHistory=[];
let currentStep=0;
let maxStep = 0;
let flagPlayback = false;
let directionMap = {0:"上",1:"下",2:"左",3:"右"};
let start = {
	x: 0,
	y: 0
}
let end = {
	x: 0,
	y: 0
}
$(document).ready(function() {
	newGame()
});
document.addEventListener('touchstart',
function(event) {
	start.x = event.touches[0].pageX;
	start.y = event.touches[0].pageY
});
document.addEventListener('touchmove',
function(event) {
	event.preventDefault()
},
{
	passive: false
});
document.addEventListener('touchend',
function(event) {
	end.x = event.changedTouches[0].pageX;
	end.y = event.changedTouches[0].pageY;
	var deltaX = end.x - start.x;
	var deltaY = end.y - start.y;
	if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
		return
	}
	if (Math.abs(deltaX) >= Math.abs(deltaY)) {
		if (deltaX > 0) {
			KeyHanderRight()
		} else {
			KeyHanderLeft()
		}
	} else {
		if (deltaY > 0) {
			KeyHanderDown()
		} else {
			KeyHanderUp()
		}
	}
	drawRefreshUI()
});
document.onkeydown = function() {

	var currKey = event.keyCode || event.which || event.charCode;
	var keyName = String.fromCharCode(currKey);
	switch (currKey) {
	case 119:
	case 87:
	case 38:
		KeyHanderUp();
		break;
	case 115:
	case 83:
	case 40:
		KeyHanderDown();
		break;
	case 97:
	case 65:
	case 37:
		KeyHanderLeft();
		break;
	case 100:
	case 68:
	case 39:
		KeyHanderRight();
		break
	}
	drawRefreshUI()
};
function collisionDetection(pos) {
	if (blackArr.indexOf(pos) > -1) {
		return true
	} else if (moveArrTemp.indexOf(pos) > -1) {
		return true
	} else {
		return false
	}
}
function getNextPos(pos, op) {
	let ret = pos;
	let i = 0;
	if (op == up) {
		for (i = 1; i < 8; i++) {
			let retNext = pos - 8 * i;
			if (retNext < 0) {
				break
			}
			if (!collisionDetection(retNext)) {
				ret = retNext
			} else {
				break
			}
		}
	} else if (op == down) {
		for (i = 1; i < 8; i++) {
			let retNext = pos + 8 * i;
			if (retNext > 63) {
				break
			}
			if (!collisionDetection(retNext)) {
				ret = retNext
			} else {
				break
			}
		}
	} else if (op == left) {
		for (i = 1; i < 8; i++) {
			let retNext = pos - i;
			if ((retNext + 8) % 8 == 7) {
				break
			}
			if (!collisionDetection(retNext)) {
				ret = retNext
			} else {
				break
			}
		}
	} else if (op == right) {
		for (i = 1; i < 8; i++) {
			let retNext = pos + i;
			if (retNext % 8 == 0) {
				break
			}
			if (!collisionDetection(retNext)) {
				ret = retNext
			} else {
				break
			}
		}
	} else {
		console.log("warn:collisionDetection")
	}
	console.log("debug" + op + ":" + pos + "->" + ret);
	return ret
}
function i2ij() {
	for (let k = 0; k < moveArr.length; k++) {
		let eleOld = moveArr[k];
		let i = Math.floor(eleOld / 8);
		let j = eleOld % 8;
		AllCubeDataArr[i][j] = 0
	}
	for (let k = 0; k < moveArrTemp.length; k++) {
		let eleNew = moveArrTemp[k];
		let i2 = Math.floor(eleNew / 8);
		let j2 = eleNew % 8;
		AllCubeDataArr[i2][j2] = 1
	}
	moveArr = [].concat(moveArrTemp);
}
function sort(moveArr) {
	moveArr.sort(function(i, j) {
		return i - j
	})
}
function sortDesc(moveArr) {
	moveArr.sort(function(i, j) {
		return j - i
	})
}

function CheckPosIsNotSame(arr1,arr2){
	if (arr1.join("") != arr2.join("")) {
		return true;
	}
	return false;
}

function DealWithAfterMove(directionType){
	let isNeed = CheckPosIsNotSame(moveArr,moveArrTemp);
	if(isNeed){
		console.log(directionType);
		i2ij();
		if(!flagPlayback){
			//非回放有效
			addStep(directionType);
		}		
	}
		console.log("direction has been in the bound:"+directionType);
}

function  DealWithBeforeMove(directionType){
	if(directionType == up || directionType == left){
		sort(moveArr);
	}else{
		//down,right
		sortDesc(moveArr);
	}

	for (let i = 0; i < moveArr.length; i++) {
		let val = moveArr[i];
		let val2 = getNextPos(val, directionType);
		moveArrTemp[i] = val2;
	}
}

function DealWithMove(direction){
	DealWithBeforeMove(direction);
	DealWithAfterMove(direction);
}

function KeyHanderUp() {
	if(flagPlayback){
		showStatus("已完成，不能再操作","orange");
		return;
	}
	DealWithMove(up);
}
function KeyHanderDown() {
	if(flagPlayback){
		showStatus("已完成，不能再操作","orange");
		return;
	}
	DealWithMove(down);
}
function KeyHanderLeft() {
	if(flagPlayback){
		showStatus("已完成，不能再操作","orange");
		return;
	}
	DealWithMove(left);
}
function KeyHanderRight() {
	if(flagPlayback){
		showStatus("已完成，不能再操作","orange");
		return;
	}
	DealWithMove(right);
}

function addStep(direction) {
	currentStep++;
	maxStep= currentStep;
	stepHistory.push(direction);
	//存储当前moveArr状态
	setItem(genKey(currentStep),[].concat(moveArr));
	score++;
	showScore();
	showStatus("移动方向："+directionMap[direction],"gray");
}
function addStepPlayback(step) {
	if(step == 1){
		currentStep++;
		if(currentStep>=maxStep){
			currentStep = maxStep;
			showStatus("已达到最后的步数","orange");
		}else{
			showStatus("向后一步","red");	
		}		
	}else if(step == -1){
		currentStep--;
		if(currentStep<=0){
			currentStep = 0;
			showStatus("已达到第0步数","orange");
		}else{
			showStatus("向前一步","blue");
		}		
	}else{
		currentStep = step;
		score=step;
		if(currentStep ==0){
			showStatus("跳转到第0步","orange");
		}else{
			showStatus("跳转到最后一步","orange");
		}
	}

	score = currentStep;
	showScore();
}

function getNumberBackgroundColor(number) {
	if (number == 1) {
		return '#11aa11'
	} else if (number == 9) {
		return 'black'
	}else if (number == -2) {
		//缝隙
		return '#aabbcc';
	}
	return '#ccc0b3';
}
function setNumberCellStyle(obj, num) {
	obj.css("background-color", getNumberBackgroundColor(num))
}
function setEndCellStyle(obj) {
	obj.css("background-color", "white").css("border", "1px solid black")
}
function setStartOnEndCellStyle(obj) {
	obj.css("background-color", "orange").css("border", "1px solid #11aa11")
}


setTimeout(() =>initOnce(), 500);

function initUI() {
	drawMainUI();
	showScore();
	drawRefreshUI();
}
function initOnce() {
	levelNoArr = getLevelNoList();
	maxLevel = levelNoArr.length - 1;
	drawOptions();
}
function initData() {
	score = 0;
	resetTableData();
	currentLevel = getLevel(currentLeveIndex);
	let marker = getMarkerMap(currentLevel);
	InitThreeArr(marker);
	InitAllCubeDataArr();
	stepHistory=[];
	flagPlayback = false;
	endArr.sort();

	clear();
	//初始化时的布局
	setItem(genKey(currentStep),[].concat(moveArr));
}
function refreshData(){
	moveArrTemp = [];
}

function drawOptions() {
	let html = '';
	for (let i = 0; i < levelNoArr.length; i++) {
		let ele = levelNoArr[i];
		let item = '<option value="' + i + '">Level ' + ele + '</option>';
		html += item
	}
	$("#changeLevel").html(html)
}
function resetTableData() {
	$("table td").html("")
}
function newGame() {
	initData();
	initUI();
}

function gameSuccess() {
	maxStep = currentStep;
	flagPlayback = true;
	// setTimeout(() =>alert("congraducation!, your steps is " + maxStep), 100);
	showStatus("恭喜您成功通过该关卡","green",true);
	return
}
function checkGameOver() {
	let flag = true;
	sort(moveArr);
	for (let i = 0; i < endArr.length; i++) {
		if (endArr[i] != moveArr[i]) {
			flag = false;
			break;
		}
	}
	if (flag) {
		gameSuccess();
	}
}
function drawRefreshUI() {
	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			let eleVal = AllCubeDataArr[i][j];
			let data = "<span class='number-cell'></span>";
			setNumberCellStyle($("#mtd_" + (i * width + j)), eleVal);
			if (endArr.indexOf(i * row + j) > -1 ) {
				//仅仅只有目标方块
				if(moveArr.indexOf(i * row + j) == -1){
					setEndCellStyle($("#mtd_" + (i * width + j)));
				}else{
				// if(moveArr.indexOf(i * row + j) > -1){
					////移动方块和目标方块有重叠部分
					setStartOnEndCellStyle($("#mtd_" + (i * width + j)));
				}
			}
			$("#mtd_" + (i * width + j)).html(data);
		}
	}
	$('.grid-cell').css('width', '20px');
	$('.grid-cell').css('height', '20px');

	refreshData();
	if(!flagPlayback){
		checkGameOver();
	}
}
function drawMainUI() {
	$("#grid-container").html("");
	var table = $("<table>").appendTo($("#grid-container"));
	for (var i = 0; i < col; i++) {
		var rowData = $("<tr>").appendTo(table);
		for (var j = 0; j < row; j++) {
			$("<td id=mtd_" + (i * width + j) + " class='grid-cell'></td>").appendTo(rowData);
			setNumberCellStyle($("#mtd_" + (i * width + j)), -2);
		}
	}
	$('.grid-cell').css('width', '20px');
	$('.grid-cell').css('height', '20px');
}
function getRandNumInit() {
	return Math.random(1) > 0.5 ? 2 : 4
}
function getRandNum(size) {
	return Math.floor(Math.random(1) * size)
}
function InitThreeArr(marker) {
	blackArr = marker["black"];
	startArr = marker["start"];
	endArr = marker["end"];
	moveArr = [].concat(marker["start"])
}
function InitAllCubeDataArr() {
	for (var j = width - 1; j >= 0; j--) {
		AllCubeDataArr[j] = new Array([0]);
		for (var i = height - 1; i >= 0; i--) {
			let num = j * col + i;
			if (blackArr.indexOf(num) > -1) {
				AllCubeDataArr[j][i] = 9
			} else if (startArr.indexOf(num) > -1) {
				AllCubeDataArr[j][i] = 1
			} else if (endArr.indexOf(num) > -1) {
				AllCubeDataArr[j][i] = 2
			} else {
				AllCubeDataArr[j][i] = 0
			}
		}
	}
}
function printAllCubeDataArr() {
	var content = "";
	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			content += (" " + AllCubeDataArr[j][i])
		}
		console.log("row=" + j + ":" + content + "\n");
		content = "";
	}
}
function showScore() {
	$("#score").text(score)
}
function changeLevel() {
	currentLeveIndex = $("#changeLevel").val();
	currentLevel = +getLevel(currentLeveIndex);
	console.log("changeLevelIndex->" + currentLeveIndex);
	console.log("changeLevel->" + currentLevel);
}
function getLevel(index) {
	return levelNoArr[index]
}
function changeLevelManual(nextFlag) {
	if (nextFlag == 1) {
		if (currentLeveIndex == maxLevel) {
			alert("no next level");
			return
		}
		currentLeveIndex = Number(currentLeveIndex) + 1
	} else if (nextFlag == -1) {
		if (currentLeveIndex == 0) {
			alert("no previous level");
			return
		}
		currentLeveIndex = Number(currentLeveIndex) - 1
	} else if (nextFlag == 0) {

	} else {
		currentLeveIndex = "0";
		console.log("error nextFlag=" + nextFlag)
	}
	console.log("changeLevelManual->" + currentLeveIndex);
	$("#changeLevel").val(currentLeveIndex);
	newGame()
}

//2022-6--27 todo@fanbi 回放不是简单的逆过程，待开发。
function changeStepForPlayback(nextFlag) {
	//nextFlag 1,7,8,-1 第一步，七上八下，倒数第一步
	let op=0;
	if (nextFlag == 0) {
		addStepPlayback(0);
		getItem(genKey(0));
	} else if (nextFlag == 7) {
		addStepPlayback(-1);	
		 getItem(genKey(currentStep));	
	} else if (nextFlag == 8) {
		addStepPlayback(1);
		 getItem(genKey(currentStep));		
	} else if (nextFlag == -1){
		addStepPlayback(maxStep);
		getItem(genKey(maxStep));
	}

	console.log("debug changeStepForPlayback op="+op);
	i2ij();
	drawRefreshUI();
}

function genKey(step){
	let key = "app.jiwen.playback."+currentLeveIndex+"."+step;
	return key;
}

//回放数据
function setItem(key,val){
	sessionStorage.setItem(key,JSON.stringify(val));
}

function getItem(key){
	//拿回的值放置moveArrTemp
	let moveArrStr = sessionStorage.getItem(key);
	if(moveArrStr!=null){
		moveArrTemp = JSON.parse(moveArrStr);
	}
}

function clear(key){
	sessionStorage.clear();
}

function showStatus(msg,color,flagTip2){
	// let time;
     $("#tip").text(msg).css("color",color);
     // setTimeout(()=>{
     //      $("#tip").text("准备就绪").css("color","black");
     //    //   if(flagTip2){
     //    //  	 clearInterval(time);
     //    //   	$("#tip2").text("");
     //  	 // }
     // },4200);

   //    if(flagTip2){
   // 		 let seconds = 3;
   //  	 time=  setInterval(()=>{
   // 		 $("#tip2").text("	倒计时："+ seconds--).css("color","gray");
   // },1000);
    // }
}

function prepareForMobile() {
	let documentWidth = window.screen.availWidth;
	let gridContainerWidth = 0.92 * documentWidth * width / 4;
	let cellSideLength = 0.18 * documentWidth;
	let cellSpace = 0.04 * documentWidth;
	if (documentWidth > 500) {
		gridContainerWidth = 500 * width / 4;
		cellSpace = 20;
		cellSideLength = 100
	}
	$('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength)
}