export default function HowWillItLook({ estimateData }) {
  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  return (
    <section className="w-full">
      <h5 className="">
        <strong>Hvordan vil dette se ut?</strong>
      </h5>
      <h2>
        Basert på vår evaluering har vi plassert{" "}
        <strong>{estimateData?.total_panels}</strong> solcellepaneler hos dere
        som vil produsere rundt{" "}
        {formatValue(Number(estimateData?.yearly_prod?.toFixed(0)))} kWh per år.
      </h2>
      {estimateData.image_url ? (
        <div className="h-full">
          <img
            src={estimateData?.image_url}
            alt="Bilde"
            className="object-cover w-full h-full lg:max-h-96 rounded-2xl overflow-hidden mt-4"
          />

          <p className="italic">
            Dette oppsettet er fleksibelt - vi tilpasser det etter dine ønsker.
          </p>
        </div>
      ) : null}
      <h2 className="italic">
        Dette oppsettet er fleksibelt – vi tilpasser det etter dine ønsker.
      </h2>
    </section>
  );
}
