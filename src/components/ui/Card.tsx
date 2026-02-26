import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: Props) {
  return (
    <div
      className={cn('bg-white rounded-xl border border-gray-200 shadow-sm p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
