import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: `Terms of Use | ${LEGAL.siteName}`,
  description: `Terms and conditions for using the ${LEGAL.siteName} property platform.`,
}

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Use">
      <p>
        These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Homescout
        website and related services operated by {LEGAL.operatorName} in {LEGAL.country}. By using
        Homescout, you agree to these Terms. If you do not agree, please do not use the site.
      </p>

      <section>
        <h2 className="text-lg font-bold text-stone-900">1. About Homescout</h2>
        <p className="mt-2">
          Homescout is an online property marketplace that connects buyers and renters with
          sellers and landlords. We provide listing tools, search, and messaging features. We are
          not an estate agency, conveyancer, or financial adviser unless explicitly stated
          otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">2. Eligibility and accounts</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>You must be at least 18 years old to create an account.</li>
          <li>You must provide accurate registration information and keep it up to date.</li>
          <li>You are responsible for activity under your account and for keeping your password secure.</li>
          <li>
            We may suspend or terminate accounts that violate these Terms or applicable law,
            including fraudulent or misleading listings.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">3. Listings and seller responsibilities</h2>
        <p className="mt-2">If you list a property, you agree that:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>You have the right to advertise the property (as owner or authorised agent).</li>
          <li>Listing details, prices, and photos are accurate and not misleading.</li>
          <li>You will respond to enquiries in a reasonable manner.</li>
          <li>You comply with applicable property, consumer, and advertising laws in South Africa.</li>
        </ul>
        <p className="mt-2">
          Homescout may remove or refuse listings that appear unlawful, misleading, or harmful to
          users.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">4. Buyers and enquiries</h2>
        <p className="mt-2">
          Enquiries you send through Homescout are passed to the relevant seller. Homescout does
          not guarantee availability, condition, or legal title of any property. You should conduct
          your own due diligence, inspections, and professional advice before any transaction.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">5. Promoted listings and payments</h2>
        <p className="mt-2">
          Optional promotion features may be offered for a fee. Where payment processing is
          enabled, additional payment terms will apply at checkout. Fees are non-refundable except
          where required by law or expressly stated.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">6. Acceptable use</h2>
        <p className="mt-2">You must not:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use the site for unlawful, harassing, or discriminatory purposes.</li>
          <li>Scrape, reverse engineer, or overload our systems without permission.</li>
          <li>Upload malware, spam, or content that infringes others&apos; rights.</li>
          <li>Impersonate another person or misrepresent your affiliation.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">7. Intellectual property</h2>
        <p className="mt-2">
          Homescout branding, software, and site content are owned by us or our licensors. You
          retain ownership of content you upload but grant us a licence to display and operate it on
          the platform.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">8. Privacy</h2>
        <p className="mt-2">
          Our{' '}
          <Link href="/privacy" className="text-amber-700 font-semibold hover:underline">
            Privacy Policy
          </Link>{' '}
          explains how we handle personal information under POPIA. It forms part of these Terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">9. Disclaimers</h2>
        <p className="mt-2">
          The site and listings are provided &quot;as is&quot; and &quot;as available&quot;. To the
          fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant uninterrupted or error-free
          service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">10. Limitation of liability</h2>
        <p className="mt-2">
          To the extent permitted by South African law, Homescout and its directors, employees, and
          partners are not liable for indirect, incidental, or consequential damages arising from
          your use of the site or any transaction between users. Our total liability for direct
          damages is limited to the greater of amounts you paid us in the twelve months before the
          claim or R1,000, except where liability cannot be limited by law.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">11. Governing law</h2>
        <p className="mt-2">
          These Terms are governed by the laws of the Republic of South Africa. Disputes are subject
          to the exclusive jurisdiction of South African courts, unless mandatory consumer protection
          rules provide otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-stone-900">12. Contact</h2>
        <p className="mt-2">
          Questions about these Terms:{' '}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-amber-700 font-semibold hover:underline">
            {LEGAL.contactEmail}
          </a>
        </p>
      </section>

      <p className="text-xs text-stone-500 border-t border-stone-200 pt-4">
        These Terms are a general template for platform use and do not replace professional legal
        advice tailored to your business.
      </p>
    </LegalPageLayout>
  )
}
