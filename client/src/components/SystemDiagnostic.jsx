export default function SystemDiagnostic({ error, onRetry }) {
  return (
    <div className="text-center">
      <p className="italic text-cyber-red">
        CONNECTION_FAILED: HTTP_STATUS_{error.status || 403}. {error.message}
      </p>
      <p className="mt-2 text-cyber-cyan">-- SYSTEM_DIAGNOSTIC</p>
    </div>
  );
}
