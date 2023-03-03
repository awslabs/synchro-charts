import { E2EPage } from '@stencil/core/testing';

import { BaseConfig, DataStream } from '../../../../utils/dataTypes';

export interface ScConnectedComponent {
  config: BaseConfig;
  dataStreams: DataStream[];
  isEditing?: boolean;
  isFetching?: boolean;
  isLoading?: boolean;
  width?: number;
  height?: number;
}

export type ConnectedComponentPageGenerator<
  Config extends Partial<BaseConfig> = Partial<BaseConfig>,
  Props extends Partial<ScConnectedComponent> = Partial<ScConnectedComponent>
> = (configOverrides?: Config, props?: Props) => Promise<E2EPage>;
