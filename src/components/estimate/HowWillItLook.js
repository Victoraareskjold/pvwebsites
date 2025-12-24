export default function HowWillItLook({ estimateData }) {
  const formatValue = (number) => number.toLocaleString().split(",").join(" ");

  return (
    <section className="w-full">
      <h5 className="">
        <strong>Hvordan vil dette se ut?</strong>
      </h5>
      <h2>
        Basert på vår evaluering har vi plassert{" "}
        <strong className="font-semibold">{estimateData?.total_panels}</strong>{" "}
        solcellepaneler hos dere som vil produsere rundt{" "}
        <strong className="font-semibold">
          {formatValue(Number(estimateData?.yearly_prod?.toFixed(0)))}
        </strong>{" "}
        kWh per år.
      </h2>
      {estimateData.image_url ? (
        <div className="w-full">
          <img
            src={estimateData?.image_url}
            alt="Bilde"
            className="object-contain w-full h-auto rounded-xl overflow-hidden mt-4"
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
