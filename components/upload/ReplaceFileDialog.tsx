'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileUploader } from './FileUploader';

const triggerClasses =
  'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

export function ReplaceFileDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<button type="button" className={triggerClasses} />}
      >
        <Upload className="h-4 w-4" />
        Replace Excel File
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Replace data source</DialogTitle>
          <DialogDescription>
            Upload a new Excel file to replace the current dataset. All views
            update immediately.
          </DialogDescription>
        </DialogHeader>
        <FileUploader onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}