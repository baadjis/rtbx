export const BrandLogo = () => (
  <div className="flex justify-center items-center gap-3 mb-6">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="url(#logo-grad)" />
    </svg>
    <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      RetailBox
    </span>
  </div>
);