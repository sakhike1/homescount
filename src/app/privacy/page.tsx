import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: `Privacy Policy | ${LEGAL.siteName}`,
  description: `How ${LEGAL.siteName} collects, uses, and protects your personal information in line with POPIA.`,
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        This Privacy Policy explains how {LEGAL.operatorName} (&quot;Homescout&quot;, &quot;we&quot;,
        &quot;us&quot;) processes personal information when you use our website and services in{' '}
        {LEGAL.country}. We aim to comply with the Protection of Personal Information Act 4 of 2013
        (POPIA) and the Promotion of Access to Information Act 2 of 2000 (PAIA) where applicable.
      </p>

      <section>
        <h2 className="text-lg font-bold text-stone-900">1. Responsible party</h2>
        <p className="mt-2">
          The responsible party for your personal information is {LEGAL.operatorName}. For privacy
          requests or questions, contact{' '}
          <a href={`mailto:${LEGAL.privacyEmail}`} className="text-amber-700 font-semibold hover:underline">
            {LEGAL.privacyEmail}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">2. Information we collect</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            <strong>Account data:</strong> name, email, password (stored hashed), role (buyer or
            seller), and optional phone number.
          </li>
          <li>
            <strong>Listing data:</strong> property details, descriptions, prices, locations, and
            photos you upload as a seller.
          </li>
          <li>
            <strong>Enquiry data:</strong> name, email, optional phone, and message when you contact
            a seller about a listing.
          </li>
          <li>
            <strong>Newsletter:</strong> email address if you subscribe to property news.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, device information, and
            cookies (see our{' '}
            <Link href="/cookies" className="text-amber-700 font-semibold hover:underline">
              Cookie Policy
            </Link>
            ).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">3. Why we process your information</h2>
        <p className="mt-2">We process personal information to:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Provide the platform (browse listings, create accounts, publish properties).</li>
          <li>Pass buyer enquiries to the relevant seller and notify sellers (including SMS where enabled).</li>
          <li>Send newsletters and marketing only where you have given consent.</li>
          <li>Secure the service, prevent abuse, and comply with law.</li>
          <li>Improve the website (analytics only if you accept optional cookies).</li>
        </ul>
        <p className="mt-2">
          Our lawful bases under POPIA include consent, contractual necessity, and legitimate
          interests (for example, fraud prevention and service security), balanced against your
          rights.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">4. Sharing your information</h2>
        <p className="mt-2">We may share personal information with:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            <strong>Sellers:</strong> when you submit an enquiry on their listing (your contact
            details and message).
          </li>
          <li>
            <strong>Service providers:</strong> hosting, database, email/SMS providers, and payment
            processors (when payments are enabled), under appropriate agreements.
          </li>
          <li>
            <strong>Authorities:</strong> when required by law or to protect rights and safety.
          </li>
        </ul>
        <p className="mt-2">We do not sell your personal information.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">5. Cross-border transfers</h2>
        <p className="mt-2">
          Some service providers may process data outside South Africa. Where this occurs, we take
          reasonable steps to ensure appropriate safeguards in line with POPIA.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">6. Retention</h2>
        <p className="mt-2">
          We keep personal information only as long as needed for the purposes above, including
          legal, tax, and dispute resolution requirements. Enquiry records are retained while the
          listing and seller account remain active and for a reasonable period thereafter. You may
          request deletion subject to our legal obligations.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">7. Your rights (POPIA)</h2>
        <p className="mt-2">You may have the right to:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Access personal information we hold about you.</li>
          <li>Request correction or deletion where applicable.</li>
          <li>Object to processing based on legitimate interests.</li>
          <li>Withdraw consent for marketing or optional processing.</li>
          <li>Lodge a complaint with the Information Regulator (South Africa).</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, email{' '}
          <a href={`mailto:${LEGAL.privacyEmail}`} className="text-amber-700 font-semibold hover:underline">
            {LEGAL.privacyEmail}
          </a>
          . We may need to verify your identity before responding.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">8. Security</h2>
        <p className="mt-2">
          We use technical and organisational measures such as encrypted connections (HTTPS),
          hashed passwords, and access controls. No system is completely secure; please use a
          strong password and protect your account credentials.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">9. Children</h2>
        <p className="mt-2">
          Homescout is not directed at children under 18. We do not knowingly collect personal
          information from children without appropriate consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">10. Changes</h2>
        <p className="mt-2">
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top
          will change when we do. Continued use of the site after changes constitutes notice of the
          updated policy where permitted by law.
        </p>
      </section>

      <p className="text-xs text-stone-500 border-t border-stone-200 pt-4">
        This policy is provided for general information and does not constitute legal advice.
        Consider independent legal advice for your specific situation.
      </p>
    </LegalPageLayout>
  )
}
