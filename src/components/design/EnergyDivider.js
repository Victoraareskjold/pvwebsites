/**
 * Dekorativ energilinje rundt Solkart-seksjonen.
 *
 * Levert av Asbjørn i runde 2 (smart-elektro-energilinjer-victor.zip),
 * konvertert fra TypeScript til prosjektets JavaScript. Kun utseende:
 * ingen script-avhengigheter, ingen klikkflate, respekterer
 * prefers-reduced-motion via EnergyDivider.module.css.
 *
 * Bruk: <EnergyDivider position="top" /> og
 *       <EnergyDivider position="bottom" reverse /> inne i en
 *       seksjon med position:relative og isolation:isolate.
 */

'use client';

import { useId } from 'react';
import styles from './EnergyDivider.module.css';

/** Decorative only. Place twice inside a position:relative section. */
export default function EnergyDivider({ position, reverse = false, paused = false }) {
  const id = `energy-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const className = [styles.divider, styles[position], reverse ? styles.reverse : '', paused ? styles.paused : ''].filter(Boolean).join(' ');
  return (
    <div className={className} aria-hidden="true">
<svg viewBox="0 0 1600 64" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id={`${id}-warm`} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
      <stop offset="0" stopColor="#df741c"/><stop offset=".18" stopColor="#f7a62e"/><stop offset=".40" stopColor="#ffd77e"/><stop offset=".50" stopColor="#fff2bc"/><stop offset=".62" stopColor="#ffcd65"/><stop offset=".84" stopColor="#ec8c25"/><stop offset="1" stopColor="#df741c"/>
    </linearGradient>
    <linearGradient id={`${id}-core`} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
      <stop offset="0" stopColor="#ffc568" stopOpacity=".35"/><stop offset=".27" stopColor="#ffcf70" stopOpacity=".55"/><stop offset=".45" stopColor="#fff1b7"/><stop offset=".57" stopColor="#fff7d6"/><stop offset=".76" stopColor="#ffd278" stopOpacity=".5"/><stop offset="1" stopColor="#ffc568" stopOpacity=".35"/>
    </linearGradient>
    <path id={`${id}-wave-a`} d="M0 32 C45 32 55 29.4 100 29.4 S155 32 200 32 S255 34.6 300 34.6 S355 32 400 32 C445 32 455 29.4 500 29.4 S555 32 600 32 S655 34.6 700 34.6 S755 32 800 32 C845 32 855 29.4 900 29.4 S955 32 1000 32 S1055 34.6 1100 34.6 S1155 32 1200 32 C1245 32 1255 29.4 1300 29.4 S1355 32 1400 32 S1455 34.6 1500 34.6 S1555 32 1600 32 C1645 32 1655 29.4 1700 29.4 S1755 32 1800 32 S1855 34.6 1900 34.6 S1955 32 2000 32 C2045 32 2055 29.4 2100 29.4 S2155 32 2200 32 S2255 34.6 2300 34.6 S2355 32 2400 32 C2445 32 2455 29.4 2500 29.4 S2555 32 2600 32 S2655 34.6 2700 34.6 S2755 32 2800 32 C2845 32 2855 29.4 2900 29.4 S2955 32 3000 32 S3055 34.6 3100 34.6 S3155 32 3200 32"/>
    <path id={`${id}-wave-b`} d="M0 32 C36 32 44 30.7 80 30.7 S124 32 160 32 S204 33.3 240 33.3 S284 32 320 32 C356 32 364 30.7 400 30.7 S444 32 480 32 S524 33.3 560 33.3 S604 32 640 32 C676 32 684 30.7 720 30.7 S764 32 800 32 S844 33.3 880 33.3 S924 32 960 32 C996 32 1004 30.7 1040 30.7 S1084 32 1120 32 S1164 33.3 1200 33.3 S1244 32 1280 32 C1316 32 1324 30.7 1360 30.7 S1404 32 1440 32 S1484 33.3 1520 33.3 S1564 32 1600 32 C1636 32 1644 30.7 1680 30.7 S1724 32 1760 32 S1804 33.3 1840 33.3 S1884 32 1920 32 C1956 32 1964 30.7 2000 30.7 S2044 32 2080 32 S2124 33.3 2160 33.3 S2204 32 2240 32 C2276 32 2284 30.7 2320 30.7 S2364 32 2400 32 S2444 33.3 2480 33.3 S2524 32 2560 32 C2596 32 2604 30.7 2640 30.7 S2684 32 2720 32 S2764 33.3 2800 33.3 S2844 32 2880 32 C2916 32 2924 30.7 2960 30.7 S3004 32 3040 32 S3084 33.3 3120 33.3 S3164 32 3200 32"/>
    <path id={`${id}-wave-c`} d="M0 32 C45 32 55 28.2 100 28.2 S155 32 200 32 S255 35.8 300 35.8 S355 32 400 32 C445 32 455 28.2 500 28.2 S555 32 600 32 S655 35.8 700 35.8 S755 32 800 32 C845 32 855 28.2 900 28.2 S955 32 1000 32 S1055 35.8 1100 35.8 S1155 32 1200 32 C1245 32 1255 28.2 1300 28.2 S1355 32 1400 32 S1455 35.8 1500 35.8 S1555 32 1600 32 C1645 32 1655 28.2 1700 28.2 S1755 32 1800 32 S1855 35.8 1900 35.8 S1955 32 2000 32 C2045 32 2055 28.2 2100 28.2 S2155 32 2200 32 S2255 35.8 2300 35.8 S2355 32 2400 32 C2445 32 2455 28.2 2500 28.2 S2555 32 2600 32 S2655 35.8 2700 35.8 S2755 32 2800 32 C2845 32 2855 28.2 2900 28.2 S2955 32 3000 32 S3055 35.8 3100 35.8 S3155 32 3200 32"/>
  </defs>
  <path className={styles.rail} d="M0 32H1600"/>
  <g className={styles.ribbon + " " + styles.ribbonA}>
    <use className={styles.halo} href={`#${id}-wave-a`} stroke={`url(#${id}-warm)`}/>
    <use className={styles.body} href={`#${id}-wave-a`} stroke={`url(#${id}-warm)`}/>
  </g>
  <g className={styles.ribbon + " " + styles.ribbonB}><use className={styles.core} href={`#${id}-wave-b`} stroke={`url(#${id}-core)`}/></g>
  <g className={styles.ribbon + " " + styles.ribbonC}><use className={styles.filament} href={`#${id}-wave-c`} stroke={`url(#${id}-warm)`}/></g>
</svg>
    </div>
  );
}
