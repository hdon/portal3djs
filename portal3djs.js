var canvas;
var camera;
var rootSector;
var cx;
var drawScene;
var go = false;
var fpsCounter = 0;
var fpsLastAvgTime = -Infinity;
var fpsEl;
var znear = 100;
var zfar = 10000;

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

function log() {
  if (go)
    return;

  console.log(Array.prototype.map.call(arguments, function(a) {
    return String(a);
  }).join(' '));
}

function drawThing(cx, V) {
  var v0;
  var xm;
  //xm = Matrix.I(4);
  //xm = xm.multiply(cx.mvmatrix);
  //xm = xm.multiply(cx.pmatrix);

  xm = Matrix.I(4);
  xm = xm.multiply(Matrix.Translation($V([0, 0, -4000])));
  var op = 'moveTo';
  cx.canvascx.beginPath();
  V.forEach(function(v) {
    log('A:', v.elements[0], v.elements[1], v.elements[2], v.elements[3]);
    //v = xm.multiply(v);
    //v = cx.mvmatrix.multiply(v);
    //v = Matrix.Translation($V([0, 0, -4000])).multiply(v);
    v = xm.multiply(v);
    v = Matrix.MakeRotation(angle, $V([1, 1, 0])).multiply(v);
    v = Matrix.Translation($V([0, 0, 4000])).multiply(v);
    v = cx.pmatrix.multiply(v);
    v = v.multiply(1/v.elements[3]);
    log('B:', v.elements[0], v.elements[1], v.elements[2], v.elements[3]);
    v.elements[0] += 200;
    v.elements[1] +=  80;
    /*v.elements[0] *= canvas.width;
    v.elements[1] *= canvas.height;*/
    log('C:', v.elements[0], v.elements[1], v.elements[2], v.elements[3]);
    cx.canvascx[op](v.elements[0], v.elements[1]);
    if (op == 'moveTo') {
      op = 'lineTo';
      V0 = v;
    }
  });
  cx.canvascx.lineTo(V0.elements[0], V0.elements[1]);
  cx.canvascx.strokeStyle = '#00ff00';
  cx.canvascx.lineWidth = 1;
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

var shapea = 50;
var shapeb = 100;
var shape = [
    shapea,   shapea,  void 0,
    shapea,   shapeb,  void 0,
    shapeb,   shapeb,  void 0,
    shapeb,   shapea,  void 0
];
var angle = Math.PI/24;
var translate = 0;
document.addEventListener('DOMContentLoaded', function() {
  fpsEl = document.getElementById('fps');

  cx = {};
  canvas = document.getElementById('gena');
  cx.canvas = canvas;
  cx.canvascx = canvas.getContext('2d');
  cx.pmatrix = Matrix.makePerspective(0.25, canvas.width/canvas.height, znear, zfar);
  //cx.pmatrix = Matrix.I(4);
  console.log('Projection Matrix:\n'+cx.pmatrix);

  drawScene = function() {
    //cx.mvmatrix.translateSelf($V([5, 5, -5]));
    var rotation = Matrix.MakeRotation(angle, $V([1, 1, 0]));
    //console.log('rotation matrix:\n'+rotation);
    cx.mvmatrix = Matrix.I(4);
    cx.mvmatrix.multiply(Matrix.Translation($V([0, 0, -2000])));
    cx.mvmatrix = cx.mvmatrix.multiply(rotation);
    cx.mvmatrix.multiply(Matrix.Translation($V([0, 0,  2000])));
    //cx.mvmatrix.translateSelf($V([translate, translate, 0]));
    translate += 0.01;
    //console.log(cx.mvmatrix.toString());
    canvasClear(cx);

    drawThing(cx, [
      $V([-100, -100, 3000, 1]),
      $V([ 100, -100, 3000, 1]),
      $V([ 100,  100, 3000, 1]),
      $V([-100,  100, 3000, 1]),
    ]);

    drawThing(cx, [
      $V([-100, -100, 5000, 1]),
      $V([ 100, -100, 5000, 1]),
      $V([ 100,  100, 5000, 1]),
      $V([-100,  100, 5000, 1]),
    ]);

    if (0)
    for (var z=1000; z<5000; z+=1000) {
      var V = [];
      for (var i=0; i<shape.length; i+=3) {
        V.push($V(shape.slice(i, i+2).concat(z, 1)));
      }
      drawThing(cx, V);

      V = [];
      for (var i=0; i<shape.length; i+=3) {
        var vc = shape.slice(i, i+2);
        V.push($V([vc[0], vc[1]*-1, z, 1]));
      }
      drawThing(cx, V);

      V = [];
      for (var i=0; i<shape.length; i+=3) {
        var vc = shape.slice(i, i+2);
        V.push($V([vc[0]*-1, vc[1], z, 1]));
      }
      drawThing(cx, V);

      V = [];
      for (var i=0; i<shape.length; i+=3) {
        var vc = shape.slice(i, i+2);
        V.push($V([vc[0]*-1, vc[1]*-1, z, 1]));
      }
      drawThing(cx, V);
    }

    angle = (angle + Math.PI/100) % (Math.PI*2);
    fpsCounter++;
    if (go)
      setTimeout(drawScene, 1000/30);
  };

  setInterval(function() {
    var t = Date.now();
    fps.innerText = fpsCounter / (t - fpsLastAvgTime) * 1000 + ' FPS';
    fpsLastAvgTime = t;
    fpsCounter = 0;
  }, 1000);
  drawScene();
});

function toggle() {
  go = ! go;
  if (go)
    drawScene();
}
