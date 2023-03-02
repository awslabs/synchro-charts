export const pointVert = (showColor: boolean) => `
varying vec3 vColor;
${showColor ? 'varying float positionY;' : ''}
attribute vec3 pointColor;
uniform float pointDiameter;
uniform float devicePixelRatio;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 0.0, 1.0);
  gl_PointSize = pointDiameter * devicePixelRatio;
  vColor = pointColor;
  ${showColor ? 'positionY = position.y;' : ''}
}
`;
