import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";

const CEPolicies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-eyebrow text-primary mb-3">Continuing Education</p>
          <h1 className="text-hero text-foreground mb-4">
            CE Provider Information
          </h1>
          <p className="text-body-lg text-muted-foreground mb-12">
            Policies and disclosures for CE programs sponsored by Mindful CECs.
          </p>

          <div className="prose-section space-y-10">
            {/* Provider Approvals */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Provider Approvals</h2>
              <p className="text-body text-muted-foreground leading-relaxed mb-4">
                Continuing Education is sponsored by Mindful CECs. CE credit/contact hours are available for psychologists, MFTs, LCSWs, LPCCs, LEPs, nurses, chiropractors, and may be applicable for other licenses.
              </p>

              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">American Psychological Association (APA)</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-2">
                Mindful CECs is approved by the American Psychological Association to sponsor continuing education for psychologists. Mindful CECs maintains responsibility for this program and its content.
              </p>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-4">
                APA-approved CE is widely accepted for LMFT, LCSW, LPCC, LEP, and equivalent license renewals across most U.S. states. Participants should verify acceptance with their state licensing board, as acceptance policies vary.
              </p>

              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">California Board of Registered Nursing</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-4">
                Mindful CECs is a provider approved by the CA BRN (BRN Provider CEP17985) for licensed nurses in California.
              </p>

              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">California Board of Chiropractic Examiners</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-4">
                Code of Regulations 361(h)(2) provides that general continuing education requirements may be met by taking continuing education courses by any California Healing Arts Board-approved provider, including those approved by the BRN.
              </p>

              <p className="text-body-sm text-muted-foreground leading-relaxed p-4 rounded-lg bg-accent/50 border border-border">
                For those licensed by or associated with a board not listed above, please contact your licensing board directly to verify if CE credit from the above-approved sponsors is accepted. Mindful CECs does not confirm the applicability of credit for those licensed by boards other than those listed above.
              </p>
            </section>

            {/* Attendance */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Attendance Requirements</h2>
              <p className="text-body text-muted-foreground leading-relaxed mb-3">
                Self-paced programs require the completion of a comprehension assessment. To be eligible for Certificates of Attendance, participants are required to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-body text-muted-foreground mb-3">
                <li>Review the program in full.</li>
                <li>Complete the assessment with 75% accuracy. Participants are permitted to retake the test if 75% accuracy is not achieved.</li>
              </ul>
              <p className="text-body text-muted-foreground leading-relaxed">
                Certificates of Completion will be immediately available to those who complete the attendance requirements.
              </p>
            </section>

            {/* Cancellation */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Cancellation &amp; Refund Policy</h2>
              <p className="text-body text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">Participant cancellations:</strong> Participants may request a refund within 30 days of enrollment, subject to the program's Terms of Purchase.
              </p>
              <p className="text-body text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Organization cancellations:</strong> Mindfulness Exercises rarely cancels a program, but in the unlikely event that we do, all registered participants will be notified by phone and email, and the cancellation notice will be posted on our website. A full refund will be issued within 7–10 business days.
              </p>
            </section>

            {/* Grievance */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Grievance Policy</h2>
              <p className="text-body text-muted-foreground leading-relaxed mb-3">
                If a grievance arises pertaining to continuing education programs, teachers, or processes, the complainant should write to{" "}
                <a href="mailto:info@mindfulcecs.com" className="text-primary underline underline-offset-4 hover:text-foreground transition-colors">
                  info@mindfulcecs.com
                </a>{" "}
                within 30 days of the grievance, so that the nature of the concern may be promptly addressed.
              </p>
              <p className="text-body text-muted-foreground leading-relaxed mb-3">
                Mindful CECs is fully committed to conducting all activities in strict conformance with the American Psychological Association's Ethical Principles of Psychologists. Mindful CECs will comply with all legal and ethical responsibilities to be non-discriminatory in promotional activities, program content, and the treatment of program participants.
              </p>
              <p className="text-body text-muted-foreground leading-relaxed mb-3">
                The monitoring and assessment of compliance with these standards will be the responsibility of the CE Program Director in consultation with the members of the curriculum review/planning committee and the Racial Equity/DEIA Chair.
              </p>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                For more information regarding Grievance Policies for Mindful CECs, and contact information to file a grievance, please visit{" "}
                <a href="https://mindfulcecs.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-foreground transition-colors">
                  mindfulcecs.com
                </a>.
              </p>
            </section>

            {/* Conflict of Interest */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Potential Conflict of Interest</h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                These instructors may have authored publications, books, and courses relevant to the subjects covered in this course. The instructors may reference these materials during the course, and could receive financial compensation if they are purchased.
              </p>
            </section>

            {/* Commercial Support */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Commercial Support</h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                This program received no commercial support.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CEPolicies;
