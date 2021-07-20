/* eslint-disable max-len */
export default `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float width;
uniform float bucketHeight;
attribute vec2 bar;
attribute vec2 position;
attribute vec3 color;
varying vec3 vColor;

void main() {
  // Negative width here because we want to render the bars' width to the left side starting from its x position.
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * -width + bar.x, position.y * bucketHeight + bar.y, 0.0, 1.0);
  vColor = color;
}
`;
