import React, {Component, ErrorInfo, ReactNode} from 'react';
import {Box, Button, Typography} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 *
 * Requirements:
 * - 11.x: Error handling
 * - Catches rendering errors
 * - Displays fallback UI with error details
 * - Provides reload page button
 * - Logs error to monitoring service
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Call optional reset callback
    this.props.onReset?.();
  };

  static handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            backgroundColor: '#FAFCFF'
          }}
          role="alert"
          aria-live="assertive"
        >
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#FFEBEE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: '48px',
                color: '#D32F2F'
              }}
            />
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '32px',
              color: '#323334',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          >
            Something went wrong
          </Typography>

          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#4B4D4F',
              marginBottom: '32px',
              textAlign: 'center',
              maxWidth: '600px'
            }}
          >
            We encountered an unexpected error. Please try reloading the page or contact support if the problem
            persists.
          </Typography>

          {process.env['NODE_ENV'] === 'development' && this.state.error && (
            <Box
              sx={{
                backgroundColor: '#F5F5F5',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                maxWidth: '800px',
                width: '100%',
                overflow: 'auto'
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#D32F2F',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
                component="pre"
              >
                {this.state.error.toString()}
              </Typography>
              {this.state.errorInfo && (
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#757575',
                    marginTop: '8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  component="pre"
                >
                  {this.state.errorInfo.componentStack}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{display: 'flex', gap: '16px'}}>
            <Button
              variant="outlined"
              onClick={this.handleReset}
              aria-label="Try again"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#323334',
                borderColor: '#323334',
                height: '40px',
                padding: '10px 24px',
                borderRadius: '46px',
                '&:hover': {
                  borderColor: '#323334',
                  backgroundColor: 'rgba(50, 51, 52, 0.04)'
                }
              }}
            >
              Try Again
            </Button>
            <Button
              variant="contained"
              onClick={ErrorBoundary.handleReload}
              aria-label="Reload page"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                backgroundColor: '#002677',
                color: '#FFFFFF',
                height: '40px',
                padding: '10px 24px',
                borderRadius: '46px',
                '&:hover': {
                  backgroundColor: '#001a5c'
                }
              }}
            >
              Reload Page
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
