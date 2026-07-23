import React from 'react';

// --- Custom Brand SVG Icons (Official Real Vector Logos) ---
export const Instagram = ({ size = 16, className = "", colorful = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <radialGradient id="ig-radial" cx="20%" cy="100%" r="130%" fx="20%" fy="100%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    {colorful ? (
      <>
        <rect width="24" height="24" rx="6" fill="url(#ig-radial)" />
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3.6" stroke="#ffffff" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="#ffffff" />
      </>
    ) : (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const Linkedin = ({ size = 16, className = "", colorful = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
    {colorful ? (
      <>
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path d="M19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93-.94 0-1.62.68-1.62 1.93V19h-3v-9h2.9v1.3c.48-.75 1.4-1.5 2.8-1.5 2.47 0 3.3 1.58 3.3 4.14V19zM6.88 8.56a1.68 1.68 0 0 1 0-3.36 1.68 1.68 0 0 1 0 3.36zM8.38 19H5.38v-9h3v9z" fill="#ffffff" />
      </>
    ) : (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect width="4" height="12" x="2" y="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    )}
  </svg>
);

export const Youtube = ({ size = 16, className = "", colorful = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
    {colorful ? (
      <>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000" />
        <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#ffffff" />
      </>
    ) : (
      <>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" fill="none" stroke="currentColor" strokeWidth="2" />
        <polygon points="10 15 15 12 10 9" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    )}
  </svg>
);

export const Twitter = ({ size = 16, className = "", colorful = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
    {colorful ? (
      <>
        <rect width="24" height="24" rx="4" fill="#000000" />
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff" />
      </>
    ) : (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
    )}
  </svg>
);

export const Threads = ({ size = 16, className = "", colorful = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
    {colorful ? (
      <>
        <rect width="24" height="24" rx="4" fill="#101010" />
        <path d="M12.186 19.162c-3.978 0-6.879-2.583-6.879-6.938 0-4.408 3.013-7.147 7.214-7.147 3.916 0 6.643 2.395 6.643 6.634 0 3.208-1.543 5.467-4.135 5.467-1.42 0-2.397-.841-2.158-2.329.135-.838.608-2.006.608-2.709 0-.825-.436-1.396-1.309-1.396-1.229 0-2.079 1.258-2.079 2.915 0 1.488.666 2.404 1.846 2.404.757 0 1.392-.379 1.765-.899l1.378.805c-.655 1.055-1.785 1.637-3.218 1.637-2.329 0-3.805-1.637-3.805-4.047 0-2.73 1.777-4.667 4.298-4.667 2.385 0 3.864 1.489 3.864 3.791 0 1.625-.568 3.667-2.223 3.667-.998 0-1.657-.655-1.464-1.713l.42-2.257c.189-1.025-.515-1.649-1.439-1.649-1.439 0-2.427 1.348-2.427 3.297 0 1.95 1.077 3.209 2.801 3.209 1.157 0 2.127-.585 2.766-1.579l1.492.936c-.927 1.408-2.427 2.28-4.258 2.28z" fill="#ffffff" />
      </>
    ) : (
      <path d="M12.186 19.162c-3.978 0-6.879-2.583-6.879-6.938 0-4.408 3.013-7.147 7.214-7.147 3.916 0 6.643 2.395 6.643 6.634 0 3.208-1.543 5.467-4.135 5.467-1.42 0-2.397-.841-2.158-2.329.135-.838.608-2.006.608-2.709 0-.825-.436-1.396-1.309-1.396-1.229 0-2.079 1.258-2.079 2.915 0 1.488.666 2.404 1.846 2.404.757 0 1.392-.379 1.765-.899l1.378.805c-.655 1.055-1.785 1.637-3.218 1.637-2.329 0-3.805-1.637-3.805-4.047 0-2.73 1.777-4.667 4.298-4.667 2.385 0 3.864 1.489 3.864 3.791 0 1.625-.568 3.667-2.223 3.667-.998 0-1.657-.655-1.464-1.713l.42-2.257c.189-1.025-.515-1.649-1.439-1.649-1.439 0-2.427 1.348-2.427 3.297 0 1.95 1.077 3.209 2.801 3.209 1.157 0 2.127-.585 2.766-1.579l1.492.936c-.927 1.408-2.427 2.28-4.258 2.28z" fill="currentColor" />
    )}
  </svg>
);

export const Facebook = ({ size = 16, className = "", colorful = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
    {colorful ? (
      <>
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path d="M15.12 12.32l.4-2.61h-2.5V8a1.31 1.31 0 0 1 1.48-1.42h1.15V4.24a14.07 14.07 0 0 0-2.05-.18c-2.08 0-3.45 1.26-3.45 3.56v2.1H7.83v2.61h2.32v6.31a12.06 12.06 0 0 0 3.87 0v-6.31h2.1z" fill="#ffffff" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M15.12 12.32l.4-2.61h-2.5V8a1.31 1.31 0 0 1 1.48-1.42h1.15V4.24a14.07 14.07 0 0 0-2.05-.18c-2.08 0-3.45 1.26-3.45 3.56v2.1H7.83v2.61h2.32v6.31a12.06 12.06 0 0 0 3.87 0v-6.31h2.1z" fill="currentColor" />
      </>
    )}
  </svg>
);
