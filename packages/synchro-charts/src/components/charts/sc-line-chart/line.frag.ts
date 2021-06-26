export default `
precision highp float;
varying vec3 vColor;

// Fills in triangles which make up a line segment, with the corresponding color
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;
