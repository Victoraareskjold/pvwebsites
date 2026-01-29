import { EstimateInfoComponent } from "../EstimateInfoComponent";

export default function YourSolarFacility2({ estimateData, finished }) {
  const panelItem = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "solcellepanel",
  );

  // 2. Hent ut produktnavnet (f.eks. "Trina Vertex TSM- 445W")
  const panelProduct = panelItem?.product || "";

  const batteryItem = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "batteri",
  );

  const batteryProduct = batteryItem?.product || "";

  // 3. Regex for å finne Watt (leter etter tallet før 'W')
  const match = panelProduct.match(/(\d+)\s*W/i);
  const watt = match ? Number(match[1]) : 0;

  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter",
  );

  const mounting = estimateData?.price_data?.mounting?.[0];

  return (
    <div className="flex flex-row h-fit gap- px-4 items-center">
      <div className="w-full mt-2">
        <EstimateInfoComponent
          text={"Installert effekt."}
          number={`${(estimateData?.kwp || (estimateData?.total_panels * watt) / 1000).toFixed(1)} kWp`}
          image={"/estimate/info1.png"}
          finished={finished}
          type="INSTALLERT EFFEKT (KWP)"
          attachmentUrl={estimateData?.simulation_pdf}
        />
        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`${panelProduct} panel`}
          number={`${estimateData?.total_panels} stk -`}
          image={"/estimate/info2.png"}
          finished={finished}
          type="SOLCELLEPANEL"
          attachmentUrl={panelItem?.attachmentUrl}
        />
        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`- ${inverter?.product || "" + " inverter"} `}
          number={`${inverter?.quantity || 0} stk`}
          image={"/estimate/info3.png"}
          finished={finished}
          type="INVERTER"
          attachmentUrl={inverter?.attachmentUrl}
        />

        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`- ${
            estimateData?.price_data?.mounting[0]?.product ?? "Ingen valgt"
          } feste`}
          number={`${estimateData?.price_data?.mounting[0]?.quantity ?? 0} stk`}
          image={"/estimate/info4.png"}
          finished={finished}
          type="FESTESYSTEM"
          attachmentUrl={mounting?.attachmentUrl}
        />

        {batteryProduct && (
          <>
            <div className="w-full h-2 bg-green-300 rounded-full my-6" />
            <EstimateInfoComponent
              text={`${batteryProduct} batteri`}
              number={`${batteryItem?.quantity} stk -`}
              image={"/estimate/info2.png"}
              finished={finished}
              type="BATTERI"
              attachmentUrl={batteryItem?.attachmentUrl}
            />
          </>
        )}
      </div>
    </div>
  );
}
