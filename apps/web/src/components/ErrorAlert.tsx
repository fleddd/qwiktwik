const ErrorAlert = ({ error }: { error: any }) => {
    if (!error) return null;

    // Якщо помилка прийшла від нашого фетчера (має структуру)
    const message = typeof error === 'object' && error.message ? error.message : String(error);
    const details = typeof error === 'object' && error.details ? error.details : null;

    return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
                <h4 className="text-red-400 text-sm font-bold">{message}</h4>
                {details && (
                    <p className="text-red-400/70 text-xs mt-1 font-mono">{details}</p>
                )}
            </div>
        </div>
    );
};

export default ErrorAlert;