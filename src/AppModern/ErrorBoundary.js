import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHardReset = () => {
    localStorage.removeItem('todo-storage');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <span className="error-boundary-icon material-symbols-rounded">
              error
            </span>
            <h2>Algo salió mal</h2>
            <p>
              La aplicación encontró un error inesperado. Puedes intentar
              recargar o reiniciar la app.
            </p>
            {this.state.error && (
              <details className="error-boundary-details">
                <summary>Detalles del error</summary>
                <code>{this.state.error.toString()}</code>
              </details>
            )}
            <div className="error-boundary-actions">
              <button
                className="error-btn error-btn-primary"
                onClick={this.handleReset}
              >
                <span className="material-symbols-rounded">refresh</span>
                Reintentar
              </button>
              <button
                className="error-btn error-btn-secondary"
                onClick={this.handleHardReset}
              >
                <span className="material-symbols-rounded">restart_alt</span>
                Reiniciar app
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
