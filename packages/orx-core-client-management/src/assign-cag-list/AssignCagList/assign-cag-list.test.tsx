import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {useAssignCagList} from '../useAssignCagList/use-assign-cag-list';

import {AssignCagList} from './assign-cag-list';
import {AssignCagListProps} from './assign-cag-list.types';

jest.mock('../useAssignCagList/use-assign-cag-list', () => ({
  useAssignCagList: jest.fn()
}));

describe('AssignCagList', () => {
  it('should render successfully', () => {
    // mock the hook
    (useAssignCagList as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      value: 'test value'
    });

    const props: AssignCagListProps = {
      text: 'test text'
    };
    const {baseElement, getByText} = render(<AssignCagList {...props} />);
    expect(baseElement).toBeTruthy();
    expect(getByText('test text')).toBeTruthy();
    expect(getByText('test value')).toBeTruthy();
  });

  it('should change value on Click', () => {
    const onClick = jest.fn();
    // mock the hook
    (useAssignCagList as jest.Mock).mockReturnValue({
      onClick,
      value: 'test value'
    });
    const props: AssignCagListProps = {
      text: 'test text'
    };

    const {getByText} = render(<AssignCagList {...props} />);
    getByText('Add CAG').click();
    expect(onClick).toHaveBeenCalled();
  });
});
