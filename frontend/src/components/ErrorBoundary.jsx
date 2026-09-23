import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xs text-center space-y-4 my-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-maroon-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-dark-800">Something went wrong while loading this view.</h3>
            <p className="text-xs text-muted-500 mt-1 max-w-md mx-auto">
              A temporary issue occurred while rendering this section. Your authentication and account remain safe.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Refresh Dashboard
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
