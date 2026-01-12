import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { additionalItems, farmData, invaderData } from '@/lib/data';
import { getMsDurationString } from '@/lib/utils';

type CalculationDetails = {
  invaderData: Record<InvaderName, number>;
  additionalItemsData: Record<AdditionalName, number>;
  baseGold: number;
  baseMinutes: number;
  usingBaseGold: boolean;
  dungeonName: Dungeon;
};

type Row = {
  no: number;
  menit: number;
  additionalGold: number;
  additionalMinute: number;
  totalGold: number;
  totalMinute: number;
  createdAt: string;
  details?: CalculationDetails;
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

  startAt: string | null;
  endAt: string | null;

  setDungeon: (d?: Dungeon) => void;

  addRow: () => void;
  removeRow: () => void;

  setStartAt: (start: string | null) => void;
  setEndAt: (end: string | null) => void;

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
      startAt: null,
      endAt: null,

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

      setStartAt: (start) => {
        if (start === null) {
          set({
            startAt: null,
            endAt: null,
          });
        }
        set({ startAt: start });
      },
      setEndAt: (end) => set({ endAt: end }),

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
        let isNotUsingBaseGold = false;
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

          if (name === 'Final Gold' && count > 0) isNotUsingBaseGold = true;
          if (price <= 0) return sum; // skip no-price (not profitable) items

          // if using base gold then Polished Agate and Polished Alteum is skipped
          if (name === 'Polished Agate' && !isNotUsingBaseGold) return sum;
          if (name === 'Polished Alteum' && !isNotUsingBaseGold) return sum;

          return sum + price * Number(count);
        }, 0);

        // Additional gold from board quest
        const finalAdditionalGold = isNotUsingBaseGold ? additionalGold + (0.6 * 3) : additionalGold;

        const additionalMinute = !get().startAt
          ? Object.entries(invaderCounts).reduce((sum, [name, count]) => {
              const invader = invaderData.find((i) => i.name === name);
              return sum + (invader ? invader.duration * Number(count) : 0);
            }, 0)
          : getMsDurationString(get().startAt ?? '', get().endAt ?? '') / 60000;
        const totalGold = isNotUsingBaseGold
          ? finalAdditionalGold
          : selectedFarmData.defaultGoldEarned + finalAdditionalGold;
        const totalMinute = get().startAt
          ? additionalMinute
          : selectedFarmData.runDuration + additionalMinute;

        const invaderDataRecord = Object.fromEntries(
          Object.entries(invaderCounts).map(([name, count]) => [
            name,
            Number(count),
          ])
        ) as Record<InvaderName, number>;
        const additionalItemsDataRecord = Object.fromEntries(
          Object.entries(additionalCounts).map(([name, count]) => [
            name,
            Number(count),
          ])
        ) as Record<AdditionalName, number>;
        const details: CalculationDetails = {
          invaderData: invaderDataRecord,
          additionalItemsData: additionalItemsDataRecord,
          baseGold: selectedFarmData.defaultGoldEarned,
          baseMinutes: selectedFarmData.runDuration,
          usingBaseGold: !!get().startAt,
          dungeonName: selectedDungeon,
        };

        const newRows = [...rows];
        newRows[newRows.length - 1] = {
          ...latestRow,
          additionalGold,
          additionalMinute,
          totalGold,
          totalMinute,
          details,
        };

        set({
          rows: newRows,
          startAt: null,
          endAt: null,
          invaderCounts: emptyInvaders(),
          additionalCounts: emptyAdditionals(),
        });
      },

      resetAll: () =>
        set({
          rows: [],
          invaderCounts: emptyInvaders(),
          additionalCounts: emptyAdditionals(),
        }),
    }),
    {
      name: 'dnfarm:v2',
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
