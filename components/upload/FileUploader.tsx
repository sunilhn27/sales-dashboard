'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDataStore } from '@/lib/store/useDataStore';
import { parseExcelBuffer } from '@/lib/data/parser';

interface FileUploaderProps {
  onSuccess?: () => void;
}

export function FileUploader({ onSuccess }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [phase, setPhase] = useState<'uploading' | 'processing'>('uploading');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setRows } = useDataStore();

  // Clean up the simulated parse-progress timer if the component unmounts mid-upload
  useEffect(() => {
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);
      setPhase('processing');
      setProgress(0);
      setFileName(file.name);

      // Simulate parsing progress since it's synchronous and can block the main thread
      progressTimer.current = setInterval(() => {
        setProgress((prev) => Math.min(95, prev + 5));
      }, 50);

      const reader = new FileReader();

      reader.onload = (e) => {
        if (progressTimer.current) {
          clearInterval(progressTimer.current);
          progressTimer.current = null;
        }

        try {
          const buffer = e.target?.result as ArrayBuffer;
          const rows = parseExcelBuffer(buffer);
          setProgress(100);
          
          // Slight delay to show 100% before transition
          setTimeout(() => {
            setRows(rows, file.name);
            onSuccess?.();
            setIsUploading(false);
          }, 300);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse Excel file. Please ensure it is a valid format.');
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        if (progressTimer.current) {
          clearInterval(progressTimer.current);
          progressTimer.current = null;
        }
        setError('Failed to read file locally. Please try again.');
        setIsUploading(false);
      };

      reader.readAsArrayBuffer(file);
    },
    [setRows, onSuccess]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isUploading
            ? 'border-muted bg-muted/50 cursor-not-allowed'
            : 'border-border hover:border-primary hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">
              {phase === 'uploading' ? 'Uploading file...' : 'Processing file...'}
            </p>
            <div className="w-full max-w-xs space-y-1.5">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate max-w-[70%]">{fileName}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                Drop your Excel file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}
    </Card>
  );
}