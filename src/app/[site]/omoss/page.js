"use client";

import { AboutSection, ContactSection, ProcessSection } from "../../../components/design/Sections";

export default function About() {
  return (
    <main id="main" className="ds">
      <AboutSection full />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
