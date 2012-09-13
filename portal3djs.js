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

function M$(x) {
  if (x.length == 16) {
    return '['+x[0]+' '+x[4]+' '+x[8]+' '+x[12]+'\n'+
               x[1]+' '+x[5]+' '+x[9]+' '+x[13]+'\n'+
               x[2]+' '+x[6]+' '+x[10]+' '+x[14]+'\n'+
               x[3]+' '+x[7]+' '+x[11]+' '+x[15]+']';
  } else {
    return '['+Array.prototype.join.call(x, ' ')+']';
  }
}

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

  /* NOTE THE ORDER USED HERE */
  xm = M4x4.clone(M4x4.I);
  M4x4.mul(xm, cx.pmatrix, xm);
  M4x4.mul(xm, M4x4.makeTranslate3(0, 0, 6000), xm);
  M4x4.mul(xm, M4x4.makeRotate(angle, [1, 1, 0]), xm);
  M4x4.mul(xm, M4x4.makeTranslate3(0, 0, -4000), xm);
  lolxm = xm;

  var op = 'moveTo';
  cx.canvascx.beginPath();
  V.forEach(function(v) {
    log('A:', M$(v));
    M4x4.transformPoint(xm, v, v);
    log('B:', M$(v));
    v[0] += 0.5;
    v[1] += 0.5;
    v[0] *= canvas.width;
    v[1] *= canvas.height;
    log('C:', M$(v));
    cx.canvascx[op](v[0], v[1]);
    if (op == 'moveTo') {
      op = 'lineTo';
      V0 = v;
    }
  });
  cx.canvascx.lineTo(V0[0], V0[1]);
  cx.canvascx.strokeStyle = '#00ff00';
  cx.canvascx.fillStyle = '#00ff00';
  cx.canvascx.lineWidth = 1;
  cx.canvascx.fill();
}

function debugXform(v) {
  var M0 = Array.prototype.slice.call(arguments, 1);
  var M1 = [];
  console.log('Transforming '+M$(v)+' using '+M0.length+' matrices');
  do {
    M1.push(M0.shift());
    console.log('  Incorporating matrix:\n'+M1[M1.length-1]);

    var v0 = V3.clone(v);
    var v1 = V3.clone(v);

    var m = M4x4.clone(M4x4.I);
    for (var i=0; i<M1.length; i++) {
      /* Matrix concatenation */
      M4x4.mul(m, M1[i], m);
      /* Vector multiplication */
      V3.mul4x4(M[i], v, v);
      v1 = M1[i].x(v1);
    }
    v0 = m.x(v0);

    if (!v1.eql(v0))
      return console.log('  FAILURE:\n'+v0+'\ndoes not equal\n'+v1+'\nConcatenated transformation matrix:\n'+m);
    console.log('  Resulting vector:\n'+v0+'\n=\n'+v1);

  } while (M0.length);

  console.log('SUCCESS\n'+v0);
  return void 0;
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
var angle = 0; //Math.PI/24;
var translate = 0;
document.addEventListener('DOMContentLoaded', function() {
  fpsEl = document.getElementById('fps');

  cx = {};
  canvas = document.getElementById('gena');
  cx.canvas = canvas;
  cx.canvascx = canvas.getContext('2d');

  cx.pmatrix = M4x4.makePerspective(0.25, canvas.width/canvas.height, znear, zfar);
  cx.mvmatrix = null; // @todo TODO

  console.log('Projection Matrix:\n'+M$(cx.pmatrix));

  drawScene = function() {
    // TODO construct mvmatrix
    //cx.mvmatrix.translateSelf($V([translate, translate, 0]));
    translate += 0.01;
    //console.log(cx.mvmatrix.toString());
    canvasClear(cx);

    drawThing(cx, [
      [-100, -100, 3000],
      [ 100, -100, 3000],
      [ 100,  100, 3000],
      [-100,  100, 3000],
    ]);

    drawThing(cx, [
      [-100, -100, 5000],
      [ 100, -100, 5000],
      [ 100,  100, 5000],
      [-100,  100, 5000],
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
