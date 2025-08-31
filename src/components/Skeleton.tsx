import React from 'react';

interface SkeletonProps {
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          style={{
            height: '200px',
            backgroundColor: '#2A3036',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            padding: '16px'
          }}
          className={className}
        >
          {/* Title skeleton */}
          <div
            style={{
              height: '16px',
              backgroundColor: '#3F4249',
              borderRadius: '4px',
              marginBottom: '8px',
              width: '70%'
            }}
          />
          
          {/* Gift number skeleton */}
          <div
            style={{
              height: '14px',
              backgroundColor: '#3F4249',
              borderRadius: '4px',
              marginBottom: '16px',
              width: '40%'
            }}
          />
          
          {/* Price skeleton */}
          <div
            style={{
              height: '24px',
              backgroundColor: '#3F4249',
              borderRadius: '4px',
              marginBottom: '16px',
              width: '60%'
            }}
          />
          
          {/* Fast sale badge skeleton */}
          <div
            style={{
              height: '20px',
              backgroundColor: '#3F4249',
              borderRadius: '10px',
              width: '50%'
            }}
          />
          
          {/* Animated shimmer effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
      ))}
    </>
  );
};
