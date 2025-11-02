
import React from 'react';

interface LoadingProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className = "h-5 w-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
    <path d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" fill="currentColor" className="opacity-75" />
  </svg>
);

export default Loading;
