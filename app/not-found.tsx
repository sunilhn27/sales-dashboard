import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="rounded-full bg-primary/10 p-5">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">404</h2>
        <p className="text-muted-foreground">
          This page could not be found.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants({ size: 'default' })}>
        Back to Dashboard
      </Link>
    </div>
  );
}