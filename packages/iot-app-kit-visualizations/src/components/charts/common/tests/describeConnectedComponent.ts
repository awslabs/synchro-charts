import { describeStatus } from './describeStatus';
import { ConnectedComponentPageGenerator } from './types';

export interface ConnectedComponentOptions {
  status?: {
    errors?: boolean;
    loading?: boolean;
  };
  size?: {
    size?: boolean;
  };
}

const defaultOptions = {
  status: {
    errors: true,
    loading: true,
  },
  size: {
    size: true,
  },
};

export const describeConnectedComponents = (
  pageGenerator: ConnectedComponentPageGenerator,
  tag: string,
  options: Partial<ConnectedComponentOptions> = defaultOptions
) => {
  describe('standard connected component properties', () => {
    describeStatus(pageGenerator, tag, options.status);
  });
};
