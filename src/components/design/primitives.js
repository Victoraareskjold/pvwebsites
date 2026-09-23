"use client";

/**
 * Små UI-primitiver for designmalen.
 *
 * Designreferansen brukte shadcn + Radix. Prosjektet kjører Tailwind 3 og
 * har ikke de pakkene, så primitivene er skrevet om her. De setter de samme
 * data-slot/data-state-attributtene som src/styles/design.css peker på,
 * slik at designets CSS kan brukes uendret.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "./icons";

/* ------------------------------------------------------------------ */
/* Trekkspill (FAQ og forutsetningene i kalkulatoren)                   */
/* ------------------------------------------------------------------ */

export function Accordion({ items, className }) {
  const [open, setOpen] = useState(null);

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.key ?? index}
            data-slot="accordion-item"
            data-state={isOpen ? "open" : "closed"}
          >
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                data-slot="accordion-trigger"
                data-state={isOpen ? "open" : "closed"}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                {item.trigger}
                <ChevronDown size={18} />
              </button>
            </h3>
            {isOpen && (
              <div data-slot="accordion-content" data-state="open">
                <div>{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Faner (batteriseksjonen)                                             */
/* ------------------------------------------------------------------ */

export function Tabs({ value, onValueChange, tabs, className, label }) {
  const active = tabs.find((t) => t.id === value) || tabs[0];

  return (
    <div className={className} data-slot="tabs">
      <div data-slot="tabs-list" role="tablist" aria-label={label}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === value}
            aria-controls={`tabpanel-${tab.id}`}
            data-slot="tabs-trigger"
            data-state={tab.id === value ? "active" : "inactive"}
            onClick={() => onValueChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        data-slot="tabs-content"
        role="tabpanel"
        id={`tabpanel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
      >
        {active.content}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skyvekontroll (kalkulatoren)                                         */
/* ------------------------------------------------------------------ */

export function Slider({ min, max, step = 1, value, onValueChange, ariaLabelledBy, ariaLabel }) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div data-slot="slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        onChange={(e) => onValueChange(Number(e.target.value))}
      />
      <div data-slot="slider-track">
        <div data-slot="slider-range" style={{ width: `${percent}%` }} />
      </div>
      <div data-slot="slider-thumb" style={{ left: `${percent}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal og mobilmeny                                                   */
/* ------------------------------------------------------------------ */

function useOverlay(open, onClose) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    const focusable = ref.current?.querySelector(
      "input:not([type=hidden]), button, a[href], textarea, select",
    );
    focusable?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return ref;
}

export function Dialog({ open, onClose, className, labelledBy, children }) {
  const ref = useOverlay(open, onClose);
  const onBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div data-slot="dialog-overlay" onMouseDown={onBackdrop}>
      <div
        ref={ref}
        data-slot="dialog-content"
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogTitle({ id, children }) {
  return (
    <h2 data-slot="dialog-title" id={id}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children }) {
  return <p data-slot="dialog-description">{children}</p>;
}

export function Sheet({ open, onClose, className, labelledBy, children }) {
  const ref = useOverlay(open, onClose);
  const onBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div data-slot="sheet-overlay" onMouseDown={onBackdrop}>
      <div
        ref={ref}
        data-slot="sheet-content"
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetTitle({ id, children }) {
  return (
    <h2 data-slot="sheet-title" id={id}>
      {children}
    </h2>
  );
}

export function SheetDescription({ children }) {
  return <p data-slot="sheet-description">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Radiogruppe (hva forespørselen gjelder)                              */
/* ------------------------------------------------------------------ */

export function RadioGroup({ name, value, onValueChange, options, className, legend }) {
  const id = useId();

  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      {legend && <legend>{legend}</legend>}
      <div className={className} role="radiogroup">
        {options.map((option) => {
          // Et valg er enten en ren streng eller { value, icon }.
          const optionValue = typeof option === "string" ? option : option.value;
          const icon = typeof option === "string" ? null : option.icon;
          return (
            <label key={optionValue} className={value === optionValue ? "selected" : ""}>
              <input
                type="radio"
                name={name}
                id={`${id}-${optionValue}`}
                value={optionValue}
                checked={value === optionValue}
                onChange={() => onValueChange(optionValue)}
              />
              {icon && <img src={icon} alt="" aria-hidden="true" />}
              <span>{optionValue}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
