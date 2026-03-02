import '@testing-library/react';

declare module '@testing-library/react' {
  interface Screen {
    getByDataSlot: (id: string) => HTMLElement;
  }
}
