/* eslint-disable import/first */
jest.mock('../../sc-webgl-context/webglContext');

import { createVisualization, mockProgramOptions } from './mocks';
import { PluginManager } from './PluginManager';
import { PluginRegistry } from '../sc-webgl-base-chart/types';
import { DataType } from '../../../utils/dataConstants';
import { VisualizationProgram } from '../../sc-webgl-context/types';
import { webGLRenderer } from '../../sc-webgl-context/webglContext';
import { VisualizationManager } from './VisualizationManager';

const noop = () => {};

const STREAM_1 = {
  visualizationType: 'some-viz',
  id: 'data-stream',
  name: 'some name',
  resolution: 0,
  data: [],
  dataType: DataType.NUMBER,
};

const createRegistry = ({ update, create }): PluginRegistry => {
  return {
    getPlugin: () => {
      return {
        create,
        update,
      };
    },
  };
};

beforeEach(() => {
  webGLRenderer.initRendering(new HTMLCanvasElement());
});

it('initializes', () => {
  expect(
    () =>
      new PluginManager({
        registry: createRegistry({
          update: () => {},
          create: () => {},
        }),
        controller: new VisualizationManager(),
      })
  ).not.toThrowError();
});

describe('renders visualization', () => {
  it('renders visualization that has not been previously rendered by creating a new program', () => {
    const create = jest.fn().mockImplementation(() => createVisualization());
    const update = jest.fn();

    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update,
        create,
      }),
    });

    visManager.render(mockProgramOptions());

    expect(create).toBeCalledTimes(1);
    expect(update).not.toBeCalled();
  });

  it('updates the program, and does not create a new program on re-render when programId does not change', () => {
    const create = jest.fn().mockReturnValue(createVisualization());
    const update = jest.fn().mockReturnValue(createVisualization());

    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update,
        create,
      }),
    });

    visManager.render(mockProgramOptions());

    create.mockReset();
    visManager.render(mockProgramOptions());

    expect(create).not.toBeCalled();
    expect(update).toBeCalled();
  });

  it('creates one program when two data streams use the same visualization type', () => {
    const create = jest.fn().mockImplementation(() => createVisualization());
    const update = jest.fn();

    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update,
        create,
      }),
    });

    visManager.render(mockProgramOptions([STREAM_1, STREAM_1]));

    expect(create).toBeCalledTimes(1);
    expect(update).not.toBeCalled();
  });

  it('creates a program per visualization type used', () => {
    const create = jest.fn().mockImplementation(() => createVisualization());
    const update = jest.fn();

    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update,
        create,
      }),
    });

    visManager.render(
      mockProgramOptions([
        STREAM_1,
        {
          ...STREAM_1,
          visualizationType: 'some-other-viz-type!',
        },
      ])
    );

    expect(create).toBeCalledTimes(2);
    expect(update).not.toBeCalled();
  });
});

describe('updates viewport', () => {
  it('does nothing when no visualizations have been rendered previously', () => {
    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update: noop,
        create: noop,
      }),
    });

    expect(() => visManager.updateViewport({ start: new Date(), end: new Date() })).not.toThrowError();
  });

  it('when the manager updates the viewport, the controller updates the viewport.', () => {
    const controller = ({ updateViewport: jest.fn() } as unknown) as VisualizationManager;
    const visManager = new PluginManager({
      controller,
      registry: createRegistry({
        update: noop,
        create: noop,
      }),
    });

    const viewport = { start: new Date(), end: new Date() };
    visManager.updateViewport(viewport);

    expect(controller.updateViewport).toBeCalled();
    expect(controller.updateViewport).toBeCalledWith(viewport);
  });

  describe.skip('requires webgl calls to work', () => {
    it('updates viewport of previously rendered chart scene', () => {
      const program = {
        ...createVisualization(),
        updateViewPort: jest.fn(),
      };

      const visManager = new PluginManager({
        controller: new VisualizationManager(),
        registry: createRegistry({
          update: noop,
          create: () => program,
        }),
      });

      // Initial render, which causes the chart scene to be constructed
      visManager.render(mockProgramOptions([STREAM_1]));

      expect(program.updateViewPort).not.toBeCalled();

      const viewport = { start: new Date(), end: new Date() };
      visManager.updateViewport(viewport);

      expect(program.updateViewPort).toBeCalledWith(viewport);
      expect(program.updateViewPort).toBeCalledTimes(1);
    });

    it('only calls updateViewPort on chart scene once when multiple data streams have the same visualization type', () => {
      const program = {
        ...createVisualization(),
        updateViewPort: jest.fn(),
      };

      const visManager = new PluginManager({
        controller: new VisualizationManager(),
        registry: createRegistry({
          update: noop,
          create: () => program,
        }),
      });

      visManager.render(mockProgramOptions([STREAM_1, STREAM_1]));

      visManager.updateViewport({ start: new Date(), end: new Date() });

      expect(program.updateViewPort).toBeCalledTimes(1);
    });

    it('calls updateViewport on every chart scene created for each unique visualization type', () => {
      const program1 = {
        ...createVisualization(),
        updateViewPort: jest.fn(),
      };

      const program2 = {
        ...createVisualization(),
        updateViewPort: jest.fn(),
      };

      const visManager = new PluginManager({
        controller: new VisualizationManager(),
        registry: createRegistry({
          update: noop,
          create: jest
            .fn()
            .mockReturnValueOnce(program1)
            .mockReturnValueOnce(program2),
        }),
      });

      visManager.render(
        mockProgramOptions([
          STREAM_1,
          {
            ...STREAM_1,
            visualizationType: 'some-other-viz',
          },
        ])
      );

      const viewport = { start: new Date(), end: new Date() };
      visManager.updateViewport(viewport);

      expect(program1.updateViewPort).toBeCalledTimes(1);
      expect(program1.updateViewPort).toBeCalledWith(viewport);

      expect(program2.updateViewPort).toBeCalledTimes(1);
      expect(program2.updateViewPort).toBeCalledWith(viewport);
    });
  });
});

