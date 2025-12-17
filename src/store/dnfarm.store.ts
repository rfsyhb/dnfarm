import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { additionalItems, farmData, invaderData } from '@/lib/data';

type Row = {
  no: number;
  menit: number;
  additionalGold: number;
  additionalMinute: number;
  totalGold: number;
  totalMinute: number;
  createdAt: string;
};

type Dungeon =
  | 'Riverwort Village Ruins'
  | 'Dragon Follower Base'
  | 'Ancient Library'
  | 'East Ancient Armory'
  | 'West Ancient Armory';

type InvaderName = (typeof invaderData)[number]['name'];
type AdditionalName = (typeof additionalItems)[number]['name'];
type AdditionalItem = {
  name: (typeof additionalItems)[number]['name'];
  price: number;
};

const emptyInvaders = () =>
  Object.fromEntries(invaderData.map((i) => [i.name, 0])) as Record<
    InvaderName,
    number
  >;

const emptyAdditionals = () =>
  Object.fromEntries(additionalItems.map((i) => [i.name, 0])) as Record<
    AdditionalName,
    number
  >;

type DnFarmState = {
  rows: Row[];
  selectedDungeon?: Dungeon;
  invaderCounts: Record<InvaderName, number>;

  additionalItems: AdditionalItem[];
  additionalCounts: Record<AdditionalName, number>;

  setDungeon: (d?: Dungeon) => void;

  addRow: () => void;
  removeRow: () => void;

  setInvaderCount: (name: InvaderName, value: number) => void;

  setAdditionalItems: (items: AdditionalItem[]) => void;
  setAdditionalCount: (name: AdditionalName, value: number) => void;

  submitLatestRow: () => void;

  resetAll: () => void;
};

export const useDnFarmStore = create<DnFarmState>()(
  persist(
    (set, get) => ({
      rows: [],
      selectedDungeon: undefined,
      invaderCounts: emptyInvaders(),
      additionalCounts: emptyAdditionals(),
      additionalItems: additionalItems.map((i) => ({
        name: i.name,
        price: i.price,
      })),

      setDungeon: (d) => set({ selectedDungeon: d }),

      addRow: () => {
        const { rows, selectedDungeon } = get();
        const farm = selectedDungeon ? farmData[selectedDungeon] : null;

        const newRow: Row = {
          no: rows.length + 1,
          menit: farm ? farm.runDuration : 0,
          additionalGold: 0,
          additionalMinute: 0,
          totalGold: 0,
          totalMinute: 0,
          createdAt: new Date().toISOString(),
        };

        set({ rows: [...rows, newRow] });
      },

      removeRow: () => {
        const { rows } = get();
        if (!rows.length) return;
        set({ rows: rows.slice(0, -1) });
      },

      setInvaderCount: (name, value) =>
        set((s) => ({
          invaderCounts: { ...s.invaderCounts, [name]: Math.max(0, value) },
        })),

      setAdditionalItems: (items) => set({ additionalItems: items }),

      setAdditionalCount: (name, value) =>
        set((s) => ({
          additionalCounts: {
            ...s.additionalCounts,
            [name]: Math.max(0, value),
          },
        })),

      submitLatestRow: () => {
        const { rows, selectedDungeon, additionalCounts, invaderCounts } =
          get();
        const latestRow = rows[rows.length - 1];
        if (!latestRow || !selectedDungeon) return;

        const selectedFarmData = farmData[selectedDungeon];

        const additionalPriceByName = new Map<AdditionalName, number>(
          get().additionalItems.map((i) => [i.name, i.price])
        );

        const additionalGold = (
          Object.entries(additionalCounts) as [AdditionalName, number][]
        ).reduce((sum, [name, count]) => {
          const price = additionalPriceByName.get(name) ?? 0;
          return sum + price * Number(count);
        }, 0);

        const additionalMinute = Object.entries(invaderCounts).reduce(
          (sum, [name, count]) => {
            const invader = invaderData.find((i) => i.name === name);
            return sum + (invader ? invader.duration * Number(count) : 0);
          },
          0
        );

        const totalGold = selectedFarmData.defaultGoldEarned + additionalGold;
        const totalMinute = selectedFarmData.runDuration + additionalMinute;

        const newRows = [...rows];
        newRows[newRows.length - 1] = {
          ...latestRow,
          additionalGold,
          additionalMinute,
          totalGold,
          totalMinute,
        };

        set({
          rows: newRows,
          invaderCounts: emptyInvaders(),
          additionalCounts: emptyAdditionals(),
        });
      },

      resetAll: () =>
        set({
          rows: [],
          selectedDungeon: undefined,
          invaderCounts: emptyInvaders(),
          additionalCounts: emptyAdditionals(),
        }),
    }),
    {
      name: 'dnfarm:v1',
      storage: createJSONStorage(() => localStorage),

      partialize: (s) => ({
        rows: s.rows,
        selectedDungeon: s.selectedDungeon,
        invaderCounts: s.invaderCounts,
        additionalCounts: s.additionalCounts,
      }),
    }
  )
);
