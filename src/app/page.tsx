'use client';
import { AdditionalItemsHydrator } from '@/components/additionalItemsHydrator';
import { Modal } from '@/components/modal';
import { useGoldData } from '@/features/others/hooks';
import { farmData, goldRate as defaultGoldRate, invaderData } from '@/lib/data';
import { getDecimalOrNumber, getReadableDateString } from '@/lib/utils';
import { useDnFarmStore } from '@/store/dnfarm.store';
import { useState } from 'react';
import type { additionalItems } from '@/lib/data';

type Dungeon =
  | 'Riverwort Village Ruins'
  | 'Dragon Follower Base'
  | 'Ancient Library'
  | 'East Ancient Armory'
  | 'West Ancient Armory';

type AdditionalName = (typeof additionalItems)[number]['name'];
type InvaderName = 'Gawyn' | 'Kanna';

type FinalData = {
  totalGoldEarned: number;
  totalTimeSpent: number;
  rowsCount: number;
  totalInvaderCounts: Record<InvaderName, number>;
  totalAdditionalCounts: Record<AdditionalName, number>;
};

export default function Home() {
  const startAt = useDnFarmStore((s) => s.startAt);
  const endAt = useDnFarmStore((s) => s.endAt);
  const rows = useDnFarmStore((s) => s.rows);
  const additionalItems = useDnFarmStore((s) => s.additionalItems);
  const selectedDungeon = useDnFarmStore((s) => s.selectedDungeon);
  const invaderCounts = useDnFarmStore((s) => s.invaderCounts);
  const additionalCounts = useDnFarmStore((s) => s.additionalCounts);
  const { data: goldData, isLoading } = useGoldData();
  const [isReset, setIsReset] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [openDetailData, setOpenDetailData] = useState(false);
  const [openDetailAllData, setOpenDetailAllData] = useState(false);

  const setDungeon = useDnFarmStore((s) => s.setDungeon);
  const addRow = useDnFarmStore((s) => s.addRow);
  const removeRow = useDnFarmStore((s) => s.removeRow);
  const setStartAt = useDnFarmStore((s) => s.setStartAt);
  const setEndAt = useDnFarmStore((s) => s.setEndAt);
  const setInvaderCount = useDnFarmStore((s) => s.setInvaderCount);
  const setAdditionalCount = useDnFarmStore((s) => s.setAdditionalCount);
  const submitLatestRow = useDnFarmStore((s) => s.submitLatestRow);
  const resetAll = useDnFarmStore((s) => s.resetAll);

  if (isLoading) {
    return <div>Loading gold prices...</div>;
  }

  const selectedFarmData = selectedDungeon ? farmData[selectedDungeon] : null;

  const latestRow = rows[rows.length - 1] ?? null;
  const isLatestRowNotSubmitted =
    latestRow && (latestRow.totalMinute === 0 || latestRow.totalGold === 0);
  const isDungeonSelected = Boolean(selectedDungeon);
  const isValidToAddRow = isDungeonSelected && !isLatestRowNotSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLatestRow();
  };

  const handleReset = () => {
    resetAll();
    // kalau mau sekalian hapus storage: useDnFarmStore.persist.clearStorage();
  };

  const goldRate = goldData ? goldData.gold_rate_sell : defaultGoldRate;

  const totalRuns = rows.length;
  const totalGoldEarned = rows.reduce((sum, row) => sum + row.totalGold, 0);
  const totalTimeSpent = rows.reduce((sum, row) => sum + row.totalMinute, 0);
  const totalRupiahEarned = Math.round((totalGoldEarned / 100) * goldRate);

  const getDateHoursMinutes = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const calculateFinalData = (data: typeof rows): FinalData => {
    const finalData: FinalData = {
      rowsCount: data.length,
      totalGoldEarned: data.reduce((sum, row) => sum + row.totalGold, 0),
      totalTimeSpent: data.reduce((sum, row) => sum + row.totalMinute, 0),
      totalInvaderCounts: data.reduce((acc, row) => {
        if (row.details) {
          for (const [name, count] of Object.entries(row.details.invaderData)) {
            acc[name as InvaderName] = (acc[name as InvaderName] || 0) + count;
          }
        }
        return acc;
      }, {} as Record<InvaderName, number>),
      totalAdditionalCounts: data.reduce((acc, row) => {
        if (row.details) {
          for (const [name, count] of Object.entries(
            row.details.additionalItemsData
          )) {
            acc[name as AdditionalName] =
              (acc[name as AdditionalName] || 0) + count;
          }
        }
        return acc;
      }, {} as Record<AdditionalName, number>),
    };
    return finalData;
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8">
      <AdditionalItemsHydrator />
      {/* header */}
      <div className="flex flex-row gap-2 items-center w-full">
        <h1 className="text-xl font-bold">dnFarm helper</h1>
        <select
          value={selectedDungeon}
          onChange={(e) => setDungeon((e.target.value || undefined) as Dungeon)}
          className="bg-background"
        >
          <option value="">Select a dungeon</option>
          <option value="Riverwort Village Ruins">
            Riverwort Village Ruins
          </option>
          <option value="Dragon Follower Base">Dragon Follower Base</option>
          <option value="Ancient Library">Ancient Library</option>
          <option value="East Ancient Armory">East Ancient Armory</option>
          <option value="West Ancient Armory">West Ancient Armory</option>
        </select>
      </div>
      {/* content */}
      <div className="w-full">
        <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={addRow}
            className={`${
              !isValidToAddRow
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-green-600'
            } `}
            disabled={!isValidToAddRow}
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={() => setIsRemove(true)}
            className={`${
              !rows.length
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-red-600'
            } `}
            disabled={!rows.length}
          >
            Remove Row
          </button>
          <Modal
            open={isRemove}
            onClose={() => setIsRemove(false)}
          >
            <div className="text-background flex flex-row items-center gap-4">
              <p className="font-sans font-medium">Are you sure?</p>
              <button
                className="px-2 py-1 bg-red-700 rounded-md text-white cursor-pointer hover:bg-red-900"
                onClick={() => {
                  removeRow();
                  setIsRemove(false);
                }}
              >
                Yes, remove latest row
              </button>
            </div>
          </Modal>
          <button
            type="button"
            onClick={() => setOpenDetailAllData(true)}
            className={`${
              !rows.length
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-blue-600'
            } `}
            disabled={!rows.length}
          >
            View Details
          </button>
          <Modal
            open={openDetailAllData}
            onClose={() => setOpenDetailAllData(false)}
          >
            <div className="text-background w-100 max-h-160 ">
              <h2 className="font-bold text-xl">All Rows Detail Content</h2>
              {rows.length ? (
                <div>
                  {calculateFinalData(rows).rowsCount} rows calculated.
                  <pre className="max-h-140 overflow-auto bg-black text-foreground bg-opacity-20 p-2 rounded-md">
                    {JSON.stringify(calculateFinalData(rows), null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No rows available.
                </p>
              )}
            </div>
          </Modal>
        </div>
        {/* table and configuration */}
        <div className="flex flex-row gap-2 w-full items-center">
          <div className="h-140 w-full flex-3 overflow-y-auto border">
            <table className={`w-full ${rows.length ? '' : 'h-full'} border`}>
              <thead className="sticky top-0 bg-background">
                <tr>
                  {[
                    'No',
                    'Dungeon Name',
                    'Card Box',
                    'Gawyn',
                    'Kanna',
                    'Total Gold',
                    'Total Minute',
                    'Details',
                    'Created At',
                  ].map((header) => (
                    <th
                      key={header}
                      className="border px-2 py-1 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {rows.length ? (
                  rows.map((row) => (
                    <tr
                      key={row.no}
                      className={`${
                        row.totalMinute === 0 ? 'bg-yellow-900' : ''
                      }`}
                    >
                      <td className="border px-2 py-1">{row.no}</td>
                      <td className="border px-2 py-1">
                        {row.details?.dungeonName ?? 'Not Available'}
                      </td>
                      <td className="border px-2 py-1">
                        {row.details?.additionalItemsData['Card Box'] ?? 0}
                      </td>
                      <td className="border px-2 py-1">
                        {row.details?.invaderData['Gawyn'] ?? 0}
                      </td>
                      <td className="border px-2 py-1">
                        {row.details?.invaderData['Kanna'] ?? 0}
                      </td>
                      <td className="border px-2 py-1">
                        {getDecimalOrNumber(row.totalGold, 2)}
                      </td>
                      <td className="border px-2 py-1">
                        {getDecimalOrNumber(row.totalMinute, 2)}
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          className="hover:underline cursor-pointer"
                          type="button"
                          onClick={() => setOpenDetailData(true)}
                        >
                          View Details
                        </button>
                        <Modal
                          open={openDetailData}
                          onClose={() => setOpenDetailData(false)}
                        >
                          <div className="text-background w-100 max-h-160 ">
                            <h2 className="font-bold text-xl">
                              Detail Content
                            </h2>
                            {row.details ? (
                              <div className="">
                                {/* Basic Info */}
                                <div className="text-sm">
                                  <p>
                                    <span className="font-medium">
                                      Dungeon Name:
                                    </span>{' '}
                                    {row.details.dungeonName}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Base Gold:
                                    </span>{' '}
                                    {row.details.baseGold}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Base Minutes:
                                    </span>{' '}
                                    {row.details.baseMinutes}
                                  </p>
                                  <ul className="text-sm">
                                    {Object.entries(
                                      row.details.invaderData
                                    ).map(([name, count]) => (
                                      <li key={name}>
                                        {name}: {count}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Additional Items */}
                                <div className="">
                                  <h3 className="font-semibold">
                                    Additional Items
                                  </h3>
                                  <div className="overflow-x-auto">
                                    <table className="w-full border border-border text-sm">
                                      <thead className="bg-muted">
                                        <tr>
                                          <th className="px-3 py-1 text-left">
                                            Item
                                          </th>
                                          <th className="px-3 py-1 text-right">
                                            Count
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Object.entries(
                                          row.details.additionalItemsData
                                        ).map(([name, count]) => (
                                          <tr
                                            key={name}
                                            className="border-t border-border"
                                          >
                                            <td className="px-3 py-1">
                                              {name}
                                            </td>
                                            <td className="px-3 py-1 text-right">
                                              {count}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No details available.
                              </p>
                            )}
                          </div>
                        </Modal>
                      </td>
                      <td className="border px-2 py-1">
                        {getReadableDateString(row.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="border px-2 py-1 text-center min-h-full"
                    >
                      No rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-1 flex flex-col">
            <form className="flex flex-col gap-1">
              <section aria-labelledby="invader">
                <p id="invader">Invader thingy</p>
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr>
                      {invaderData.map(({ name }) => (
                        <th
                          key={name}
                          className="border px-2 py-1 text-left"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {invaderData.map(({ name }) => (
                        <td
                          key={name}
                          className="border"
                        >
                          <input
                            type="number"
                            min={0}
                            className="w-full text-center"
                            disabled={rows.length === 0 || !isDungeonSelected}
                            placeholder={
                              rows.length === 0 ? 'n/a' : 'not profitable'
                            }
                            value={rows.length === 0 ? '' : invaderCounts[name]}
                            onChange={(e) =>
                              setInvaderCount(name, Number(e.target.value))
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </section>

              <section aria-labelledby="additional">
                <p id="additional">Additional stuff</p>

                <div className="max-h-40 overflow-y-auto">
                  <table className="w-full table-fixed border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-background">
                      <tr>
                        <th
                          className="px-2 py-1 border-t border-l border-b"
                          scope="col"
                        >
                          Item
                        </th>
                        <th
                          className="px-2 py-1 border-t border-l border-r border-b"
                          scope="col"
                        >
                          Quantity
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {additionalItems.map((item, idx) => {
                        const isLast = idx === additionalItems.length - 1;
                        const isNotFirst = idx > 0;
                        const isNotProfit = item.price <= 0;
                        return (
                          <tr key={item.name}>
                            <th
                              scope="row"
                              className={[
                                'px-2 text-left font-normal',
                                'border-l border-gray-300',
                                isLast ? 'border-b' : '',
                                isNotFirst ? 'border-t' : '',
                              ].join(' ')}
                            >
                              <span
                                className={`
                                  ${
                                    isNotProfit ? 'opacity-50 line-through' : ''
                                  }
                                  ${
                                    item.name.includes('UQ')
                                      ? 'text-purple-400'
                                      : ''
                                  }
                                  ${
                                    item.name.includes('LG')
                                      ? 'text-red-400'
                                      : ''
                                  }
                                  ${
                                    item.name.includes('EP')
                                      ? 'text-yellow-400'
                                      : ''
                                  }
                                  ${
                                    item.name.includes('Polished Diamond') ||
                                    item.name.includes('Ordinary Diamond') ||
                                    item.name.includes('Essence of Life')
                                      ? 'text-yellow-600'
                                      : ''
                                  }
                                  ${
                                    item.name.includes('Card Box')
                                      ? 'text-yellow-400'
                                      : ''
                                  }
                                `}
                              >
                                {item.name}
                              </span>
                            </th>

                            <td
                              className={[
                                'border-l border-r border-gray-300',
                                isLast ? 'border-b' : '',
                                isNotFirst ? 'border-t' : '',
                              ].join(' ')}
                            >
                              <input
                                type="number"
                                min={0}
                                className="w-full text-center"
                                disabled={rows.length === 0}
                                placeholder={
                                  rows.length === 0 ? 'n/a' : 'not profitable'
                                }
                                value={
                                  rows.length === 0
                                    ? ''
                                    : additionalCounts[item.name]
                                }
                                onChange={(e) =>
                                  setAdditionalCount(
                                    item.name,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section aria-labelledby="Time">
                <p id="Time">Time thingy</p>
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="border px-2 py-1 text-left">Start At</th>
                      <th className="border px-2 py-1 text-left">End At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">
                        {startAt ? (
                          <div className="flex flex-row items-center justify-between">
                            <p>{getDateHoursMinutes(startAt)}</p>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                              type="button"
                              onClick={() => setStartAt(null)}
                            >
                              x
                            </button>
                          </div>
                        ) : (
                          <button
                            className={`${
                              rows.length === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:text-green-500'
                            }`}
                            type="button"
                            onClick={() => setStartAt(new Date().toISOString())}
                            disabled={rows.length === 0}
                          >
                            {rows.length === 0 ? 'n/a' : '> click to set start'}
                          </button>
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        {endAt ? (
                          <div className="flex flex-row items-center justify-between">
                            <p>{getDateHoursMinutes(endAt)}</p>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                              type="button"
                              onClick={() => setEndAt(null)}
                            >
                              x
                            </button>
                          </div>
                        ) : (
                          <button
                            className={`${
                              !startAt
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:text-green-500'
                            }`}
                            type="button"
                            onClick={() => setEndAt(new Date().toISOString())}
                            disabled={!startAt}
                          >
                            {rows.length === 0
                              ? 'n/a'
                              : !startAt
                              ? 'set start first!'
                              : '> click to set end'}
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <div className="w-full flex flex-row items-center justify-center gap-2 mt-1">
                <button
                  type="submit"
                  className={`px-2 py-1 border rounded-md bg-green-900 text-white ${
                    !rows.length || endAt === null
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={!rows.length || endAt === null}
                  onClick={handleSubmit}
                >
                  {!rows.length
                    ? 'No rows'
                    : endAt === null
                    ? 'Set end time'
                    : 'Submit Latest Row Data'}
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 border rounded-md bg-red-900 text-white ${
                    !rows.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={!rows.length}
                  onClick={() => {
                    setIsReset(true);
                  }}
                >
                  {!rows.length ? 'No data to reset' : 'Reset All Data'}
                </button>

                <Modal
                  open={isReset}
                  onClose={() => setIsReset(false)}
                >
                  <div className="text-background flex flex-row items-center gap-4">
                    <p className="font-sans font-medium">Reset all data?</p>
                    <button
                      className="px-2 py-1 bg-red-700 rounded-md text-white cursor-pointer hover:bg-red-900"
                      onClick={() => {
                        handleReset();
                        setIsReset(false);
                      }}
                    >
                      Yes, reset all
                    </button>
                  </div>
                </Modal>
              </div>
            </form>

            <div>
              <h2 className="font-bold mt-2">Final Data</h2>
              <table className="table-fixed w-full">
                <tbody>
                  <tr>
                    <th className="border font-normal px-2 text-left">
                      Total Run
                    </th>
                    <td className="border px-2 text-right">{totalRuns}</td>
                  </tr>
                  <tr>
                    <th className="border font-normal px-2 text-left">
                      Gold Earned
                    </th>
                    <td className="border px-2 text-right">
                      {getDecimalOrNumber(totalGoldEarned, 2)}
                    </td>
                  </tr>
                  <tr>
                    <th className="border font-normal px-2 text-left">
                      Time Spent (min)
                    </th>
                    <td className="border px-2 text-right">
                      {getDecimalOrNumber(totalTimeSpent, 2)}
                    </td>
                  </tr>
                  <tr>
                    <th className="border font-normal px-2 text-left">
                      IDR Rate (rmt)
                    </th>
                    <td className="border px-2 text-right">
                      {totalRupiahEarned}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-sm opacity-70 mt-2">
              {selectedFarmData ? (
                <p>
                  Base: {selectedFarmData.defaultGoldEarned} gold /{' '}
                  {selectedFarmData.runDuration} min
                </p>
              ) : (
                <p>No dungeon selected.</p>
              )}
              <p>Current gold rate: Rp {goldRate} / 100 gold</p>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
    </div>
  );
}