describe('disposal', () => {
  it('does nothing when nothing has been previously rendered', () => {
    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update: noop,
        create: noop,
      }),
    });

    expect(() => visManager.dispose()).not.toThrowError();
  });

  it('disposes of program', () => {
    const program: VisualizationProgram = {
      ...createVisualization(),
      dispose: jest.fn(),
    };

    const visManager = new PluginManager({
      controller: new VisualizationManager(),
      registry: createRegistry({
        update: noop,
        create: () => program,
      }),
    });

    // Initial render, which causes the program to be constructed from the plugin provided
    visManager.render(mockProgramOptions([STREAM_1, STREAM_1]));

    visManager.dispose();

    expect(program.dispose).toBeCalled();
  });
});

describe('re-creation of program', () => {
  it('re-creates the program when the update program method returns a new program id', () => {
    const program1 = {
      ...createVisualization(),
      updateViewPort: jest.fn(),
    };

    const updatedProgram = {
      ...program1,
      id: '123',
    };

    const update = jest.fn().mockReturnValue(updatedProgram);

    const controller = {
      removeVisualization: jest.fn(),
      addVisualization: jest.fn(),
      getVisualization: jest
        .fn()
        .mockReturnValueOnce(null) // must be null on first try, otherwise the program does not create on initial render
        .mockReturnValue(program1),
      render: noop,
    } as Partial<VisualizationManager>;

    const visManager = new PluginManager({
      controller: controller as VisualizationManager,
      registry: createRegistry({
        update,
        create: jest.fn().mockReturnValue(program1),
      }),
    });

    const options = mockProgramOptions();

    visManager.render(options);
    visManager.render(options);

    expect(controller.addVisualization).toBeCalledTimes(2);

    expect(controller.removeVisualization).toBeCalledTimes(1);
    expect(controller.removeVisualization).toBeCalledWith(program1.id);
  });

  it('does not re-create the program when the update program method returns an updated program without a change in program id', () => {
    const program1 = {
      ...createVisualization(),
      updateViewPort: jest.fn(),
    };

    const updatedProgram = { ...program1 };
    const update = jest.fn().mockReturnValue(updatedProgram);

    const controller = {
      removeVisualization: jest.fn(),
      addVisualization: jest.fn(),
      getVisualization: jest
        .fn()
        .mockReturnValueOnce(null) // must be null on first try, otherwise the program does not create on initial render
        .mockReturnValue(program1),
      render: noop,
    } as Partial<VisualizationManager>;

    const visManager = new PluginManager({
      controller: controller as VisualizationManager,
      registry: createRegistry({
        update,
        create: jest.fn().mockReturnValue(program1),
      }),
    });

    const options = mockProgramOptions();

    visManager.render(options);
    visManager.render(options);

    expect(controller.addVisualization).toBeCalledTimes(1);
    expect(controller.removeVisualization).not.toBeCalled();
  });
});
