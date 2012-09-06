Matrix.prototype.translateSelf = function(v) {
  var m = this.elements;
  x = v.elements[0];
  y = v.elements[1];
  z = v.elements[2];
  m[0][3] += m[0][0] * x + m[0][1] * y + m[0][2] * z;
  m[1][3] += m[1][0] * x + m[1][1] * y + m[1][2] * z;
  m[2][3] += m[2][0] * x + m[2][1] * y + m[2][2] * z;
  m[3][3] += m[3][0] * x + m[3][1] * y + m[3][2] * z;
  return this;
}
Matrix.prototype.toString = function() {
  return this.elements.map(function(v){return v.join(' ')}).join('\n');
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
    m[1][0] = 0;
    m[2][0] = 0;
    m[3][0] = 0;
    m[0][1] = 0;
    m[1][1] = 2*znear/(top-bottom);
    m[2][1] = 0;
    m[3][1] = 0;
    m[0][2] = (right+left)/(right-left);
    m[1][2] = (top+bottom)/(top-bottom);
    m[2][2] = -(zfar+znear)/(zfar-znear);
    m[3][2] = -1;
    m[0][3] = 0;
    m[1][3] = 0;
    m[2][3] = -2*zfar*znear/(zfar-znear);
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
