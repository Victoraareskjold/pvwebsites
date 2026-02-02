import { EstimateInfoComponent } from "../EstimateInfoComponent";

export default function YourSolarFacility2({ estimateData, finished }) {
  const panelItems = estimateData?.price_data?.suppliers?.filter(
    (item) => item.category === "solcellepanel",
  );

  const batteryItems = estimateData?.price_data?.suppliers?.filter(
    (item) => item.category === "batteri",
  );

  const mountingItems = estimateData?.price_data?.mounting;

  const inverterItems = estimateData?.price_data?.suppliers?.filter(
    (item) => item.category === "inverter",
  );

  const panelProduct = panelItems?.[0]?.product || "";

  // 3. Regex for å finne Watt (leter etter tallet før 'W')
  const match = panelProduct.match(/(\d+)\s*W/i);
  const watt = match ? Number(match[1]) : 0;

  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

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
        {panelItems.map((item, index) => (
          <div key={item.id}>
            <EstimateInfoComponent
              text={`${item.product} panel`}
              number={`${item.quantity} stk -`}
              image={"/estimate/info2.png"}
              finished={finished}
              type={index === 0 ? "SOLCELLEPANEL" : ""}
              attachmentUrl={item.attachmentUrl}
            />
          </div>
        ))}

        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        {inverterItems.map((item, index) => (
          <div key={item.id}>
            <EstimateInfoComponent
              text={`${item.product} inverter`}
              number={`${item.quantity} stk`}
              image={"/estimate/info3.png"}
              finished={finished}
              type={index === 0 ? "INVERTER" : ""}
              attachmentUrl={item.attachmentUrl}
            />
          </div>
        ))}

        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        {mountingItems.map((item, index) => (
          <div key={item.id}>
            <EstimateInfoComponent
              text={`${item.product ?? "Ingen valgt"} feste`}
              number={`${item.quantity ?? 0} stk`}
              image={"/estimate/info4.png"}
              finished={finished}
              type={index === 0 ? "FESTESYSTEM" : ""}
              attachmentUrl={item.attachmentUrl}
            />
          </div>
        ))}

        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        {batteryItems.map((item, index) => (
          <div key={item.id}>
            <EstimateInfoComponent
              text={`${item.product} batteri`}
              number={`${item.quantity} stk -`}
              image={"/estimate/info2.png"}
              finished={finished}
              type={index === 0 ? "BATTERI" : ""}
              attachmentUrl={item.attachmentUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
