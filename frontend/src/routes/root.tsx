import { Outlet } from 'react-router'
import { useTheme } from '../theme'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex h-8 w-8 items-center justify-center rounded-[var(--r-ctrl)] bg-[var(--white)] text-sm shadow-[var(--sh-card)] transition hover:shadow-[var(--sh-hover)]"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--g900)]">
      <header className="px-4 py-3 sm:px-6">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--r-ctrl)] bg-[var(--indigo)] text-xs font-bold text-white shadow-[var(--sh-pop)]">
              ∩
            </div>
            <span className="text-base font-bold tracking-[-0.4px] text-[var(--g900)]">
              Set Operations
            </span>
          </div>
          <ThemeToggle />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="px-4 pb-4 sm:px-6">
        <p className="mx-auto max-w-[1600px] text-center text-[11px] text-[var(--g400)]">
          Compare and analyze up to 6 sets of data
        </p>
      </footer>
    </div>
  )
}

export default RootLayout
