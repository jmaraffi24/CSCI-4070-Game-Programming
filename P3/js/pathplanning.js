/*
 * P3 Path Planning
 * pathplanning.js
 * Jacob Maraffi
 * This file contains all the javascript necessary for creating the canvases
 * setting up the algorithms and displaying instructions to the user.
 */

//Storing infomration about the canvases
var c1 = document.getElementById("canvas1");
var ctx1 = c1.getContext("2d");
var c2 = document.getElementById("canvas2");
var ctx2 = c2.getContext("2d");
var c3 = document.getElementById("canvas3");
var ctx3 = c3.getContext("2d");

//variable which determines which algorithm is being used
var algo = 1;//1 = A*

//variable which controls whether the animation is running or not
var anim = 0;//0 = animation off 1 = animation on

//variable which controls the animation speed
var animSpeed = 5;//max speed = 10 min speed = 1;

//variable which controls whether the animation may start or not
var startanim = 0;//1 = begin, either step or animation

//step variable which controls stepping through the animation
var step = 0;//1 = add 1 step then reset

//MAP VARIABLES SECTION
//default map selction
var map = 1;
//grid size
var boxSize = 100;
var wallx;
var wally;
var map1wall = [4,2,4,3,4,4,4,5];
var map2wall = [1,0,1,1,1,2,1,1,2,3,2,4,8,0,8,1,8,2,8,1,8,4,1,5,8,1,7,4,6,4,8,4,0,14,1,12,2,14,3,14,14,0,14,1,14,2,14,3,8,4,14,5,14,6,14,7,14,9,14,8,12,11,14,14,12,13,8,14,14,12,13,14,12,8,12,14,10,10,10,11,10,14,14,12,5,1,5,9,14,10,1,11,5,12,14,10,3,14,14,10,6,10,7,14,8,10];
/*var map3wall = [4,0,4,1,4,2,4,3,4,4,7,6,7,7,7,8,7,9,31,22,31,23,31,24,31,25,2,16,2,17,2,18,2,19,16,10,16,11,16,12,16,13,20,20,20,21,20,22,20,23,26,3,26,4,26,5,26,6,26,7,12,31,12,30,12,29,12,28,0,8,1,8,2,8,3,8,4,8,5,8,22,22,23,22,24,22,25,22,4,16,5,16,6,16,7,16,16,4,17,4,18,4,19,4,22,10,23,10,24,10,25,10,10,20,11,20,12,20,13,20];*/
var map3wall = [1,0,1,1,1,2,1,3,1,20,1,21,1,22,1,24,1,25,1,26,3,8,3,9,3,10,3,11,3,12,4,10,5,10,8,0,8,1,8,2,8,3,10,10,20,11,20,12,20,13,20,26,3,26,4,26,5,26,6,26,7,31,22,31,23,31,24,31,25,12,10,1,10,2,10,3,15,10,15,11,15,12,15,13,20,1,20,2,20,3,20,4,20,28,20,29,20,30,20,31];
var map4wall;

//start and end positon variables
var startx = -1;
var starty = -1;
var endx = -1;
var endy = -1;
var startEnd = 0;

//PATH VARIABLES SECTION
var currentx;
var currenty;
var prevx = -1;
var prevy = -1;
var walls;
var path1x = [];
var path1y = [];
var pathiter = 0;
var badpathx = [];
var badpathy = [];
var badpathiter = 0;
var isBad = 0;
var badnums = [];
var numSteps = 0;

//onloading the init function to the window
window.onload = init; 

//init function which runs on program execution
function init(){ 
    displayui();
    drawgrid();
    if(startanim != 1){
        requestAnimationFrame(init);
    }
    else{
        getStartEnd();
    }
}

//mousedown event handler
document.onmousedown = function(e){
    if(startEnd == 1){
        startx = e.clientX;
        starty = e.clientY
    }
    if(startEnd == 2){
        endx = e.clientX;
        endy = e.clientY;
        startEnd = 0;
    }
}

//function controls the gridsize of map1
function m1(){
    map = 1;
    boxSize = 100;
}

