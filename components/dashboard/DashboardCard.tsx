'use client';

import { ReactNode, useRef, useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripHorizontal, GripVertical, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardLayout } from '@/lib/store/useDashboardLayout';

const SPAN_CLASSES: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
};

export const getSpanClass = (span: number) =>
  SPAN_CLASSES[span] ?? 'lg:col-span-1';

interface DashboardCardProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  headerAction?: ReactNode;
  defaultSpan?: number;
  maxSpan?: number;
  minSpan?: number;
  resizable?: boolean;
  deletable?: boolean;
  className?: string;
}

export function DashboardCard({
  id,
  title,
  description,
  children,
  headerAction,
  defaultSpan = 1,
  maxSpan = 3,
  minSpan = 1,
  resizable = false,
  deletable = true,
  className,
}: DashboardCardProps) {
  const { hidden, spans, hideCard, setSpan, moveCard } = useDashboardLayout();
  const dragStart = useRef<{ x: number; span: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  if (hidden[id]) return null;

  const span = spans[id] ?? defaultSpan;

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isDragging && e.dataTransfer.types.includes('text/plain')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const activeId = e.dataTransfer.getData('text/plain');
    if (activeId && activeId !== id) {
      moveCard(activeId, id);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDragOver(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!resizable) return;
    dragStart.current = { x: e.clientX, span };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!resizable || !dragStart.current) return;
    const delta = e.clientX - dragStart.current.x;
    let next = dragStart.current.span;
    if (delta > 60) next = Math.min(maxSpan, next + 1);
    else if (delta < -60) next = Math.max(minSpan, next - 1);
    dragStart.current = null;
    if (next !== span) setSpan(id, next);
  };

  return (
    <Card
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onDragLeave={() => setIsDragOver(false)}
      className={cn(
        'relative shadow-sm transition-shadow',
        SPAN_CLASSES[span],
        isDragging && 'opacity-40',
        isDragOver && 'ring-2 ring-primary/60',
        className
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {(headerAction || deletable) && (
          <CardAction>
            <div className="flex items-center gap-1">
              <button
                type="button"
                draggable
                onDragStart={handleDragStart}
                title="Drag to reorder"
                aria-label={`Reorder ${title}`}
                className="cursor-grab touch-none rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              {headerAction}
              {deletable && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => hideCard(id)}
                  title="Delete card"
                  aria-label={`Delete ${title}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {resizable && (
        <button
          type="button"
          title="Drag left/right to resize"
          aria-label="Resize card"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
          className="absolute bottom-1.5 right-1.5 z-10 hidden cursor-ew-resize touch-none select-none rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground lg:block"
        >
          <GripHorizontal className="h-4 w-4" />
        </button>
      )}
    </Card>
  );
}