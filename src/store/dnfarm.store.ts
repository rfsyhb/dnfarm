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
};

type Dungeon =
  | 'Riverwort Village Ruins'
  | 'Dragon Follower Base'
  | 'Ancient Library'
  | 'East Ancient Armory'
  | 'West Ancient Armory';

type InvaderName = (typeof invaderData)[number]['name'];
type AdditionalName = (typeof additionalItems)[number]['name'];

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
  additionalCounts: Record<AdditionalName, number>;

  setDungeon: (d?: Dungeon) => void;

  addRow: () => void;
  removeRow: () => void;

  setInvaderCount: (name: InvaderName, value: number) => void;
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

        const additionalGold = Object.entries(additionalCounts).reduce(
          (sum, [name, count]) => {
            const item = additionalItems.find((i) => i.name === name);
            return sum + (item ? item.price * Number(count) : 0);
          },
          0
        );

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