//function controls the gridsize of map2
function m2(){
    map = 2;
    boxSize = 50;
}

//function controls the gridsize of map3
function m3(){
    map = 3;
    boxSize = 25;
}

//function controls the gridsize of map4
function randommap(){
    map = 4;
    boxSize = 25;
    var temp = [];
    //randomly filling the grid with walls
    for(var x = 0;x < 250;x = x +2){
        temp[x] = Math.floor(Math.random() * 32);
        temp[x+1] = Math.floor(Math.random() * 32);
    }
    map4wall = temp;
}

//initialize variables based on user input
//function sets the current algorith to A*
function astar(){
    algo = 1;
}
//function begins the animation by setting anim = 1
function on(){
    anim = 1;
}
//function ends the animation by setting anim = 0
function off(){
    anim = 0;
}
//function which tells the animation it can start by setting startanim = 1
function start(){
    startanim = 1;
}

//function which controls stepping through the animation
function step1(){
    step = 1;
}

//function which controls adjusting the animation speed to be higher
function up(){
    if(animSpeed < 10){
        animSpeed += 1;
    }
}

//function which controls adjusting the animation speed to be lower
function down(){
    if(animSpeed > 1){
        animSpeed -= 1;
    }
}

//function controls displaying all UI elements not included in the HTML
function displayui(){
    //intializing the stats canvas
    ctx2.clearRect(0, 0, c2.width, c2.height);
    ctx2.beginPath();
    ctx2.rect(0, 0, c2.width, c2.height);

    //initializing the steps canvas
    ctx3.clearRect(0, 0, c3.width, c3.height);
    ctx3.beginPath();
    ctx3.rect(0, 0, c3.width, c3.height);

    //background color for stats
    ctx2.fillStyle = "darkgrey";
    ctx2.fill();

    //background color for steps
    ctx3.fillStyle = "darkgrey";
    ctx3.fill();

    //font for stats
    ctx2.fillStyle = "black";
    ctx2.font = "20px Arial";

    //font for steps
    ctx3.fillStyle = "black";
    ctx3.font = "12px Arial";

    //string instantiation for stats
    var algoStr;
    var animStr = "Animation: Start-to-Finish";
    var speedStr = "Animation Speed: " + animSpeed.toString();
    var mapStr = "Map Selected: Random";
    var cellStr = "Grid Size: " + ((800/boxSize)*(800/boxSize)).toString();

    if(map == 1 || map == 2 || map == 3){
        mapStr = "Map Selected: " + map.toString();
    }
    if(algo == 1){
        algoStr = "Current Algorithm: A*";
    }
    if(anim == 0){
        animStr = "Animation: Step Through";
    }

    //writing the stats to the canvas
    ctx2.fillText(algoStr,10,20);
    ctx2.fillText(animStr,10,50);
    ctx2.fillText(speedStr,10,80);
    ctx2.fillText(mapStr,10,110);
    ctx2.fillText(cellStr,10,140);

    //writing the steps to the canvas
    ctx3.fillText("Steps to run the algorithm:", 10, 40);
    ctx3.fillText("1. Press A*",10,60)
    ctx3.fillText("2. Adjust Animation Speed (start-to-finish)",10,80)
    ctx3.fillText("3. Choose a Map under Map Selection",10,100)
    ctx3.fillText("4. Press Start",10,120)
    ctx3.fillText("5. Place down start (1st click) and end (2nd click)",10,140)
    ctx3.fillText("6. Click step until tile is found (step through)",10,160)
}

