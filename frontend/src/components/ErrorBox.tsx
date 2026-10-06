const ErrorBox = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="error-box">
    <p>⚠️ {message}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);

export default ErrorBox;
