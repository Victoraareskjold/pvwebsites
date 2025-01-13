"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";

import { useState } from "react";

export function IncomeCalculator() {
  const config = useSiteConfig();
  const [elPrice, setElPrice] = useState(1.5);
  const [yearlyPrice, setYearlyPrice] = useState(elPrice * 13000);

  const handleChange = (event) => {
    const value = event.target.value;
    setElPrice(value);
    setYearlyPrice(elPrice * 13000);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden w-full"
      style={{ borderColor: "#FF9D00" }}
    >
      <div className="p-4 gap-6 flex flex-col ">
        <h4 className="text-center ">Inntekt Kalkulator</h4>
        <div className="flex flex-row gap-2 self-center">
          <img src="/wave.png" className="w-6 h-6" />
          <h5 className="text-center text-orange-500 ">
            {config.potentialSaving?.header2 ||
              "Det handler ikke bare om kWh pris - solceller kutter også nettleien."}
          </h5>
        </div>

        <h5 className="text-center ">
          {config.potentialSaving?.p2 ||
            "“Dra slideren og estimer gjennomsnittlig (kWh + nettleiepris).”"}
        </h5>
        <input
          type="range"
          min={0.1}
          max={6}
          step={0.1}
          className="w-full sliderStyling self-center"
          value={elPrice}
          onChange={handleChange}
        />
        <div className="flex flex-row justify-between">
          <h5>0 Kr</h5>
          <h5>2 Kr</h5>
          <h5>4 Kr</h5>
          <h5>6 Kr</h5>
        </div>
        <h5 className="italic text-center">
          {config.potentialSaving?.p3 ||
            "Din anslåtte gjennomsnittlige strømpris: "}
          <span className="text-red-500 font-bold">{elPrice}</span> kr kWh.
        </h5>
        <div className="h-px w-full bg-regularOrange"></div>
        <h4 className=" text-center font-semibold">
          Inntekt fra solenergi per år:{" "}
          {Number(yearlyPrice.toFixed(0)).toLocaleString("no-NO")},-
        </h4>
      </div>
      <div>
        <h4 className=" text-center text-white bg-black w-full p-4 rounded-xl mb-0 font-semibold">
          Inntekt fra solenergi over 30 år:{" "}
          {Number((yearlyPrice * 30).toFixed(0)).toLocaleString("no-NO")},-
        </h4>
      </div>
    </div>
  );
}
