'use client';
import { additionalItems, farmData, invaderData } from '@/lib/data';
import { useState } from 'react';

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

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon>();
  const [invaderCounts, setInvaderCounts] = useState<
    Record<InvaderName, number>
  >(
    () =>
      Object.fromEntries(invaderData.map((i) => [i.name, 0])) as Record<
        InvaderName,
        number
      >
  );
  const [additionalCounts, setAdditionalCounts] = useState<
    Record<AdditionalName, number>
  >(
    () =>
      Object.fromEntries(additionalItems.map((i) => [i.name, 0])) as Record<
        AdditionalName,
        number
      >
  );

  const selectedFarmData = selectedDungeon ? farmData[selectedDungeon] : null;
  const DEFAULT_ROW: Row = {
    no: rows.length + 1,
    menit: selectedFarmData ? selectedFarmData.runDuration : 0,
    additionalGold: 0,
    additionalMinute: 0,
    totalGold: 0,
    totalMinute: 0,
  };

  const addRow = () => setRows((prev) => [...prev, { ...DEFAULT_ROW }]);
  const removeRow = () => setRows((prev) => prev.slice(0, -1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`latest row is ${JSON.stringify(latestRow)}`);
  };

  const handleReset = () => {
    alert('resetting');
  };

  const latestRow = rows[rows.length - 1] ? rows[rows.length - 1] : null;
  const isLatestRowNotSubmitted =
    latestRow && (latestRow.totalMinute === 0 || latestRow.totalGold === 0);
  const isDungeonSelected = Boolean(selectedDungeon);
  const isValidToAddRow = isDungeonSelected && !isLatestRowNotSubmitted;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8">
      {/* header */}
      <div className="flex flex-row gap-2 items-center w-full">
        <h1 className="text-xl font-bold">dnFarm helper</h1>
        <select
          value={selectedDungeon}
          onChange={(e) => setSelectedDungeon(e.target.value as Dungeon)}
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
            }`}
            disabled={!isValidToAddRow}
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={removeRow}
            className={`${
              !rows.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={!rows.length}
          >
            Remove Row
          </button>
        </div>
        {/* table and configuration */}
        <div className="flex flex-row gap-2 w-full">
          <div className="h-120 w-full flex-3 overflow-y-auto border">
            <table className={`w-full ${rows.length ? '' : 'h-full'} border`}>
              <thead className="sticky top-0 bg-background">
                <tr>
                  {[
                    'No',
                    'Menit',
                    'Additional Gold',
                    'Additional Minute',
                    'Total Gold',
                    'Total Minute',
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
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
                              setInvaderCounts((prev) => ({
                                ...prev,
                                [name]: Number(e.target.value),
                              }))
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
                              setAdditionalCounts((prev) => ({
                                ...prev,
                                [item.name]: Number(e.target.value),
                              }))
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
                  Submit
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
          </div>
        </div>
      </div>
      {/* footer */}
    </div>
  );
}

