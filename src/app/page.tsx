'use client';
import { farmData } from '@/lib/data';
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

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon>();

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
          <button onClick={addRow}>Add Row</button>
          <button onClick={removeRow}>Remove Row</button>
        </div>
        {/* table and configuration */}
        <div className="flex flex-row gap-2 w-full">
          <div className="h-120 w-full flex-3 overflow-y-auto border">
            <table className="w-full border">
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
                {rows.map((row) => (
                  <tr key={row.no}>
                    <td className="border px-2 py-1">{row.no}</td>
                    <td className="border px-2 py-1">{row.menit}</td>
                    <td className="border px-2 py-1">{row.additionalGold}</td>
                    <td className="border px-2 py-1">{row.additionalMinute}</td>
                    <td className="border px-2 py-1">{row.totalGold}</td>
                    <td className="border px-2 py-1">{row.totalMinute}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-1">configure</div>
        </div>
      </div>
      {/* footer */}
    </div>
  );
}

