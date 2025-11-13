import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const renderScheduleAStep = (customScheduleA?: any, customTerms?: any) => {
  // Helper function to get value from custom data or use default
  const getValue = (key: string, option: string, defaultValue: string) => {
    if (customScheduleA && customScheduleA[key] && customScheduleA[key][option]) {
      return customScheduleA[key][option]
    }
    return defaultValue
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Schedule A – Program Options & Fees</CardTitle>
        <CardDescription>
          {customScheduleA
            ? "Review your custom Lumino Program Options and Fee Structure as outlined in your personalized Partner Agreement."
            : "Review the Lumino Program Options and Fee Structure as outlined in the official Partner Agreement."}
        </CardDescription>
        {customScheduleA && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-sm text-blue-800 font-medium">
              ⭐ This application includes custom Schedule A terms specifically configured for you.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="prose custom-prose max-w-none dark:prose-invert space-y-8">
        <h4 className="font-bold text-xl mt-6 mb-3">Fee Structure Comparison</h4>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border">
            <thead className={`text-xs uppercase text-gray-600 ${customScheduleA ? "bg-blue-50" : "bg-gray-100"}`}>
              <tr>
                <th className="px-4 py-2 border align-top">Fee Category</th>
                <th className="px-4 py-2 border align-top">
                  Option 1<br />
                  (Integrated)
                </th>
                <th className="px-4 py-2 border align-top">
                  Option 2<br />
                  (Low-Mid Risk)
                </th>
                <th className="px-4 py-2 border align-top">
                  Option 3<br />
                  (High Risk)
                </th>
                <th className="px-4 py-2 border align-top">Option 4</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="border px-4 py-2">Equipment & Software</td>
                <td className="border px-4 py-2">{getValue("equipment", "option1", "SkyTab, SumUp, Clover POS")}</td>
                <td className="border px-4 py-2">
                  {getValue("equipment", "option2", "Lumino Terminals, Pax, Dejavoo, Verifone")}
                </td>
                <td className="border px-4 py-2">
                  {getValue("equipment", "option3", "Lumino Invoicing, E-Commerce Integrations")}
                </td>
                <td className="border px-4 py-2">{getValue("equipment", "option4", "Financial Services")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  <strong>Association Fees</strong>
                  <br />
                  (Interchange, dues, assessments from Card Associations)
                </td>
                <td className="border px-4 py-2">{getValue("associationFees", "option1", "Pass-through 60%")}</td>
                <td className="border px-4 py-2">{getValue("associationFees", "option2", "Pass-through 75%")}</td>
                <td className="border px-4 py-2">{getValue("associationFees", "option3", "Pass-through 50%")}</td>
                <td className="border px-4 py-2">{getValue("associationFees", "option4", "Pass-through 60%")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Visa/MC Transaction Fee</td>
                <td className="border px-4 py-2">{getValue("visaMcFee", "option1", "$0.05")}</td>
                <td className="border px-4 py-2">{getValue("visaMcFee", "option2", "$0.03")}</td>
                <td className="border px-4 py-2">{getValue("visaMcFee", "option3", "$0.05")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  Other Transaction Fee
                  <br />
                  <span className="text-xs">(AMEX, Discover, EBT, etc.)</span>
                </td>
                <td className="border px-4 py-2">{getValue("otherTransactionFee", "option1", "$0.05")}</td>
                <td className="border px-4 py-2">{getValue("otherTransactionFee", "option2", "$0.03")}</td>
                <td className="border px-4 py-2">{getValue("otherTransactionFee", "option3", "$0.05")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">BIN Sponsorship</td>
                <td className="border px-4 py-2">{getValue("binSponsorship", "option1", "5 bps")}</td>
                <td className="border px-4 py-2">{getValue("binSponsorship", "option2", "3 bps")}</td>
                <td className="border px-4 py-2">{getValue("binSponsorship", "option3", "15 bps")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">AMEX OptBlue / Processor Access</td>
                <td className="border px-4 py-2">{getValue("amexOptBlue", "option1", "25 bps")}</td>
                <td className="border px-4 py-2">{getValue("amexOptBlue", "option2", "25 bps")}</td>
                <td className="border px-4 py-2">{getValue("amexOptBlue", "option3", "25 bps")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Monthly Program Support Fee</td>
                <td className="border px-4 py-2">{getValue("monthlySupportFee", "option1", "$4.75")}</td>
                <td className="border px-4 py-2">{getValue("monthlySupportFee", "option2", "$4.75")}</td>
                <td className="border px-4 py-2">{getValue("monthlySupportFee", "option3", "$4.75")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Monthly Minimum</td>
                <td className="border px-4 py-2">{getValue("monthlyMinimum", "option1", "$0.00")}</td>
                <td className="border px-4 py-2">{getValue("monthlyMinimum", "option2", "$0.00")}</td>
                <td className="border px-4 py-2">{getValue("monthlyMinimum", "option3", "$0.00")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Chargeback Fee</td>
                <td className="border px-4 py-2">{getValue("chargebackFee", "option1", "$15.00")}</td>
                <td className="border px-4 py-2">{getValue("chargebackFee", "option2", "$15.00")}</td>
                <td className="border px-4 py-2">{getValue("chargebackFee", "option3", "$15.00")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Retrieval Request</td>
                <td className="border px-4 py-2">{getValue("retrievalRequest", "option1", "$5.00")}</td>
                <td className="border px-4 py-2">{getValue("retrievalRequest", "option2", "$5.00")}</td>
                <td className="border px-4 py-2">{getValue("retrievalRequest", "option3", "$5.00")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Bonus Program Upfront</td>
                <td className="border px-4 py-2">{getValue("bonusProgram", "option1", "18x Monthly Residual")}</td>
                <td className="border px-4 py-2">{getValue("bonusProgram", "option2", "1x Monthly Residual")}</td>
                <td className="border px-4 py-2">{getValue("bonusProgram", "option3", "-")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">SaaS Fees</td>
                <td className="border px-4 py-2">{getValue("saasFees", "option1", "See RDR/Fraud Schedule")}</td>
                <td className="border px-4 py-2">{getValue("saasFees", "option2", "See RDR/Fraud Schedule")}</td>
                <td className="border px-4 py-2">{getValue("saasFees", "option3", "See RDR/Fraud Schedule")}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Monthly Equipment Cost</td>
                <td className="border px-4 py-2">{getValue("equipmentCost", "option1", "See Equipment Schedule")}</td>
                <td className="border px-4 py-2">{getValue("equipmentCost", "option2", "See Equipment Schedule")}</td>
                <td className="border px-4 py-2">{getValue("equipmentCost", "option3", "See Equipment Schedule")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>

      <CardContent className="prose custom-prose dark:prose-invert max-w-none">
        <h4 className="mt-10 text-xl font-semibold">Option 4 – Full-Service Lending & Credit Suite</h4>
        <ul className="list-decimal list-inside space-y-2">
          <li>
            <strong>SBA Loans</strong> (SBA Acquisition Loan Funding) – {getValue("sbaLoans", "option4", "5% Fee")}
          </li>
          <li>0% Interest Credit Cards – {getValue("creditCards", "option4", "5% Fee")}</li>
          <li>Bank Statement Bridge Loans – {getValue("bridgeLoans", "option4", "3% Fee")}</li>
          <li>Equipment Financing – {getValue("equipmentFinancing", "option4", "3% Fee")}</li>
          <li>Credit Optimization – {getValue("creditOptimization", "option4", "25% Fee")}</li>
        </ul>
      </CardContent>

      <CardContent className="prose dark:prose-invert max-w-none">
        {customTerms?.sections && Array.isArray(customTerms.sections) ? (
          <div className="space-y-4">
            {customTerms.sections.map((section: any, index: number) => {
              if (section.type === "header") {
                return (
                  <p key={section.id || index} className="font-bold">
                    {section.content}
                  </p>
                )
              } else if (section.type === "paragraph") {
                return (
                  <p key={section.id || index} className="whitespace-pre-wrap">
                    {section.content}
                  </p>
                )
              }
              return null
            })}
          </div>
        ) : (
          <>
            <h3 className="text-2xl mt-10 mb-4">TERMS</h3>
            <p>
              <strong>PASS-THROUGH FEES</strong> – fees are back-end charges, including but not limited to the cost of
              postage, paper statements, merchant records, terminal records, TMF look-ups, arbitration, and RMS fees. If
              any pass-through fees are applicable, they will be priced at cost and passed through to the Sales Partner.
            </p>

            <p className="mt-6">
              <strong>SPECIAL TERMS</strong> – This Revenue Sharing Program is part of the Lumino Partner Agreement (
              <em>"Partner Agreement"</em>). Additional terms and conditions may apply. All approved applications will
              be paid in accordance with the Option chosen at the time the application is submitted. If there is any
              change to the service offering that would cause a change to the Option originally chosen, Partner shall be
              paid at the appropriate Option from the date of the change in service (ex. Sales signed on Option 2 and
              later want a free POS Option 1). The Partner will be paid according to the new Option from the date the
              new Option is selected. This result may increase or decrease the residual split.
            </p>

            <p>
              Only new merchants that are not already on Lumino's platform qualify for the pricing in this{" "}
              <strong>Schedule A</strong>. Lumino shall retract any commissions paid to Partner for equipment placed at
              a Merchant location if the Merchant for which commissions were earned cancels, materially reduces
              processing volume, or the Monthly Minimum is reduced or removed within twelve months from the date of
              Adjustment as explained above. Partner agrees to use reasonable efforts in assisting Lumino's retrieval of
              the POS Equipment and Add-Ons in the event of merchant cancellation or termination.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
