export default function HowDoesItWork() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <img src="/estimate/checked.png" className="h-8 w-8" />
        <p className="font-light !text-md">Du har nå mottat ditt estimat.</p>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-8 w-8" />
        <p className="font-light !text-md">Befaring gjennomføres ved behov.</p>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-8 w-8" />
        <p className="font-light !text-md">
          Vi sender ferdigstilt tilbud til vurdering.
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-8 w-8" />
        <p className="font-light !text-md">
          Montering til et tidspunkt som passer deg.
        </p>
      </div>
    </div>
  );
}
