import { EstimateInfoComponent } from "../EstimateInfoComponent";

export default function YourSolarFacility({ estimateData }) {
  const panelItem = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "solcellepanel",
  );

  // 2. Hent ut produktnavnet (f.eks. "Trina Vertex TSM- 445W")
  const panelProduct = panelItem?.product || "";

  // 3. Regex for å finne Watt (leter etter tallet før 'W')
  const match = panelProduct.match(/(\d+)\s*W/i);
  const watt = match ? Number(match[1]) : 0;

  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter",
  );

  return (
    <div className="flex flex-row h-fit gap- px-4 items-center">
      <div className="w-full mt-2">
        <EstimateInfoComponent
          text={"Installert effekt."}
          number={`${(estimateData?.kwp || (estimateData?.total_panels * watt) / 1000).toFixed(1)} kWp`}
          image={"/estimate/info1.png"}
        />
        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`${panelProduct} panel.`}
          number={`${estimateData?.total_panels} stk -`}
          image={"/estimate/info2.png"}
        />
        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`- ${inverter?.product + " inverter" || "Inverter"} `}
          number={`${inverter?.quantity || 0} stk`}
          image={"/estimate/info3.png"}
        />

        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`- ${
            estimateData?.price_data?.mounting[0]?.product ?? "Ingen valgt"
          } feste`}
          number={`${estimateData?.price_data?.mounting[0]?.quantity ?? 0} stk`}
          image={"/estimate/info4.png"}
        />
      </div>
      <div className="md:block">
        <img
          src="/estimate/bigIllustration.png"
          className="h-full max-h-[450px] object-contain"
        />
      </div>{" "}
    </div>
  );
}
