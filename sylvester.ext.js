

Matrix.Translation = function(v) {
  x = v.elements[0];
  y = v.elements[1];
  z = v.elements[2];

  var m = Matrix.I(4);

  m.elements[0][3] = x;
  m.elements[1][3] = y;
  m.elements[2][3] = z;

  return m;
}
Matrix.prototype.toString = function() {
  return this.elements.map(function(v){return v.join(' ')}).join('\n');
}
Vector.prototype.toString = function() {
  return '['+this.elements.join(' ')+']';
}

Matrix.makeFrustum = function Matrix_makeFrustum(left, right, bottom, top, znear, zfar, r) {
    var m;

    if (r == void 0)
        r = Matrix.Zero(4, 4);
    m = r.elements;

    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    m[0][0] = 2*znear/(right-left);
    m[0][1] = 0;
    m[0][2] = (right+left)/(right-left);
    m[0][3] = 0;
           
    m[1][0] = 0;
    m[1][1] = 2*znear/(top-bottom);
    m[1][2] = (top+bottom)/(top-bottom);
    m[1][3] = 0;
           
    m[2][0] = 0;
    m[2][1] = 0;
    m[2][2] = -(zfar+znear)/(zfar-znear);
    m[2][3] = -2*zfar*znear/(zfar-znear);
           
    m[3][0] = 0;
    m[3][1] = 0;
    m[3][2] = -1;
    m[3][3] = 0;

    return r;
};

Matrix.makePerspective = function Matrix_makePerspective (fovy, aspect, znear, zfar, r) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return Matrix.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar, r);
};

Matrix.MakeRotation = function(theta, _a) {
  var axis = _a.dup();
  if (axis.elements.length != 3) { return null; }
  var mod = axis.modulus();
  var x = axis.elements[0]/mod, y = axis.elements[1]/mod, z = axis.elements[2]/mod;
  var s = Math.sin(theta), c = Math.cos(theta), t = 1 - c;
  // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
  // That proof rotates the co-ordinate system so theta
  // becomes -theta and sin becomes -sin here.
  return Matrix.create([
    [ t*x*x + c, t*x*y - s*z, t*x*z + s*y, 0 ],
    [ t*x*y + s*z, t*y*y + c, t*y*z - s*x, 0 ],
    [ t*x*z - s*y, t*y*z + s*x, t*z*z + c, 0 ],
    [ 0, 0, 0, 1]
  ]);
}
