'use client';
import { AdditionalItemsHydrator } from '@/components/additionalItemsHydrator';
import { Modal } from '@/components/modal';
import { useGoldData } from '@/features/others/hooks';
import {
  getDateHoursMinutesString,
  getDecimalOrNumber,
  getReadableDateString,
} from '@/lib/utils';
import { useDnFarmStore } from '@/store/dnfarm.store';
import { useState } from 'react';

const additionalItems = [
  'Ordinary Diamond',
  'Polished Agate',
  'Polished Alteum',
  'Polished Diamond',
  'Essence of Life',
  'Card Box',
  'Final Gold',
];

export default function WeeklyPage() {
  const [isRemove, setIsRemove] = useState({
    type: '',
    value: false,
  });
  const startAt = useDnFarmStore((s) => s.weeklyStartAt);
  const endAt = useDnFarmStore((s) => s.weeklyEndAt);
  const { data: goldData, isLoading } = useGoldData();
  const weeklyTimeRows = useDnFarmStore((s) => s.weeklyTimeRows);
  const weeklyItemRows = useDnFarmStore((s) => s.weeklyItemRows);
  const isValidToAddTimeRow =
    startAt === null &&
    endAt === null &&
    weeklyTimeRows.every((row) => row.startAt !== null && row.endAt !== null);
  const isValidToAddItemRow = weeklyItemRows.every(
    (row) => row.items.length > 0,
  );

  const setWeeklyStartAt = useDnFarmStore((s) => s.setWeeklyStartAt);
  const setWeeklyEndAt = useDnFarmStore((s) => s.setWeeklyEndAt);
  const addWeeklyTimeRow = useDnFarmStore((s) => s.addWeeklyTimeRow);
  const removeLatestWeeklyTimeRow = useDnFarmStore(
    (s) => s.removeLatestWeeklyTimeRow,
  );
  const removeLatestWeeklyItemRow = useDnFarmStore(
    (s) => s.removeLatestWeeklyItemRow,
  );
  const submitLatestWeeklyTimeRow = useDnFarmStore(
    (s) => s.submitLatestWeeklyTimeRow,
  );
  const submitLatestWeeklyItemRow = useDnFarmStore(
    (s) => s.submitLatestWeeklyItemRow,
  );
  const addWeeklyItemRow = useDnFarmStore((s) => s.addWeeklyItemRow);

  if (isLoading) {
    return <div>Loading gold prices...</div>;
  }

  const handleSubmitTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (startAt && endAt) {
      submitLatestWeeklyTimeRow();
    }
  };

  const handleSubmitItems = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = additionalItems.map((item) => ({
      name: item,
      quantity: Number(formData.get(item)) || 0,
    }));

    e.currentTarget.reset();

    submitLatestWeeklyItemRow(result);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 gap-2">
      <AdditionalItemsHydrator />
      {/* header */}
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-bold">Weekly Farming</h1>
        <p className="text-sm">
          Left side for time tracking and right side for item tracking.
        </p>
        <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={addWeeklyTimeRow}
            className={`${
              !isValidToAddTimeRow
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-green-600'
            } `}
            disabled={!isValidToAddTimeRow}
          >
            + New Time Row
          </button>
          <button
            type="button"
            onClick={() => setIsRemove({ type: 'time', value: true })}
            className={`${
              !weeklyTimeRows.length
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-red-600'
            } `}
            disabled={!weeklyTimeRows.length}
          >
            - Remove Latest Time Row
          </button>
          <Modal
            open={isRemove.value && isRemove.type === 'time'}
            onClose={() => setIsRemove({ type: '', value: false })}
          >
            <div className="text-background flex flex-row items-center gap-4">
              <p className="font-sans font-medium">Are you sure?</p>
              <button
                className="px-2 py-1 bg-red-700 rounded-md text-white cursor-pointer hover:bg-red-900"
                onClick={() => {
                  removeLatestWeeklyTimeRow();
                  setIsRemove({ type: '', value: false });
                }}
              >
                Yes, remove latest row
              </button>
            </div>
          </Modal>
          <button
            type="button"
            onClick={() =>
              addWeeklyItemRow(
                additionalItems.map((name) => ({
                  name,
                  quantity: 0,
                })),
              )
            }
            className={`${
              !isValidToAddItemRow
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-green-600'
            } `}
            disabled={!isValidToAddItemRow}
          >
            + New Item Row
          </button>
          <button
            type="button"
            onClick={() => setIsRemove({ type: 'item', value: true })}
            className={`${
              !weeklyItemRows.length
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-red-600'
            } `}
            disabled={!weeklyItemRows.length}
          >
            - Remove Latest Item Row
          </button>
          <Modal
            open={isRemove.value && isRemove.type === 'item'}
            onClose={() => setIsRemove({ type: '', value: false })}
          >
            <div className="text-background flex flex-row items-center gap-4">
              <p className="font-sans font-medium">Are you sure?</p>
              <button
                className="px-2 py-1 bg-red-700 rounded-md text-white cursor-pointer hover:bg-red-900"
                onClick={() => {
                  removeLatestWeeklyItemRow();
                  setIsRemove({ type: '', value: false });
                }}
              >
                Yes, remove latest row
              </button>
            </div>
          </Modal>
        </div>
      </div>
      {/* main content */}
      <main className="flex w-full flex-row gap-1">
        {/* Main Section */}
        <section className="flex-1 flex flex-row gap-1">
          {/* Time Table */}
          <div className="w-full h-140 overflow-y-auto border flex-1">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                    No
                  </th>
                  <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                    Duration (min)
                  </th>
                  <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {weeklyTimeRows.length ? (
                  weeklyTimeRows.map((row) => (
                    <tr
                      key={row.no}
                      className="hover:bg-foreground/10"
                    >
                      <td className="px-2 py-1 text-center">{row.no}</td>
                      <td className="px-2 py-1">
                        {getDecimalOrNumber(row.totalMinute, 2)} min
                      </td>
                      <td className="px-2 py-1">
                        {getReadableDateString(row.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="border px-2 py-1 text-center min-h-full"
                    >
                      No time rows available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-1 flex flex-col">
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
                          <p>{getDateHoursMinutesString(startAt)}</p>
                          <button
                            className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                            type="button"
                            onClick={() => setWeeklyStartAt(null)}
                          >
                            x
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`${
                            weeklyTimeRows.length === 0
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:text-green-500'
                          }`}
                          type="button"
                          onClick={() =>
                            setWeeklyStartAt(new Date().toISOString())
                          }
                          disabled={weeklyTimeRows.length === 0}
                        >
                          {weeklyTimeRows.length === 0
                            ? 'n/a'
                            : '> click to set start'}
                        </button>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {endAt ? (
                        <div className="flex flex-row items-center justify-between">
                          <p>{getDateHoursMinutesString(endAt)}</p>
                          <button
                            className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                            type="button"
                            onClick={() => setWeeklyEndAt(null)}
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
                          onClick={() =>
                            setWeeklyEndAt(new Date().toISOString())
                          }
                          disabled={!startAt}
                        >
                          {weeklyTimeRows.length === 0
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
              <div>
                <div className="w-full flex flex-row items-center justify-center gap-2 mt-1">
                  <button
                    type="submit"
                    className={`px-2 py-1 border rounded-md bg-green-900 text-white ${
                      !weeklyTimeRows.length || endAt === null
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    disabled={!weeklyTimeRows.length || endAt === null}
                    onClick={handleSubmitTimer}
                  >
                    {!weeklyTimeRows.length
                      ? 'No rows'
                      : endAt === null
                        ? 'Set end time'
                        : 'Submit Latest Row Data'}
                  </button>
                </div>
              </div>
            </section>
            {/* Item Section */}
            <form
              aria-labelledby="Item"
              onSubmit={handleSubmitItems}
            >
              <p id="Item">Item thingy</p>
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
                    return (
                      <tr key={item}>
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
                                    item.includes('Polished Diamond') ||
                                    item.includes('Essence of Life')
                                      ? 'text-yellow-600'
                                      : ''
                                  }
                                  ${
                                    item.includes('Card Box')
                                      ? 'text-yellow-400'
                                      : ''
                                  }
                                `}
                          >
                            {item}
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
                            name={item}
                            className="w-full text-center"
                            disabled={weeklyItemRows.length === 0}
                            onWheel={(e) => e.currentTarget.blur()}
                            onFocus={(e) => e.currentTarget.select()}
                            placeholder={
                              weeklyItemRows.length === 0 ? 'n/a' : '0'
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div>
                <div className="w-full flex flex-row items-center justify-center gap-2 mt-1">
                  <button
                    type="submit"
                    className={`px-2 py-1 border rounded-md bg-green-900 text-white ${
                      !weeklyItemRows.length
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    disabled={!weeklyItemRows.length}
                  >
                    {!weeklyItemRows.length
                      ? 'No rows'
                      : 'Submit Latest Row Data'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
        {/* Item Section */}
        <section className="flex-1">
          {/* Time Table */}
          <div className="w-full h-140 overflow-y-auto border flex-1">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {additionalItems.map((name) => (
                    <th
                      className="sticky top-0 bg-background border px-2 py-1 z-10 text-xs"
                      key={name}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {weeklyItemRows.length ? (
                  weeklyItemRows.map((row) =>
                    row.items ? (
                      <tr
                        key={row.no}
                        className="hover:bg-foreground/10"
                      >
                        {row.items.map((item) => (
                          <td
                            key={item.name}
                            className="px-2 py-1 text-center"
                          >
                            {item.quantity}
                          </td>
                        ))}
                      </tr>
                    ) : (
                      <tr
                        key={row.no}
                        className="hover:bg-foreground/10"
                      >
                        <td
                          colSpan={additionalItems.length}
                          className="border px-2 py-1 text-center min-h-full"
                        >
                          No item data available.
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={additionalItems.length}
                      className="border px-2 py-1 text-center min-h-full"
                    >
                      No item rows available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
