var canvas;
var camera;
var rootSector;
var cx;
var drawScene;
var go = false;

var sectorsByName = {};
function Sector(name, vertices, faces) {
  sectorsByName[name] = this;
  this.vertices = vertices;
  this.faces = faces;
}
Sector.prototype.draw = function Sector_draw(cx) {
  for (var face=0; face<6; face++) {
  }
}

function drawTriangle(cx, v0, v1, v2) {
  
}
function drawPoint(cx, v, fillStyle) {
  var transformationMatrix = cx.mvmatrix.dup();
  transformationMatrix = transformationMatrix.multiply(cx.pmatrix);
  console.log('Model*Projection Matrix:\n'+transformationMatrix);
  console.log(v.elements, '<-- world space');
  v = transformationMatrix.multiply(v);
  console.log(v.elements, '<-- modelview space ');
  v = v.multiply(1/v.elements[3]);
  console.log(v.elements, '<-- ');
  console.log(v.elements);

  cx.canvascx.fillStyle = fillStyle || '#ff00ff';
  cx.canvascx.fillRect(v.elements[0], v.elements[1], 10, 10);
}

function drawThing(cx, V) {
  var v0;
  var xm = cx.mvmatrix.dup();
  xm = xm.multiply(cx.pmatrix);

  var op = 'moveTo';
  cx.canvascx.beginPath();
  V.forEach(function(v) {
    var v = xm.multiply(v);
    v = v.multiply(1/v.elements[3]);
    console.log('-->', op, v.elements.slice(0,2));
    cx.canvascx[op](v.elements[0], v.elements[1]);
    if (op == 'moveTo') {
      op = 'lineTo';
      V0 = v;
    }
  });
  cx.canvascx.lineTo(V0.elements[0], V0.elements[1]);
  cx.canvascx.strokeStyle = '#00ff00';
  cx.canvascx.lineWidth = 2;
  cx.canvascx.stroke();
}

function canvasClear(cx) {
  cx.canvascx.fillStyle = '#000000';
  cx.canvascx.fillRect(0, 0, cx.canvas.width, cx.canvas.height);
}
function Camera(origin, obj) {
  
}

/*
rootSector = new Sector('foo', [
  $V(-1, -1),
  $V(-1,  1),
  $V( 1,  1),
  $V( 1, -1),
], [0, 1, 2, 3]);*/

var shape = [
  50, 50, 10,
  100, 50, 10,
  100, 100, 10,
  50, 100, 10
];
document.addEventListener('DOMContentLoaded', function() {
  cx = {};
  canvas = document.getElementById('gena');
  cx.canvas = canvas;
  cx.canvascx = canvas.getContext('2d');
  cx.mvmatrix = Matrix.I(4);
  cx.pmatrix = Matrix.makePerspective(45, canvas.height/canvas.width, 10, 100);
  console.log('Projection Matrix:\n'+cx.pmatrix);

  drawScene = function() {
    cx.mvmatrix.translateSelf($V([5, 5, 0]));
    canvasClear(cx);
      drawPoint(cx, $V([50, 50, z, 1]), '#ff0000');

    for (var z=-10; z>-100; z-=10) {
      var V = [];
      for (var i=0; i<shape.length; i+=3) {
        V.push($V(shape.slice(i, i+2).concat(z, 0)));
      }
      console.log('SHAPE:', V);
      drawThing(cx, V);
    }

    if (go)
      setTimeout(drawScene, 100);
  };

  drawScene();
});

function toggle() {
  go = ! go;
  if (go)
    drawScene();
}