//function which handles drawing the grid
function drawgrid(){
    ctx1.clearRect(0, 0, c1.width, c1.height);
    if(map == 1){
        walls = map1wall;
    }
    else if(map == 2){
        walls = map2wall;
    }
    else if(map == 3){
        walls = map3wall;
    }
    else if(map == 4){
        walls = map4wall;
    }
    for(var i = boxSize;i < c1.width; i = i + boxSize){
        ctx1.beginPath();
        ctx1.strokeStyle = "black";
        ctx1.moveTo(i, 0);
        ctx1.lineTo(i, c1.height);
        ctx1.stroke()
        ctx1.moveTo(0, i);
        ctx1.lineTo(c1.width, i);
        ctx1.stroke()
    }

    //for loop which controls the rendering of all walls in the grid
    for(var j = 0; j < walls.length; j = j + 2){
        ctx1.beginPath();
        ctx1.fillStyle = "darkred";
        ctx1.rect(walls[j]*boxSize, walls[j+1]*boxSize, boxSize, boxSize);
        ctx1.fill();

        ctx1.beginPath();
        ctx1.strokeStyle = "black";
        ctx1.moveTo(walls[j]*boxSize, walls[j+1]*boxSize);
        ctx1.lineTo(walls[j]*boxSize+boxSize, walls[j+1]*boxSize);
        ctx1.stroke();

        ctx1.beginPath();
        ctx1.strokeStyle = "black";
        ctx1.moveTo(walls[j]*boxSize, walls[j+1]*boxSize+(boxSize/2));
        ctx1.lineTo(walls[j]*boxSize+boxSize, walls[j+1]*boxSize+(boxSize/2));
        ctx1.stroke();

        ctx1.beginPath();
        ctx1.strokeStyle = "black";
        ctx1.moveTo(walls[j]*boxSize+(boxSize/2), walls[j+1]*boxSize);
        ctx1.lineTo(walls[j]*boxSize+(boxSize/2), walls[j+1]*boxSize+boxSize);
        ctx1.stroke();

    }
}

//function which controls drawing the start and end points
function drawPts(x,y,z,t){
    ctx1.beginPath();
    var temp1;
    var temp2;
    if(z == 0){
        ctx1.fillStyle = "green";
    }
    else{
        ctx1.fillStyle = "red";
    }
    if(t == 0){
        temp1 = 0;
        temp2 = 1 * Math.PI;
    }
    else{
        temp1 = 1 * Math.PI;
        temp2 = 2 * Math.PI
    }

    ctx1.rect(x, y, boxSize, boxSize);     
    ctx1.fill();
}

//function which controls the location of start and end points and passing to animation function
function getStartEnd(){
    if(startx == -1){
        startEnd = 1;
    }
    if(startx != -1 && endx == -1){
        startx = (Math.floor(startx/boxSize))*boxSize;
        starty = (Math.floor(starty/boxSize))*boxSize;
        drawPts(startx, starty, 0, 1);
        startEnd = 2;
    }

    if(startx != -1 && endx != -1){
        endx = (Math.floor(endx/boxSize))*boxSize;
        endy = (Math.floor(endy/boxSize))*boxSize;
        drawPts(endx, endy, 1, 1);
        currentx = startx;
        currenty = starty;
        animate();
    }
    else{
        requestAnimationFrame(getStartEnd);
    }
}

