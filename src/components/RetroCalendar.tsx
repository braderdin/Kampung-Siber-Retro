"use client";

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';

interface CalendarEvent {
  date: string;
  title: string;
}

interface RetroCalendarProps {
  events?: CalendarEvent[];
  showWeekDays?: boolean;
  className?: string;
}

const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function RetroCalendar({ 
  events = [],
  showWeekDays = true,
  className
}: RetroCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const eventDates = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= firstDay && eventDate <= lastDay;
    });
    setMonthEvents(eventDates);
  }, [currentDate, events]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (date: Date): string[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events
      .filter(e => e.date === dateStr)
      .map(e => e.title);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const renderCalendar = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const firstDayIndex = getDay(firstDayOfMonth);
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth
    });

    const calendarDays: (Date | null)[] = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(null);
    }

    for (const day of daysInMonth) {
      calendarDays.push(day);
    }

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }

    const rows = Math.ceil(calendarDays.length / 7);

    return (
      <div className="retro-calendar-grid">
        {/* Start: Weekday Headers */}
        {showWeekDays && (
          <div className="retro-calendar-weekdays grid grid-cols-7 gap-px bg-gray-300 dark:bg-gray-600">
            {(DAY_NAMES_EN as readonly string[]).map((day, index) => (
              <div 
                key={index}
                className="retro-calendar-weekday-header bg-gray-200 dark:bg-gray-700 h-8 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 pixel-font text-xs"
              >
                {day.substring(0, 3)}
              </div>
            ))}
          </div>
        )}
        {/* End: Weekday Headers */}

        {/* Start: Calendar Days */}
        <div className="retro-calendar-days grid grid-cols-7 gap-px bg-gray-300 dark:bg-gray-600">
          {calendarDays.map((day, index) => {
            const hasEvent = day && getEventsForDay(day).length > 0;
            const dayEvents = day ? getEventsForDay(day) : [];
            
            return (
              <div
                key={index}
                className={`
                  retro-calendar-day
                  h-10
                  flex items-center justify-center
                  text-xs pixel-font
                  relative
                  ${day ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'}
                  ${day && isToday(day) ? 'bg-yellow-200 dark:bg-yellow-900 border-2 border-yellow-400' : ''}
                  ${day && !isToday(day) ? 'border border-gray-100 dark:border-gray-700' : ''}
                `}
              >
                {day && (
                  <span 
                    className={`
                      ${isToday(day) ? 'font-bold text-yellow-800 dark:text-yellow-200' : 'text-gray-700 dark:text-gray-300'}
                    `}
                  >
                    {day.getDate()}
                  </span>
                )}
                {hasEvent && (
                  <div 
                    className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-blue-500 rounded-full"
                    title={dayEvents.join(', ')}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* End: Calendar Days */}
      </div>
    );
  };

  return (
    <div className={`retro-calendar-wrapper ${className || ''}`}>
      {/* Start: Calendar Header */}
      <div className="retro-calendar-header flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">
          {MONTH_NAMES_EN[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={goToCurrentMonth}
          className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
          aria-label="Current month"
        >
          🏠
        </button>
      </div>
      {/* End: Calendar Header */}

      {/* Start: Calendar Body */}
      <div className="retro-calendar-body">
        {renderCalendar()}
      </div>
      {/* End: Calendar Body */}

      {/* Start: Legend */}
      {monthEvents.length > 0 && (
        <div className="retro-calendar-legend mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 pixel-font mb-1">
            {monthEvents.length} events:
          </div>
          <div className="flex flex-wrap gap-2">
            {monthEvents.map((event, index) => (
              <span 
                key={index}
                className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded pixel-font"
              >
                {event.title}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* End: Legend */}
    </div>
  );
}