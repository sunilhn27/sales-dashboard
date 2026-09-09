'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const ACCENTS = [
  { id: 'indigo', color: '#6366f1', label: 'Indigo' },
  { id: 'blue', color: '#3b82f6', label: 'Blue' },
  { id: 'green', color: '#10b981', label: 'Green' },
  { id: 'rose', color: '#f43f5e', label: 'Rose' },
  { id: 'violet', color: '#8b5cf6', label: 'Violet' },
] as const;

type AccentId = (typeof ACCENTS)[number]['id'];

const DARK_KEY = 'theme-dark';
const ACCENT_KEY = 'theme-accent';

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    return (localStorage.getItem(key) as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}

export function ThemeSettings() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [accent, setAccent] = useState<AccentId>('indigo');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
    setIsDark(readStored<string>(DARK_KEY, 'false') === 'true');
    const saved = readStored(ACCENT_KEY, 'indigo');
    setAccent(ACCENTS.some((a) => a.id === saved) ? (saved as AccentId) : 'indigo');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(DARK_KEY, String(isDark));
    } catch {
      // ignore
    }
  }, [isDark, mounted]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      // ignore
    }
  }, [accent]);

  return (
    <div className="mt-3 space-y-3 border-t border-border pt-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Appearance
      </p>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          {isDark ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-primary" />
          )}
          Dark Mode
        </span>
        <Switch checked={isDark} onCheckedChange={setIsDark} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Accent</span>
        <div className="flex items-center gap-1.5">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              title={a.label}
              aria-label={`${a.label} accent`}
              onClick={() => setAccent(a.id)}
              className={cn(
                'h-5 w-5 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                accent === a.id &&
                  'ring-2 ring-foreground/50 ring-offset-2 ring-offset-background'
              )}
              style={{ backgroundColor: a.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}