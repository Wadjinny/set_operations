import { Link, isRouteErrorResponse, useRouteError } from 'react-router'

function ErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'An unexpected error occurred.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = typeof error.data === 'string' ? error.data : message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--g900)]">
      <div className="w-full max-w-md rounded-[var(--r-card)] bg-[var(--white)] p-8 shadow-[var(--sh-card)]">
        <h1 className="text-2xl font-bold tracking-[-0.6px]">{title}</h1>
        <p className="mt-2 text-[13px] text-[var(--g500)]">{message}</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-[var(--r-pill)] bg-[var(--indigo)] px-6 py-3 text-[13px] font-semibold text-white shadow-[var(--sh-pop)] transition hover:bg-[var(--indigo-hover)]"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
