import {init, options} from './index';

describe('orx-core-products-webcomponent', () => {
  it('should call customElements.define with correct options', () => {
    // mock the customElements.define function
    const customElementsDefine = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    global.customElements.define = customElementsDefine;

    init();

    expect(customElementsDefine).toHaveBeenCalledWith('orx-core-products', expect.any(Function));
  });

  it('should use the correct options', () => {
    expect(options).toEqual({
      props: {
        text: 'string',
        routeAction: 'function',
        analyticsAction: 'function',
        theme: 'string',
        errorAction: 'function'
      }
    });
  });
});
