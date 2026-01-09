import { useEffect, useMemo } from "react";

export default function SolarEconomicCalculation({
  yearlyProduction,
  elPrice,
  elNetPrice,
  expectedElPriceIncrease,
  investmentCost,
  inverterCost,
  onPaybackCalculated,
}) {
  const DEGRADATION_RATE = 0.004;
  const YEARS = 30;
  const REPLACEMENT_YEAR = 15;
  const INVERTER_MULTIPLIER = 1.4;

  const yearlyData = useMemo(() => {
    const data = [];
    let cumulativeTotal = -investmentCost;
    let total = 0;
    const basePrice = elPrice + elNetPrice;

    for (let year = 1; year <= YEARS; year++) {
      const production =
        yearlyProduction * Math.pow(1 - DEGRADATION_RATE, year - 1);

      const pricePerKwh =
        basePrice * Math.pow(1 + expectedElPriceIncrease / 100, year - 1);

      const yearlySavings = production * pricePerKwh;

      const replacementCost =
        year === REPLACEMENT_YEAR ? inverterCost * INVERTER_MULTIPLIER : 0;

      const totalSaved = yearlySavings + replacementCost + total;
      total = totalSaved;

      cumulativeTotal = totalSaved - investmentCost;

      data.push({
        year,
        production: Math.round(production),
        pricePerKwh: pricePerKwh.toFixed(2),
        yearlySavings: Math.round(yearlySavings),
        replacementCost: Math.round(replacementCost),
        totalSaved: Math.round(totalSaved),
        cumulative: Math.round(cumulativeTotal),
      });
    }

    return data;
  }, [
    yearlyProduction,
    elPrice,
    elNetPrice,
    expectedElPriceIncrease,
    investmentCost,
    inverterCost,
  ]);

  const summary = useMemo(() => {
    if (!yearlyData.length) return null;

    const lastYear = yearlyData[yearlyData.length - 1];

    return {
      totalSavings30Years: lastYear.totalSaved,
      averageYearlySavings: Math.round(lastYear.totalSaved / YEARS),
    };
  }, [yearlyData]);

  const paybackYear = useMemo(() => {
    const found = yearlyData.find((row) => row.cumulative >= 0);
    return found ? found.year : null;
  }, [yearlyData]);

  useEffect(() => {
    if (onPaybackCalculated && paybackYear != null && summary) {
      onPaybackCalculated({
        paybackYear,
        ...summary,
      });
    }
  }, [paybackYear, summary, onPaybackCalculated]);

  const formatValue = (number) =>
    number.toLocaleString("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div className="flex flex-col gap-6 !w-full col-span-2">
      {/* Data Table */}
      <div className="overflow-x-auto bg-white !w-full rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">År</th>
              <th className="px-4 py-3 text-right font-semibold">
                Produksjon (kWh)
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Pris (kr/kWh)
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Årlig besparelse (kr)
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Utskiftning (kr)
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Totalt spart (kr)
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Kumulativ (kr)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8 text-left">2025</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className="px-4 py-8 text-right text-orange-500 font-semibold">
                {formatValue(investmentCost)}
              </td>
            </tr>
            {yearlyData.map((data, index) => (
              <tr
                key={data.year}
                className={`border-b hover:bg-gray-50 ${
                  data.cumulative >= 0 && yearlyData[index - 1]?.cumulative < 0
                    ? "bg-green-50 font-semibold"
                    : ""
                }`}
              >
                <td className="px-4 py-2">{data.year}</td>
                <td className="px-4 py-2 text-right">
                  {formatValue(data.production)}
                </td>
                <td className="px-4 py-2 text-right">{data.pricePerKwh}</td>
                <td className="px-4 py-2 text-right">
                  {formatValue(data.yearlySavings)}
                </td>
                <td className="px-4 py-2 text-right">
                  {data.replacementCost > 0 ? (
                    <span className="text-orange-600 font-semibold">
                      {formatValue(data.replacementCost)}
                    </span>
                  ) : (
                    "0"
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatValue(data.totalSaved)}
                </td>
                <td
                  className={`px-4 py-2 text-right font-semibold ${
                    data.cumulative >= 0 ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {formatValue(data.cumulative)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
