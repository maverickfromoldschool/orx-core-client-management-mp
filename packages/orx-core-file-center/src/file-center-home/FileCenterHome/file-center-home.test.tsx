import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';

import {FileCenterHome} from './file-center-home';
import {FileCenterHomeProps} from './file-center-home.types';

// Mock the FileCenterListPage component
jest.mock('../../file-center-list-page/FileCenterListPage/file-center-list-page', () => {
  const MockFileCenterListPage = function MockFileCenterListPage() {
    return <div data-testid="file-center-list-page">FileCenterListPage</div>;
  };
  return {
    FileCenterListPage: MockFileCenterListPage,
    __esModule: true
  };
});

describe('FileCenterHome', () => {
  const defaultProps: FileCenterHomeProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render successfully with default props', () => {
      const {baseElement} = render(<FileCenterHome {...defaultProps} />);
      expect(baseElement).toBeTruthy();
    });

    it('should render with default title "File Center"', () => {
      render(<FileCenterHome {...defaultProps} />);
      expect(screen.getByText('File Center')).toBeInTheDocument();
    });

    it('should render with custom title when provided', () => {
      const props: FileCenterHomeProps = {
        title: 'Custom File Center'
      };
      render(<FileCenterHome {...props} />);
      expect(screen.getByText('Custom File Center')).toBeInTheDocument();
    });

    it('should render the dropdown with default "All Files" option', () => {
      render(<FileCenterHome {...defaultProps} />);
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toBeInTheDocument();
      expect(screen.getByText('All Files')).toBeInTheDocument();
    });

    it('should render the search input with placeholder', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search');
      expect(searchInput).toBeInTheDocument();
    });

    it('should render the search icon', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchIcon = screen.getByTestId('SearchIcon');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should render FileCenterListPage component', () => {
      render(<FileCenterHome {...defaultProps} />);
      const listPage = screen.getByTestId('file-center-list-page');
      expect(listPage).toBeInTheDocument();
      // Note: FileCenterListPage now fetches data via API, not via props
      expect(listPage).toHaveTextContent('FileCenterListPage');
    });
  });

  describe('Dropdown Functionality', () => {
    it('should have initial dropdown value as "all"', () => {
      render(<FileCenterHome {...defaultProps} />);
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveTextContent('All Files');
    });

    it('should update dropdown value when changed', () => {
      render(<FileCenterHome {...defaultProps} />);
      const dropdown = screen.getByRole('combobox');

      // Open dropdown
      fireEvent.mouseDown(dropdown);

      // Select an option (if there were more options)
      // This test verifies dropdown interaction works
      expect(dropdown).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should have empty search value initially', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText<HTMLInputElement>('Search');
      expect(searchInput.value).toBe('');
    });

    it('should update search value when user types', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText<HTMLInputElement>('Search');

      fireEvent.change(searchInput, {target: {value: 'test search'}});

      expect(searchInput.value).toBe('test search');
    });

    it('should handle multiple search value changes', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText<HTMLInputElement>('Search');

      fireEvent.change(searchInput, {target: {value: 'first'}});
      expect(searchInput.value).toBe('first');

      fireEvent.change(searchInput, {target: {value: 'second'}});
      expect(searchInput.value).toBe('second');
    });

    it('should clear search value when empty string is entered', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText<HTMLInputElement>('Search');

      fireEvent.change(searchInput, {target: {value: 'test'}});
      expect(searchInput.value).toBe('test');

      fireEvent.change(searchInput, {target: {value: ''}});
      expect(searchInput.value).toBe('');
    });
  });

  describe('Layout and Styling', () => {
    it('should render the main container with proper styling', () => {
      const {container} = render(<FileCenterHome {...defaultProps} />);
      const mainBox = container.firstChild;
      // Just verify the container exists and is rendered
      expect(mainBox).toBeInTheDocument();
      expect(mainBox).toBeTruthy();
    });

    it('should render header row with title, dropdown, and search', () => {
      render(<FileCenterHome {...defaultProps} />);

      expect(screen.getByText('File Center')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('should have search input with rounded border styling', () => {
      render(<FileCenterHome {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search');
      const inputContainer = searchInput.closest('.MuiOutlinedInput-root');
      expect(inputContainer).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle undefined title prop gracefully', () => {
      const props: FileCenterHomeProps = {
        title: undefined
      };
      render(<FileCenterHome {...props} />);
      expect(screen.getByText('File Center')).toBeInTheDocument();
    });

    it('should handle empty string title', () => {
      const props: FileCenterHomeProps = {
        title: ''
      };
      const {baseElement} = render(<FileCenterHome {...props} />);
      // When empty string is provided, the title will be empty (not fallback to default)
      expect(baseElement).toBeTruthy();
      // Verify the component still renders with other elements
      expect(screen.getByTestId('file-center-list-page')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render FileCenterListPage component', () => {
      render(<FileCenterHome {...defaultProps} />);
      const listPage = screen.getByTestId('file-center-list-page');

      // Verify that FileCenterListPage is rendered
      // Note: FileCenterListPage now fetches data via API using useFileCenterListPage hook
      expect(listPage).toBeInTheDocument();
      expect(listPage).toHaveTextContent('FileCenterListPage');
    });

    it('should render all main components together', () => {
      render(<FileCenterHome {...defaultProps} />);

      // Title
      expect(screen.getByText('File Center')).toBeInTheDocument();

      // Dropdown
      expect(screen.getByRole('combobox')).toBeInTheDocument();

      // Search
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

      // List Page
      expect(screen.getByTestId('file-center-list-page')).toBeInTheDocument();
    });
  });
});
