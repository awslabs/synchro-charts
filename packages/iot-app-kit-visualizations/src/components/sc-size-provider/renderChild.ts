export const renderChild = <T>(renderFunction: (t: T) => any, data: T | undefined) => data && renderFunction(data);
