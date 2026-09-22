"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

import { fetchAgendas } from "@/lib/store/slices/agendas";
import { fetchMembers } from "@/lib/store/slices/members";
import { fetchMe } from "@/lib/store/slices/users";
import { todayInputDate } from "@/utils/dateHelpers";
import { getEventType } from "@/utils/eventTypes";
import { eventDayKeysInYear } from "@/utils/eventDates";

import DayModal from "./DayModal";
import AgendaRemove from "./Remove";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = Array.from({ length: 12 }, (_, index) =>
  capitalize(
    new Date(2000, index, 1).toLocaleDateString("fr-FR", { month: "long" }),
  ),
);

function pad(value) {
  return String(value).padStart(2, "0");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildMonthGrid(year, month) {
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;
  const cells = [];

  for (let i = 0; i < totalCells; i++) {
    const day = i - leadingBlanks + 1;
    if (day >= 1 && day <= daysInMonth) {
      cells.push({
        key: `${year}-${pad(month + 1)}-${pad(day)}`,
        day,
      });
    } else {
      cells.push({ key: `empty-${i}`, day: null });
    }
  }
  return cells;
}

export default function Agenda({ groupId }) {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.agendas.items);
  const members = useSelector((state) => state.members.items);
  const me = useSelector((state) => state.users.me);

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const currentMember = members.find(
    (member) => (member.user?._id || member.user) === me._id,
  );

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchMembers({ groupId }));
    dispatch(fetchAgendas({ groupId }));
  }, [dispatch, groupId]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayKey = todayInputDate();

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const event of events) {
      for (const key of eventDayKeysInYear(event, year)) {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(event);
      }
    }
    return map;
  }, [events, year]);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const yearOptions = useMemo(() => {
    const years = new Set([year, new Date().getFullYear()]);
    for (let offset = -10; offset <= 10; offset++) {
      years.add(new Date().getFullYear() + offset);
    }
    for (const event of events) {
      const startYear = new Date(event.date).getFullYear();
      if (!Number.isNaN(startYear)) years.add(startYear);
      if (event.endDate) {
        const endYear = new Date(event.endDate).getFullYear();
        if (!Number.isNaN(endYear)) years.add(endYear);
      }
    }
    return [...years].sort((a, b) => a - b);
  }, [events, year]);

  function changeMonth(offset) {
    setCurrentDate(new Date(year, month + offset, 1));
  }

  function changeMonthSelect(nextMonth) {
    setCurrentDate(new Date(year, nextMonth, 1));
  }

  function changeYearSelect(nextYear) {
    setCurrentDate(new Date(nextYear, month, 1));
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center gap-2 cursor-pointer text-left"
      >
        <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 grow">
          Agenda
        </span>
        {isOpen ? (
          <ChevronUpIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <ChevronDownIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              title="Mois précédent"
              className="p-1 rounded-full cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <ChevronLeftIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
            </button>
            <div className="flex items-center justify-center min-w-28 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-700/40 px-3 py-1">
              <select
                value={month}
                onChange={(event) => changeMonthSelect(Number(event.target.value))}
                title="Choisir le mois"
                className="w-full appearance-none text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100 bg-transparent cursor-pointer hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none"
              >
                {MONTHS.map((monthName, index) => (
                  <option key={monthName} value={index}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center min-w-16 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-700/40 px-3 py-1">
              <select
                value={year}
                onChange={(event) => changeYearSelect(Number(event.target.value))}
                title="Choisir l'année"
                className="w-full appearance-none text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100 bg-transparent cursor-pointer hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none"
              >
                {yearOptions.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              title="Mois suivant"
              className="p-1 rounded-full cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <ChevronRightIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
              >
                {weekday}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              if (!cell.day) {
                return <div key={cell.key} className="min-h-[48px]" />;
              }
              const isToday = cell.key === todayKey;
              const dayEvents = eventsByDay.get(cell.key) || [];
              const dayDots = [
                ...new Set(dayEvents.map((event) => getEventType(event.type).dot)),
              ].slice(0, 3);

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDay(cell.key)}
                  title="Voir le jour"
                  className={`rounded-md border p-1 min-h-[48px] cursor-pointer transition flex flex-col items-center justify-center gap-0.5 ${
                    isToday
                      ? "bg-purple-50 dark:bg-purple-900/30 ring-1 ring-purple-300 border-purple-200 dark:border-purple-700"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {dayDots.length > 0 && (
                    <div className="flex items-center gap-0.5">
                      {dayDots.map((dotClass) => (
                        <span
                          key={dotClass}
                          className={`size-2 rounded-full ${dotClass}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            Cliquez sur un jour pour voir ou ajouter un événement.
          </p>

          {selectedDay && (
            <DayModal
              dayKey={selectedDay}
              groupId={groupId}
              currentMember={currentMember}
              events={events}
              members={members}
              onDelete={setDeleteEvent}
              onClose={() => setSelectedDay(null)}
            />
          )}

          {deleteEvent && (
            <AgendaRemove
              groupId={groupId}
              event={deleteEvent}
              open
              onClose={() => setDeleteEvent(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}