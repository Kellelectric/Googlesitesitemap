'use client'

import { useEffect, useState } from 'react'
import { SearchBox } from './SearchBox'

// Triggered from Header (desktop icon button + mobile menu item) rather
// than added as a 13th primaryNav link - Header's own comment already
// notes the nav row is at capacity for what fits at lg. Ctrl/Cmd+K opens
// it from anywhere, matching the common site-search convention.
export function SearchOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Search the site"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center text-paper/80 outline-offset-2 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/70 px-4 pt-24 sm:pt-32"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-paper p-6"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow text-petrol/70">Search</span>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(false)}
                className="text-ink/50 outline-offset-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              <SearchBox autoFocus onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
