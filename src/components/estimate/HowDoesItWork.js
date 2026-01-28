export default function HowDoesItWork({ finished }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <img src="/estimate/checked.png" className="h-8 w-8" />
        <h1 className="font-light !text-md">Du har nå mottat ditt estimat.</h1>
      </div>
      <div className="flex flex-row gap-4">
        <img
          src={`${finished ? "/estimate/checked.png" : "/estimate/unchecked.png"}`}
          className="h-8 w-8"
        />
        <h1 className="font-light !text-md">
          Befaring gjennomføres ved behov.
        </h1>
      </div>
      <div className="flex flex-row gap-4">
        <img
          src={`${finished ? "/estimate/checked.png" : "/estimate/unchecked.png"}`}
          className="h-8 w-8"
        />
        <h1 className="font-light !text-md">
          Vi sender ferdigstilt tilbud til vurdering.
        </h1>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-8 w-8" />
        <h1 className="font-light !text-md">
          Montering til et tidspunkt som passer deg.
        </h1>
      </div>
    </div>
  );
}
