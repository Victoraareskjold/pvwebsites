import { EstimateInfoComponent } from "../EstimateInfoComponent";

export default function YourSolarFacility({ estimateData }) {
  const panelType = estimateData?.selected_panel_type;
  const match = panelType?.match(/\d+/);
  const watt = match ? Number(match[0]) : 0;

  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  const inverter = estimateData?.price_data?.suppliers?.find(
    (item) => item.category === "inverter"
  );

  return (
    <div className="flex flex-row gap-4">
      <div className="w-full mt-2">
        <EstimateInfoComponent
          text={"Installert effekt."}
          number={`${(estimateData?.total_panels * watt) / 1000} kWp`}
          image={"/estimate/info1.png"}
        />
        <div className="w-full h-2 bg-green-300 rounded-full my-6" />
        <EstimateInfoComponent
          text={`${estimateData?.selected_panel_type} panel.`}
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
          text={`- ${estimateData?.price_data?.mounting[0].product} feste`}
          number={`${estimateData?.price_data?.mounting[0].quantity} stk`}
          image={"/estimate/info4.png"}
        />
      </div>
      <img src="/estimate/bigIllustration.png" />
    </div>
  );
}
