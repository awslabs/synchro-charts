export type ViewFrame = Element | Window;

export const scrollPosition = (viewFrame: ViewFrame) =>
  'scrollX' in viewFrame
    ? {
        x: viewFrame.scrollX,
        y: viewFrame.scrollY,
      }
    : {
        x: viewFrame.scrollLeft,
        y: viewFrame.scrollTop,
      };
