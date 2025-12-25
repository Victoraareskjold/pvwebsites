export default function HowDoesItWork() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <img src="/estimate/checked.png" className="h-6 w-6" />
        <p className="font-light">Du har nå mottat ditt estimat.</p>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-6 w-6" />
        <p className="font-light">Befaring gjennomføres ved behov.</p>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-6 w-6" />
        <p className="font-light">
          Vi sender ferdigstilt tilbud til vurdering.
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <img src="/estimate/unchecked.png" className="h-6 w-6" />
        <p className="font-light">Montering til et tidspunkt som passer deg.</p>
      </div>
    </div>
  );
}
