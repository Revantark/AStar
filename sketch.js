
var openList = new Array();
var closedlist = [];
let rows;
let cols;
var drawBlocks = false;
let blockedPath = [];
const side = 15;
let bgColor;
let pathColor;
let blockColor;
let openListColor;
let selectStart = true;
let selectEnd = false;
let selectBlockPath = false;
let endPath = [];
let end;
let noSol = false;
let start;
let insructions;  
function setup() {
  bgColor = color("#252a34");
  pathColor = color('#ee6f57');
  blockColor = color('#ff2e63');
  openListColor = color('#08d9d6');
  cols = floor(windowWidth / side);
  rows = floor(windowHeight / side);
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      strokeWeight(0.03);
      stroke(color('#ff8260'));
      fill(bgColor);
      rect(i * side, j * side, side, side)
    }
  }
  instructions = createP('Select a starting point'); 
  instructions.position(windowWidth-350,0,);   
  instructions.style('font-size', '32px');
  instructions.style('color', '#eaeaea');

  noLoop();
}
function windowResized() {
  location.reload();
}
function keyPressed() {
  if (keyCode === 83) { //S
    noSol = true;
    instructions.html('Press R to reload and start again');

    openList.push(start);
  }
  else if(keyCode === 82){//R

    location.reload();

  }
}

function draw() {
  instructions.show();
  if (drawBlocks) {
    var x = Math.floor(mouseX / side);
    var y = Math.floor(mouseY / side);
    let p = new Point(x, y);
    if (x <= cols - 1 && y <= rows - 1){
      let pp = blockedPath.find((ele) => {
        return p.x == ele.x && p.y == ele.y;
      });
      let isStart = (x==start.x && y==start.y);
      let isEnd = (x==end.x && y==end.y);

      if (pp==undefined && p!=end && !isStart && !isEnd)
        blockedPath.push(p);
    }
      
  }

  for (let block of blockedPath) {
    fill(blockColor);
    noStroke();
    rect(block.x * side, block.y * side, side, side);
  }


  if (openList.length > 0) {
    var curr = removeHighestPriority();
    closedlist.push(curr);
    if (curr.x == end.x && curr.y == end.y) {
      var t = curr;
      while(t.previous){
        endPath.push(t.previous);
        t = t.previous;
      }
      noLoop();
    }
    
      let neighbours = curr.addNeighbours();
      for (let i = 0; i < neighbours.length; i++) {
        let cp = closedlist.find((p) => {
          return neighbours[i].x == p.x && neighbours[i].y == p.y;
        });
        
        if (cp==undefined) {
          let tg = curr.g + 1;
          if (tg < neighbours[i].g) {
            neighbours[i].previous = curr;
            neighbours[i].g = tg;
            neighbours[i].h = abs(neighbours[i].x - end.x) + abs(neighbours[i].y - end.y);
            neighbours[i].f = neighbours[i].h + neighbours[i].g;

          }
          let op = openList.find((p) => {
            return neighbours[i].x == p.x && neighbours[i].y == p.y;
          }); 
          if (op == undefined) {
            openList.push(neighbours[i]);
          }
        }


      }
    
  }
  else{
    if(noSol)
    {
    instructions.html("No solution found");
    instructions.html('<br>Press R to reload',true);
    print("No Solution");
    noLoop();
    }
  }
  for (var i = 0; i < openList.length; i++) {

    fill(openListColor);
    noStroke();
    square(openList[i].x * side, openList[i].y * side, side);
  }
  for (var i = 0; i < closedlist.length; i++) {
    fill(pathColor);
    noStroke();
    square(closedlist[i].x * side, closedlist[i].y * side, side);
  }

  for(let ep of endPath){
    fill(color('#eaeaea'));
    noStroke();
    square(ep.x * side, ep.y * side, side);
  }
  

  if (!selectStart) {
    fill(color('#90DF7B'));
    noStroke();
    square(start.x * side, start.y * side, side);

  }

  if (!selectStart && !selectEnd) {
    fill(color('#506CF7'));
    noStroke();

    square(end.x * side, end.y * side, side);
  }
 

  

  //text('Select a start point', floor(windowWidth/2), 30      ,);



}

function mousePressed() {
  if (selectStart) {
    var x = Math.floor(mouseX / side);
    var y = Math.floor(mouseY / side);
    if (x <= cols - 1 && y <= rows - 1) {
      start = new Point(x, y);
      start.g = 0;
      start.f = 0;
      start.h = 0;
      selectStart = false;
      selectEnd = true;
      instructions.html('Select an end point');
      
      redraw();
      fill(color('#90DF7B'));
      noStroke();
      square(start.x * side, start.y * side, side);
    }

  }
  else if (selectEnd) {
    var x = Math.floor(mouseX / side);
    var y = Math.floor(mouseY / side);
    if (x <= cols - 1 && y <= rows - 1) {
      end = new Point(x, y);
      end.g = 0;
      end.f = 0;
      end.h = 0;
      selectEnd = false;
      selectBlockPath = true;
      
      instructions.html('Click and draw obstacles and Press S to start');
      redraw();
      fill(color('#506CF7'));
      noStroke();

      square(end.x * side, end.y * side, side);
      
      loop();

    }
  }
  else{    
    drawBlocks = true;
  }
    
}
function mouseReleased() {
  drawBlocks = false;
}

function removeHighestPriority() {
  let hp = openList[0].f;
  let index = 0;
  for (let i = 0; i < openList.length; i++) {
    if (openList[i].f <= hp) {
      hp = openList[i].f;
      index = i;
    }
  }
  const point = openList[index];
  openList.splice(index, 1);
  return point;
}


class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.g = Infinity;
    this.h = 0;
    this.f = Infinity;
    this.neighbours = [];
    this.previous = undefined;
  }

  addNeighbours() {
    if (this.x > 0) {
      let p = new Point(
        this.x - 1,
        this.y,
      );

      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x - 1,
          this.y,
        ));
    }
    if (this.x < cols - 1) {
      let p = new Point(
        this.x + 1,
        this.y,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x + 1,
          this.y,
        ));
    }
    if (this.x > 0 && this.y >0) {
      let p = new Point(
        this.x - 1,
        this.y - 1,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x - 1,
          this.y - 1,
        ));
    }
    if (this.x < cols - 1 && this.y < rows - 1) {
      let p = new Point(
        this.x + 1,
        this.y + 1,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x + 1,
          this.y + 1,
        ));
    }

    if (this.x < cols - 1 && this.y > 0) {
      let p = new Point(
        this.x + 1,
        this.y - 1,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x + 1,
          this.y - 1,
        ));
    }
    if (this.x > 0 && this.y < rows -1) {
      let p = new Point(
        this.x - 1,
        this.y + 1,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x - 1,
          this.y + 1,
        ));
    }

    if (this.y > 0) {
      let p = new Point(
        this.x,
        this.y - 1,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x,
          this.y - 1,
        ));
    }
    if (this.y < rows - 1) {
      let p = new Point(
        this.x,
        this.y + 1,
      );
      let tp = blockedPath.find((i)=>{
        if(i.x == p.x && i.y == p.y){
          return true;
        }
      });
      if (!blockedPath.includes(tp))
        this.neighbours.push(new Point(
          this.x,
          this.y + 1,
        ));
    }
    return this.neighbours;
  }

}