//animation function which executes the a* algorithm
function animate(){
    if(step == 1 || anim == 1){
        step = 0;
        //array initialization
        var arrayx = [];
        var arrayy = [];
        var arrayok = [];
        var arrayf = [];
        var arrayg = [];
        var arrayh = [];
        var next = 999;
        var nextiter;
        arrayx[0] = currentx - boxSize;
        arrayy[0] = currenty - boxSize;

        arrayx[1] = currentx;
        arrayy[1] = currenty - boxSize;

        arrayx[2] = currentx + boxSize;
        arrayy[2] = currenty - boxSize;

        arrayx[3] = currentx - boxSize;
        arrayy[3] = currenty;

        arrayx[4] = currentx + boxSize;
        arrayy[4] = currenty;

        arrayx[5] = currentx - boxSize;
        arrayy[5] = currenty + boxSize;

        arrayx[6] = currentx;
        arrayy[6] = currenty + boxSize;

        arrayx[7] = currentx + boxSize;
        arrayy[7] = currenty + boxSize;

        for(var i = 0; i < arrayx.length;i++){

            if( (arrayx[i]) < 0 || (arrayx[i]) > (800 - boxSize) || (arrayy[i]) < 0 || (arrayy[i]) > (800 - boxSize)){
                arrayok[i] = 0;
            }
            else{
                arrayok[i] = 1;
            }
            for(var j = 0;j < walls.length; j = j + 2){
                if( (walls[j]*boxSize) == arrayx[i] && (walls[j+1]*boxSize) == arrayy[i] ){
                    arrayok[i] = 0;
                }
            }
            if(arrayx[i] == startx && arrayy[i] == starty){
                arrayok[i] = 0;
            }
        }

        for(var k = 0; k < arrayok.length;k++){
            if(arrayok[k] == 1){
                ctx1.beginPath();
                ctx1.lineWidth = "4";
                ctx1.strokeStyle = "darkblue";
                ctx1.rect(arrayx[k], arrayy[k], boxSize, boxSize);
                ctx1.stroke();

                if(arrayx[k] == currentx || arrayy[k] == currenty){
                    arrayg[k] = 10;
                }
                else{
                    arrayg[k] = 14;
                }

                arrayh[k] = (Math.abs((arrayx[k]-endx)/boxSize) + Math.abs((arrayy[k]-endy)/boxSize))*10;
                arrayf[k] = arrayg[k] + arrayh[k];
                if(arrayf[k] < next){
                    if(arrayx[k] == prevx && arrayy[k] == prevy){
                        badpathx[badpathiter] = arrayx[k];
                        badpathy[badpathiter] = arrayy[k];
                        badpathiter += 1;
                    }
                    else{
                        for(var q = 0; q < badpathx.length;q += 1){
                            if(arrayx[k] == badpathx[q] && arrayy[k] == badpathy[q]){
                                isBad = 1;

                            }
                        }
                        if(isBad == 1){
                            isBad = 0;
                        }
                        else{
                            next = arrayf[k];
                            nextiter = k;
                        }
                    }
                }
            }
            else{
                arrayf[k] = 0; 
                arrayg[k] = 0;
                arrayh[k] = 0;
                arrayok[k] = 0;
            }

            if(map == 1 || map == 2 && arrayf[k] != 0){
                ctx1.font = "12px Arial";
                ctx1.fillStyle = "black"
                ctx1.fillText(arrayf[k].toString(), arrayx[k]+8, arrayy[k]+15);
                ctx1.fillText(arrayg[k].toString(), arrayx[k]+8, arrayy[k]+boxSize-12);
                ctx1.fillText(arrayh[k].toString(), arrayx[k]+boxSize-15, arrayy[k]+boxSize-12);
            }
        }

        prevx = currentx;
        prevy = currenty;
        currentx = arrayx[nextiter];
        currenty = arrayy[nextiter];
        //drawing a green square around the current node
        ctx1.beginPath();
        ctx1.lineWidth = "4";
        ctx1.strokeStyle = "green";
        ctx1.strokeRect(currentx, currenty, boxSize, boxSize);
        //drawing a red circle inside of the already stepped node
        ctx1.strokeStyle = "red";
        ctx1.arc(currentx+(boxSize/2), currenty+(boxSize/2), boxSize/8, 0, 2 * Math.PI);
        ctx1.stroke();

        path1x[pathiter] = currentx;
        path1y[pathiter] = currenty;
        pathiter += 1;

        if(anim == 1){
            for(var w = 0;w < 10000;w++){

            }
            animate();
        }
        else{
            animate();
        }

    }
    else if(currentx == endx && currenty == endy){
        finished();
    }
    else{
        requestAnimationFrame(animate);
    }
}

//finished function which executes when the tile is found and displays the number of steps
function finished(){
    drawPts(startx, starty, 0, 0);
    drawPts(endx, endy, 1, 0);
    var flip = 0;
    for(var i = 0; i < path1x.length;i++){
        for(var j = 0;j < badpathx.length;j++){
            if(badpathx[j] == path1x[i] && badpathy[j] == path1y[i]){
                flip = 1;
            }
        }
        if(flip == 1){
            flip = 0;
            badnums[i] = 1;
        }
        else{
            badnums[i] = 0;
        }
    }

    for(var t = 0;t < path1x.length;t++){
        numSteps += 1;
    }
    
    var str = "Total Number of Steps: " + numSteps.toString();
    ctx2.font = "20px Arial";
    ctx2.fillText(str, 10, 170);

}





























