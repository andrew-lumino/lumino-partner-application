import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomMessageSection {
  id: string
  type: "header" | "paragraph"
  content: string
}

interface CustomMessageData {
  sections: CustomMessageSection[]
}

export const renderWelcomeStep = (customMessage?: CustomMessageData) => {
  // If custom message is provided, render it instead of default
  if (customMessage && customMessage.sections && customMessage.sections.length > 0) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mb-4">
            <img
              src="/images/design-mode/Brandmark%20Lumino%20Black%404x%281%29(1).png"
              alt="LUMINO"
              className="h-12 mx-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              4201 Main St Suite 201, Houston, TX 77002 | 1-866-488-4168 | support@golumino.com | www.golumino.com
            </p>
          </div>
        </CardHeader>
        <CardContent className="prose custom-prose max-w-none dark:prose-invert space-y-6">
          {customMessage.sections.map((section) => (
            <div key={section.id}>
              {section.type === "header" ? (
                <h1 className="text-3xl font-bold text-gray-800 text-center">{section.content}</h1>
              ) : (
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{section.content}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Default welcome message
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mb-4">
          <img
            src="/images/design-mode/Brandmark%20Lumino%20Black%404x%281%29(1).png"
            alt="LUMINO"
            className="h-12 mx-auto mb-2"
          />
          <p className="text-sm text-muted-foreground">
            4201 Main St Suite 201, Houston, TX 77002 | 1-866-488-4168 | support@golumino.com | www.golumino.com
          </p>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-800">Welcome to Lumino - Payments with Purpose</CardTitle>
      </CardHeader>
      <CardContent className="prose custom-prose max-w-none dark:prose-invert space-y-8">
        <p className="lead">Dear Partners,</p>
        <p>
          Thank you for choosing to partner with Lumino. Our founding team was forged in the Gamified Fullstack Fintech
          community, and we built every feature around a simple conviction: where Consumers Win, Businesses Win,
          Partners Win. Creating a backbone of what we call true Conscious commerce.
        </p>
        <p>
          We are building a future-ready payments platform that turns every transaction into profit and lasting customer
          loyalty. While we have exciting and lucrative roll-outs on the horizon to bring unparalleled harmony to the
          merchant experience, we also maintain a dedicated product team focused on tools that make your work with
          Lumino more fulfilling and empowering.
        </p>
        <h4 className="font-bold text-xl mt-6 mb-3">What Sets Lumino Apart and What's Coming Soon!</h4>
        <ul className="list-disc ml-6">
          <li>
            <strong>Next-generation dual-pricing gateway</strong> – Our cloud-native stack delivers scalable, PCI-secure
            payments
          </li>
          <li>
            <strong>Omni-gateway freedom</strong> – Say "yes" more often with seamless gateway toggling
          </li>
          <li>
            <strong>Built-in rewards engine</strong> – Convert zero-fee savings into customer loyalty or charitable
            giving
          </li>
          <li>
            <strong>Partner-first economics</strong> – Transparent residuals, bonuses, and lifetime account ownership
          </li>
          <li>
            <strong>AI-driven automation</strong> – Faster merchant onboarding and streamlined back office operations
          </li>
          <li>
            <strong>Coming Soon</strong> – BNPL, ACH invoicing, POS, embedded finance and more!
          </li>
        </ul>
        <h4 className="font-bold text-xl mt-6 mb-3">A Brand You Can Stand Behind</h4>
        <p>
          Our core values—Clarity, Progress, Resonance, Community, and Sovereignty through Service—guide every product
          decision. Each feature is engineered to elevate the businesses and communities we serve.
        </p>
        <h4 className="font-bold text-xl mt-6 mb-3">Your Benefits at a Glance</h4>
        <table className="w-full overflow-x-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program Perk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                How It Works
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Your Advantage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4">Turn-key training</td>
              <td className="px-6 py-4">Live webinars & on-demand modules</td>
              <td className="px-6 py-4">Hit quota in your first 30 days</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Partner desk</td>
              <td className="px-6 py-4">Same-day pricing approvals and support</td>
              <td className="px-6 py-4">Less time in queues</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Marketing toolkit</td>
              <td className="px-6 py-4">Co-branded decks, social templates, video campaign</td>
              <td className="px-6 py-4">Get inbound leads easily</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Residual transparency</td>
              <td className="px-6 py-4">Volume, fees saved, and rewards dashboard</td>
              <td className="px-6 py-4">Track merchant health + income</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Future-proof roadmap</td>
              <td className="px-6 py-4">BNPL, ACH, POS, embedded finance</td>
              <td className="px-6 py-4">Retain clients long-term</td>
            </tr>
          </tbody>
        </table>
        <h4 className="font-bold text-xl mt-6 mb-3">The Lumino Compensation Plan</h4>
        <p>
          Generous, ethical, and transparent. Lumino shares revenue to reward success and build lasting partnerships.
        </p>
        <h5 className="font-bold text-lg mt-4 mb-2">Profit-Sharing Overview</h5>
        <ul className="list-disc ml-6">
          <li>
            <strong>Residual revenue sharing</strong> – from Lumino's net revenue, paid monthly
          </li>
          <li>
            <strong>Team Overrides</strong> – 10% overrides from direct recruits
          </li>
          <li>
            <strong>Affiliate Bonus</strong> – 1x monthly residual (up to $500)
          </li>
        </ul>
        <h4 className="font-bold text-xl mt-6 mb-3">Getting Started Is Easy</h4>
        <ol className="list-decimal ml-6">
          <li>Sign the agreement (via Box Sign)</li>
          <li>Schedule your orientation call</li>
          <li>Access the Partner Portal</li>
          <li>Onboard your first merchant</li>
        </ol>
        <div className="pt-8">
          <h2 className="text-2xl font-bold mt-8 mb-4">A Personal Invitation</h2>
          <p>
            We built Lumino to be more than another processor; it is a platform where{" "}
            <strong>commerce and contribution move in harmony</strong>. If that mission resonates with you, we would be
            honored to welcome you into our growing constellation of <strong>Light-driven partners</strong>. Let's
            illuminate a fairer, more profitable path together.
          </p>
          <p>
            Please reach out with any questions or to schedule a deeper demo. We look forward to celebrating your first
            funded account soon. You can always get priority support by picking up the phone and dialing{" "}
            <strong>1-866-488-4168</strong>, by shooting a note to{" "}
            <a href="mailto:support@golumino.com" className="text-blue-600 underline">
              support@golumino.com
            </a>
            , and very soon... It's the best portal the industry offers.
          </p>
        </div>
        <div className="text-right">
          <p>With gratitude and anticipation,</p>
          <div>
            <strong>Zachry Godfrey, CEO</strong>
          </div>
          <div>
            <strong>Giorgio Riccio, COO</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
