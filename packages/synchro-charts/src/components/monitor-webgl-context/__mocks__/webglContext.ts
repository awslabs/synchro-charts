const createWebGLRenderer = () => ({
  initRendering: jest.fn(),
  dispose: jest.fn(),
  render: jest.fn(),
  addChartScene: jest.fn(),
  removeChartScene: jest.fn(),
  setChartRect: jest.fn(),
  updateViewPorts: jest.fn(),
});

export const webGLRenderer = createWebGLRenderer();
