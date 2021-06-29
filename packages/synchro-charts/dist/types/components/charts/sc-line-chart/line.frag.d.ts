declare const _default: "\nprecision highp float;\nvarying vec3 vColor;\n\n// Fills in triangles which make up a line segment, with the corresponding color\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n";
export default _default;
