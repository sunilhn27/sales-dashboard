import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const DEFAULT_ORDER = [
  'brand-channel',
  'brand',
  'category',
  'insights',
  'discount',
  'top-categories',
  'store',
  'location',
  'trend',
];

interface DashboardLayoutState {
  hidden: Record<string, boolean>;
  spans: Record<string, number>;
  order: string[];
  hideCard: (id: string) => void;
  restoreCard: (id: string) => void;
  setSpan: (id: string, span: number) => void;
  moveCard: (activeId: string, overId: string) => void;
  restoreAll: () => void;
}

// Safe storage fallback so the store also works during SSR
const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } satisfies Storage;
  }
  return localStorage;
});

export const useDashboardLayout = create<DashboardLayoutState>()(
  persist(
    (set) => ({
      hidden: {},
      spans: {},
      order: DEFAULT_ORDER,
      hideCard: (id) =>
        set((s) => ({ hidden: { ...s.hidden, [id]: true } })),
      restoreCard: (id) =>
        set((s) => {
          const hidden = { ...s.hidden };
          delete hidden[id];
          return { hidden };
        }),
      setSpan: (id, span) =>
        set((s) => ({ spans: { ...s.spans, [id]: span } })),
      moveCard: (activeId, overId) =>
        set((s) => {
          const order = [...s.order];
          const from = order.indexOf(activeId);
          const to = order.indexOf(overId);
          if (from === -1 || to === -1 || from === to) return s;
          order.splice(from, 1);
          const insertAt = order.indexOf(overId) + (from < to ? 1 : 0);
          order.splice(insertAt, 0, activeId);
          return { order };
        }),
      restoreAll: () => set({ hidden: {}, spans: {}, order: DEFAULT_ORDER }),
    }),
    { name: 'dashboard-layout', storage }
  )
);