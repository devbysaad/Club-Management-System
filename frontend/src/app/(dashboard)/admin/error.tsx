'use client'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="glass-card rounded-2xl p-8 max-w-md text-center">
                <div className="mb-6">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-heading font-bold text-fcGarnet mb-2">
                        Something went wrong!
                    </h2>
                    <p className="text-sm text-fcTextMuted">
                        {error.message || 'An unexpected error occurred while loading the dashboard'}
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full px-6 py-3 bg-fcGarnet text-white rounded-lg hover:bg-fcGarnetDark transition-colors font-medium"
                    >
                        Try again
                    </button>

                    <a
                        href="/"
                        className="block w-full px-6 py-3 bg-fcBlue/20 text-fcBlue rounded-lg hover:bg-fcBlue/30 transition-colors font-medium"
                    >
                        Go to Home
                    </a>
                </div>

                {error.digest && (
                    <p className="mt-4 text-xs text-fcTextMuted">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    )
}
