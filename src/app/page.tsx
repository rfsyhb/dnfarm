'use client';
import { AdditionalItemsHydrator } from '@/components/additionalItemsHydrator';
import { additionalItems, farmData, goldRate, invaderData } from '@/lib/data';
import { useDnFarmStore } from '@/store/dnfarm.store';

type Dungeon =
  | 'Riverwort Village Ruins'
  | 'Dragon Follower Base'
  | 'Ancient Library'
  | 'East Ancient Armory'
  | 'West Ancient Armory';

export default function Home() {
  const rows = useDnFarmStore((s) => s.rows);
  const selectedDungeon = useDnFarmStore((s) => s.selectedDungeon);
  const invaderCounts = useDnFarmStore((s) => s.invaderCounts);
  const additionalCounts = useDnFarmStore((s) => s.additionalCounts);

  const setDungeon = useDnFarmStore((s) => s.setDungeon);
  const addRow = useDnFarmStore((s) => s.addRow);
  const removeRow = useDnFarmStore((s) => s.removeRow);
  const setInvaderCount = useDnFarmStore((s) => s.setInvaderCount);
  const setAdditionalCount = useDnFarmStore((s) => s.setAdditionalCount);
  const submitLatestRow = useDnFarmStore((s) => s.submitLatestRow);
  const resetAll = useDnFarmStore((s) => s.resetAll);

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

  const totalRuns = rows.length;
  const totalGoldEarned = rows.reduce((sum, row) => sum + row.totalGold, 0);
  const totalTimeSpent = rows.reduce((sum, row) => sum + row.totalMinute, 0);
  const totalRupiahEarned = Math.round((totalGoldEarned / 100) * goldRate);

  const getDateString = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
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
                : 'cursor-pointer'
            } hover:text-green-600`}
            disabled={!isValidToAddRow}
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={removeRow}
            className={`${
              !rows.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } hover:text-red-600`}
            disabled={!rows.length}
          >
            Remove Row
          </button>
        </div>
        {/* table and configuration */}
        <div className="flex flex-row gap-2 w-full">
          <div className="h-130 w-full flex-3 overflow-y-auto border">
            <table className={`w-full ${rows.length ? '' : 'h-full'} border`}>
              <thead className="sticky top-0 bg-background">
                <tr>
                  {[
                    'No',
                    'Base Minute',
                    'Additional Gold',
                    'Additional Minute',
                    'Total Gold',
                    'Total Minute',
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
                    <tr key={row.no}>
                      <td className="border px-2 py-1">{row.no}</td>
                      <td className="border px-2 py-1">{row.menit}</td>
                      <td className="border px-2 py-1">{row.additionalGold}</td>
                      <td className="border px-2 py-1">
                        {row.additionalMinute}
                      </td>
                      <td className="border px-2 py-1">{row.totalGold}</td>
                      <td className="border px-2 py-1">{row.totalMinute}</td>
                      <td className="border px-2 py-1">
                        {getDateString(row.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="border px-2 py-1 text-center min-h-full"
                    >
                      No rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-1">
            <form>
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
                            disabled={rows.length === 0}
                            placeholder={rows.length === 0 ? 'n/a' : '0'}
                            value={invaderCounts[name]}
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
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th
                        className="border px-2 py-1"
                        scope="col"
                      >
                        Item
                      </th>
                      <th
                        className="border px-2 py-1"
                        scope="col"
                      >
                        Quantity
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {additionalItems.map((item) => (
                      <tr key={item.name}>
                        <th
                          className="border text-left px-2"
                          scope="row"
                        >
                          {item.name}
                        </th>
                        <td className="border">
                          <input
                            type="number"
                            min={0}
                            className="w-full text-center"
                            disabled={rows.length === 0}
                            placeholder={rows.length === 0 ? 'n/a' : '0'}
                            value={additionalCounts[item.name]}
                            onChange={(e) =>
                              setAdditionalCount(
                                item.name,
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <div className="w-full flex flex-row items-center justify-center gap-2 mt-4">
                <button
                  type="submit"
                  className={`px-2 py-1 border rounded-md bg-green-900 text-white ${
                    !rows.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={!rows.length}
                  onClick={handleSubmit}
                >
                  Submit Latest Row Data
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 border rounded-md bg-red-900 text-white ${
                    !rows.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={!rows.length}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>

            <div>
              <h2 className="font-bold mt-4">Final Data</h2>
              <table className="table-fixed w-full">
                <tbody>
                  <tr>
                    <th className="border px-2 text-left">Total Run</th>
                    <td className="border px-2 text-right">{totalRuns}</td>
                  </tr>
                  <tr>
                    <th className="border px-2 text-left">Gold Earned</th>
                    <td className="border px-2 text-right">
                      {totalGoldEarned}
                    </td>
                  </tr>
                  <tr>
                    <th className="border px-2 text-left">Time Spent (min)</th>
                    <td className="border px-2 text-right">{totalTimeSpent}</td>
                  </tr>
                  <tr>
                    <th className="border px-2 text-left">Rupiah Rate</th>
                    <td className="border px-2 text-right">
                      {totalRupiahEarned}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {selectedFarmData ? (
              <p className="text-sm opacity-70 mt-2">
                Base: {selectedFarmData.defaultGoldEarned} gold /{' '}
                {selectedFarmData.runDuration} menit
              </p>
            ) : (
              <p className="text-xs opacity-70 mt-2">
                select a dungeon to see base data.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* footer */}
    </div>
  );
}

