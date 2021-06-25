/* eslint-disable max-len */
export default `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec4 status;
attribute vec2 position;
attribute vec3 color;
varying vec3 vColor;

void main() {
  float width = status.z;
  float height = status.w;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * width + status.x, position.y * height + status.y, 0.0, 1.0);
  vColor = color;
}
`;
