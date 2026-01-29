export default function Takk() {
  const steps = [
    {
      title: "DU HAR SIGNERT AVTALEN",
      description:
        "Avtalen er nå signert, og vi tar deg videre gjennom neste steg i prosessen.",
      status: "completed",
    },
    {
      title: "DU FÅR EN INSTALLASJONSDATO",
      description:
        "Vi gjør nå nødvendige forberedelser og starter planleggingen av installasjonen. Vanligvis gjennomføres installasjon 1–2 måneder etter bestilling, med mindre annet er avtalt.",
      status: "pending",
    },
    {
      title: "INSTALLASJON",
      description:
        "Montering av solcellepaneler tar normalt 4–5 dager, avhengig av anleggets størrelse og forhold på taket.",
      status: "pending",
    },
    {
      title: "30 ÅRS PRODUKSJON AV EGEN REN ENERGI",
      description:
        "Når anlegget er i drift, starter produksjonen av egen fornybar energi. Solcelleanlegget er dimensjonert for lang levetid, og vil gi deg strømproduksjon og besparelser i flere tiår fremover.",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-[90vh] bg-gray-50 p-8 md:p-16 flex items-center justify-center">
      <div className="max-w-2xl w-full h-fit">
        <div className="relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Vertical Line Connector */}
              {index !== steps.length - 1 && (
                <div
                  className="absolute left-[19px] top-10 w-[2px] h-full bg-[#60FF80]"
                  aria-hidden="true"
                />
              )}

              {/* Status Icon/Circle */}
              <div className="relative z-10 flex-shrink-0">
                {step.status === "completed" ? (
                  <div className="w-10 h-10 rounded-full border-2 border-[#60FF80] flex items-center justify-center bg-white">
                    <svg
                      className="w-6 h-6 text-[#60FF80]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-[#60FF80] bg-white" />
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col pt-1">
                <h3 className="text-xl font-medium text-gray-900 tracking-tight mb-2 uppercase">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
