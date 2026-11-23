import React, { useState, useRef, useEffect } from "react";
import styles from "./styles/custom-date-picker.module.css";
import { FaCalendarAlt } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export interface CustomDatePickerProps {
  label?: string;
  request?: boolean;
  name: string;
  value?: string; // dd/MM/yyyy
  disabled?: boolean;
  placeholder?: string;
  errorMessage?: string;
  ariaLabel?: string;
  onChange?: (value: string) => void;
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

// Helper para transformar string 'dd/MM/yyyy' a objeto Date
const parseFormattedDate = (valStr?: string): Date | null => {
  if (!valStr || valStr.trim().length !== 10) return null;
  const parts = valStr.split("/");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
};

// Helper para formatear Date a 'dd/MM/yyyy'
const formatDateStr = (day: number, month: number, year: number): string => {
  const d = day.toString().padStart(2, "0");
  const m = (month + 1).toString().padStart(2, "0");
  return `${d}/${m}/${year}`;
};

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  request = false,
  name,
  value = "",
  disabled = false,
  placeholder = "dd/mm/aaaa",
  errorMessage,
  ariaLabel,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha seleccionada real
  const selectedDate = parseFormattedDate(value);

  // Mes y Año de vista del calendario
  const [viewDate, setViewDate] = useState<Date>(
    () => selectedDate || new Date(),
  );

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  // Manejo de Cierre con Click Outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Manejo de Cierre con Tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day: number, month: number, year: number) => {
    const formatted = formatDateStr(day, month, year);
    if (onChange) {
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    handleSelectDay(now.getDate(), now.getMonth(), now.getFullYear());
  };

  // Construcción de la grilla de días
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1; // Ajuste para inicio en Lunes (0)
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const today = new Date();
  const isToday = (d: number, m: number, y: number) =>
    d === today.getDate() &&
    m === today.getMonth() &&
    y === today.getFullYear();

  const isSelected = (d: number, m: number, y: number) =>
    selectedDate !== null &&
    d === selectedDate.getDate() &&
    m === selectedDate.getMonth() &&
    y === selectedDate.getFullYear();

  const gridCells = [];

  // Días mes anterior
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    gridCells.push({
      day: prevDay,
      month: prevMonth,
      year: prevYear,
      isOtherMonth: true,
    });
  }

  // Días mes actual
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    gridCells.push({
      day: d,
      month: currentMonth,
      year: currentYear,
      isOtherMonth: false,
    });
  }

  // Completa la última semana
  const remaining = 42 - gridCells.length; // 6 filas completas
  for (let i = 1; i <= remaining; i++) {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    gridCells.push({
      day: i,
      month: nextMonth,
      year: nextYear,
      isOtherMonth: true,
    });
  }

  const hasError = Boolean(errorMessage);

  return (
    <div className={styles.container} ref={containerRef}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {request && <span className={styles.required}> *</span>}
        </label>
      )}

      <div
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={ariaLabel || label || "Seleccionar fecha"}
        aria-expanded={isOpen}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleOpen();
          }
        }}
        className={`${styles.inputWrapper} ${hasError ? styles.inputError : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        <span className={value ? styles.textValue : styles.placeholder}>
          {value || placeholder}
        </span>
        <FaCalendarAlt size={16} className={styles.icon} />
      </div>

      {hasError && <span className={styles.errorText}>{errorMessage}</span>}

      {/* Popover Calendario */}
      {isOpen && (
        <div className={styles.popover} role="dialog" aria-modal="true">
          {/* Header del Calendario */}
          <div className={styles.calHeader}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
            >
              <FaChevronLeft size={18} />
            </button>
            <span className={styles.monthTitle}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              className={styles.navButton}
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
            >
              <FaChevronRight size={18} />
            </button>
          </div>

          {/* Días de la semana */}
          <div className={styles.weekDays}>
            {DAY_NAMES.map((d) => (
              <span key={d} className={styles.weekDayCell}>
                {d}
              </span>
            ))}
          </div>

          {/* Días del mes */}
          <div className={styles.daysGrid}>
            {gridCells.map((cell, idx) => {
              const selected = isSelected(cell.day, cell.month, cell.year);
              const todayMark = isToday(cell.day, cell.month, cell.year);

              return (
                <button
                  key={idx}
                  type="button"
                  aria-selected={selected}
                  className={`${styles.dayCell} ${
                    cell.isOtherMonth ? styles.otherMonth : ""
                  } ${todayMark ? styles.today : ""} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() =>
                    handleSelectDay(cell.day, cell.month, cell.year)
                  }
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer Hoy */}
          <div className={styles.calFooter}>
            <button
              type="button"
              className={styles.todayBtn}
              onClick={handleSelectToday}
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
