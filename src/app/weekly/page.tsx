'use client';
import { AdditionalItemsHydrator } from '@/components/additionalItemsHydrator';
import { Modal } from '@/components/modal';
import { useGoldData } from '@/features/others/hooks';
import { getDateHoursMinutesString, getDecimalOrNumber, getReadableDateString } from '@/lib/utils';
import { useDnFarmStore } from '@/store/dnfarm.store';

export default function WeeklyPage() {
  const startAt = useDnFarmStore((s) => s.weeklyStartAt);
  const endAt = useDnFarmStore((s) => s.weeklyEndAt);
  const { data: goldData, isLoading } = useGoldData();
  const weeklyTimeRows = useDnFarmStore((s) => s.weeklyTimeRows);
  const isValidToAddRow =
    startAt === null &&
    endAt === null &&
    weeklyTimeRows.every((row) => row.startAt !== null && row.endAt !== null);

  const setWeeklyStartAt = useDnFarmStore((s) => s.setWeeklyStartAt);
  const setWeeklyEndAt = useDnFarmStore((s) => s.setWeeklyEndAt);
  const addWeeklyTimeRow = useDnFarmStore((s) => s.addWeeklyTimeRow);
  const submitLatestWeeklyTimeRow = useDnFarmStore(
    (s) => s.submitLatestWeeklyTimeRow,
  );

  if (isLoading) {
    return <div>Loading gold prices...</div>;
  }

  const handleSubmitTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (startAt && endAt) {
      submitLatestWeeklyTimeRow();
    }
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
        <div>
          <button
            type="button"
            onClick={addWeeklyTimeRow}
            className={`${
              !isValidToAddRow
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:text-green-600'
            } `}
            disabled={!isValidToAddRow}
          >
            Add Row
          </button>
        </div>
      </div>
      {/* main content */}
      <main className="flex w-full flex-row">
        {/* Time Section */}
        <section className="flex-1 flex flex-row gap-1">
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
                      <td className="px-2 py-1 text-right">{getDecimalOrNumber(row.totalMinute, 2)}</td>
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
            </section>
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
                {/* <button
                  type="button"
                  className={`px-2 py-1 border rounded-md bg-red-900 text-white ${
                    !weeklyTimeRows.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  disabled={!weeklyTimeRows.length}
                  onClick={() => {
                    setIsReset(true);
                  }}
                >
                  {!weeklyTimeRows.length ? 'No data to reset' : 'Reset All Data'}
                </button> */}

                {/* <Modal
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
                </Modal> */}
              </div>
            </div>
          </div>
        </section>
        {/* Item Section */}
        <section className="flex-1">
          <p>Item</p>
        </section>
      </main>
    </div>
  );
}
