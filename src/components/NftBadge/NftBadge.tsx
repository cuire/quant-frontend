import React from 'react';

export interface NftBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text inside the badge, defaults to 'NFTs' */
  label?: string;
  /** If true, applies overlay positioning helper class */
  overlay?: boolean;
}

export const NftBadge: React.FC<NftBadgeProps> = ({ label = 'NFTs', overlay = false, className, ...rest }) => {
  const classes = ['activity-badge', 'activity-badge--nft'];
  if (overlay) classes.push('badge-overlay');
  if (className) classes.push(className);

  return (
    <span className={classes.join(' ')} {...rest}>
      {label}
    </span>
  );
};


