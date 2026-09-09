import { ReactNode } from 'react';

interface PageWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageWrapper({ title, description, children }: PageWrapperProps) {
  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
