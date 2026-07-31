"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  id?: string;
  name?: string;
  value?: string; // YYYY-MM-DD format
  onChange?: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAYS_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({
  id,
  name,
  value = "",
  onChange,
  required = false,
  disabled = false,
  className = "",
  placeholder,
}: DatePickerProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const months = locale === "en" ? MONTHS_EN : MONTHS_RU;
  const daysOfWeek = locale === "en" ? DAYS_EN : DAYS_RU;

  // Initialize calendar view to the selected date or current date
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update view when value changes from outside
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedString = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange?.(formattedString);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  // Generate lists of years (1900 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 6 }, (_, i) => currentYear + 5 - i);

  // Generate days grid for current viewMonth and viewYear
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday starting
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysGrid.push(i);
  }

  // Format selected value for display
  const getDisplayValue = () => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;

    if (locale === "en") {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    return `${d.getDate()} ${MONTHS_RU[d.getMonth()].toLowerCase().replace(/ь$/, "я").replace(/й$/, "я").replace(/т$/, "та")} ${d.getFullYear()} г.`;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/30 transition-all duration-300 hover:border-white/20 focus-within:border-gold-500/40 focus-within:ring-1 focus-within:ring-gold-500/20 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <CalendarIcon className="h-4 w-4 shrink-0 text-ivory-200/30" />
          {value ? (
            <span className="truncate text-ivory-100">{getDisplayValue()}</span>
          ) : (
            <span className="truncate text-ivory-200/30">
              {placeholder || (locale === "en" ? "Select date" : "Выберите дату")}
            </span>
          )}
        </div>
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-0.5 text-ivory-200/35 hover:bg-white/10 hover:text-ivory-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hidden input for HTML Forms */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
      />

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-white/15 bg-charcoal-900 p-4 shadow-2xl backdrop-blur-xl sm:w-80">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-lg border border-white/10 bg-white/5 p-1 text-ivory-200 hover:bg-white/10 hover:text-ivory-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value))}
                className="bg-black/50 border border-white/10 rounded-lg text-xs px-2 py-1 text-ivory-100 focus:outline-none focus:border-gold-500/40"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value))}
                className="bg-black/50 border border-white/10 rounded-lg text-xs px-2 py-1 text-ivory-100 focus:outline-none focus:border-gold-500/40"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-lg border border-white/10 bg-white/5 p-1 text-ivory-200 hover:bg-white/10 hover:text-ivory-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ivory-200/40 py-2">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {daysGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-8" />;
              }

              const formattedMonth = String(viewMonth + 1).padStart(2, "0");
              const formattedDay = String(day).padStart(2, "0");
              const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === dateStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs transition-all duration-200 ${
                    isSelected
                      ? "bg-gold-500 text-black font-semibold shadow-[0_0_12px_rgba(196,169,98,0.4)]"
                      : "text-ivory-200 hover:bg-white/10 hover:text-ivory-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
