interface ScheduleARow {
  category: string
  option1: string
  option2: string
  option3: string
  option4: string
}

interface ScheduleAData {
  equipment?: ScheduleARow
  associationFees?: ScheduleARow
  visaMcFee?: ScheduleARow
  otherTransactionFee?: ScheduleARow
  binSponsorship?: ScheduleARow
  amexOptBlue?: ScheduleARow
  monthlySupportFee?: ScheduleARow
  monthlyMinimum?: ScheduleARow
  chargebackFee?: ScheduleARow
  retrievalRequest?: ScheduleARow
  bonusProgram?: ScheduleARow
  saasFees?: ScheduleARow
  equipmentCost?: ScheduleARow
  sbaLoans?: ScheduleARow
  creditCards?: ScheduleARow
  bridgeLoans?: ScheduleARow
  equipmentFinancing?: ScheduleARow
  creditOptimization?: ScheduleARow
}

interface FormData {
  partnerFullName: string
  partnerEmail: string
  partnerPhone: string
  partnerAddress: string
  partnerCity: string
  partnerState: string
  partnerZip: string
  businessName: string
  principalName: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPhone: string
  federalTaxId: string
  businessType: string
  websiteUrl: string
  dateOfBirth: string
  bankAccountNumber: string
  bankRoutingNumber: string
  w9Name: string
  w9BusinessName: string
  w9TaxClassification: string
  w9LlcClassification?: string
  w9Address: string
  w9CityStateZip: string
  w9TIN: string
  w9TINType: string
  signatureDate: string
  signatureFullName: string
}

interface AgreementReviewProps {
  formData: FormData
  scheduleA: ScheduleAData
}

export function AgreementReview({ formData, scheduleA }: AgreementReviewProps) {
  const orderOfRows: (keyof ScheduleAData)[] = [
    "equipment",
    "associationFees",
    "visaMcFee",
    "otherTransactionFee",
    "binSponsorship",
    "amexOptBlue",
    "monthlySupportFee",
    "monthlyMinimum",
    "chargebackFee",
    "retrievalRequest",
    "bonusProgram",
    "saasFees",
    "equipmentCost",
    "sbaLoans",
    "creditCards",
    "bridgeLoans",
    "equipmentFinancing",
    "creditOptimization",
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold mb-2">LUMINO PARTNER AGREEMENT</h2>
        <p className="text-lg">{formData.partnerFullName || ""}</p>
        <p className="text-lg">{formData.businessName || ""}</p>
        <p className="text-sm text-muted-foreground">
          Date: {formData.signatureDate || new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Partner Information */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">PARTNER INFORMATION</h3>
        <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
          <p>
            <span className="font-semibold">Full Name:</span> {formData.partnerFullName || ""}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {formData.partnerEmail || ""}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {formData.partnerPhone || ""}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {formData.partnerAddress || ""}
          </p>
          <p>
            <span className="font-semibold">City:</span> {formData.partnerCity || ""}
          </p>
          <p>
            <span className="font-semibold">State:</span> {formData.partnerState || ""}
          </p>
          <p>
            <span className="font-semibold">ZIP Code:</span> {formData.partnerZip || ""}
          </p>
        </div>
      </div>

      {/* Business Information */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">BUSINESS INFORMATION</h3>
        <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
          <p>
            <span className="font-semibold">Business Name:</span> {formData.businessName || ""}
          </p>
          <p>
            <span className="font-semibold">Principal Name:</span> {formData.principalName || ""}
          </p>
          <p>
            <span className="font-semibold">Federal Tax ID:</span> {formData.federalTaxId || ""}
          </p>
          <p>
            <span className="font-semibold">Business Type:</span> {formData.businessType || ""}
          </p>
          <p>
            <span className="font-semibold">Website URL:</span> {formData.websiteUrl || ""}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {formData.businessAddress || ""}
          </p>
          <p>
            <span className="font-semibold">City:</span> {formData.businessCity || ""}
          </p>
          <p>
            <span className="font-semibold">State:</span> {formData.businessState || ""}
          </p>
          <p>
            <span className="font-semibold">ZIP Code:</span> {formData.businessZip || ""}
          </p>
        </div>
      </div>

      {/* W-9 Information */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">W-9 INFORMATION</h3>
        <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
          <p>
            <span className="font-semibold">Name:</span> {formData.w9Name || ""}
          </p>
          <p>
            <span className="font-semibold">Business Name:</span> {formData.w9BusinessName || ""}
          </p>
          <p>
            <span className="font-semibold">Tax Classification:</span> {formData.w9TaxClassification || ""}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {formData.w9Address || ""}
          </p>
          <p>
            <span className="font-semibold">City, State, ZIP:</span> {formData.w9CityStateZip || ""}
          </p>
        </div>
      </div>

      {/* Schedule A */}
      <div className="w-full">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">SCHEDULE A - FEE SCHEDULE</h3>
        <div className="w-full overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b">
                <th className="text-left font-bold p-2 min-w-[180px]">Fee Category</th>
                <th className="text-center font-bold p-2 min-w-[140px]">Option 1</th>
                <th className="text-center font-bold p-2 min-w-[140px]">Option 2</th>
                <th className="text-center font-bold p-2 min-w-[140px]">Option 3</th>
                <th className="text-center font-bold p-2 min-w-[140px]">Option 4</th>
              </tr>
            </thead>
            <tbody>
              {orderOfRows.map((key) => {
                const row = scheduleA[key]
                if (!row) return null
                return (
                  <tr key={key} className="border-b">
                    <td className="p-2 font-medium break-words">{row.category}</td>
                    <td className="p-2 text-center break-words">{row.option1}</td>
                    <td className="p-2 text-center break-words">{row.option2}</td>
                    <td className="p-2 text-center break-words">{row.option3}</td>
                    <td className="p-2 text-center break-words">{row.option4}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code of Conduct */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">PARTNER'S CODE OF CONDUCT</h3>
        <div className="space-y-4 text-sm">
          <p>
            All advertisements and materials involved in or related to the sale of a product or service, or which
            contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by
            Lumino and in advance of their use.
          </p>
          <p>
            The use of the Internet for marketing products and services is subject to the same policies and procedures
            applicable to written or printed material.
          </p>
          <p className="font-bold">EXPERIENCED PARTNERS</p>
          <p>
            Lumino recommends that you seek legal advice pertaining to the operation of any ADAD equipment. This
            document is not intended as a replacement for sound legal advice, and the use of ADAD equipment is entirely
            your decision and responsibility.
          </p>
          <p className="font-bold">AUTOMATED DIALER AND ANNOUNCING DEVICE (ADAD) COMPLIANCE</p>
          <p>
            In the following states, ADAD delivered business-to-business sales calls are extremely forbidden: Arkansas
            (criminal), Maryland (criminal), Mississippi (civil), North Carolina (civil), Washington (civil), and
            Wyoming (criminal).
          </p>
          <p className="font-bold">CONFIDENTIALITY</p>
          <p>
            In your role as a Lumino Partner, you will possess confidential information about your Merchant and Lumino.
            A breach of confidentiality can have serious consequences.
          </p>
          <p className="font-bold">VIOLATION OF LUMINO POLICY</p>
          <p>
            The purpose of policies and procedures is to ensure Lumino's ability to provide the highest quality products
            and services to its Merchants and Partners.
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">TERMS AND CONDITIONS</h3>
        <div className="space-y-4 text-sm">
          <p className="font-bold">PARTNER AGREEMENT</p>
          <p>
            This Partner Agreement ("Agreement") is entered into as of the date of execution between Lumino
            Technologies, LLC ("Company") and the Partner identified in the application ("Partner").
          </p>
          <p className="font-bold">1. APPOINTMENT AND SCOPE</p>
          <p>
            Company appoints Partner as a non-exclusive independent contractor to promote and refer potential clients
            for Company's payment processing and financial services as detailed in Schedule A.
          </p>
          <p className="font-bold">2. COMPENSATION</p>
          <p>Partner shall receive compensation according to the fee schedule outlined in Schedule A.</p>
          <p className="font-bold">3. TERM AND TERMINATION</p>
          <p>
            This Agreement shall commence on the date of execution and continue until terminated by either party with
            thirty (30) days written notice.
          </p>
          <p className="font-bold">4. INDEPENDENT CONTRACTOR STATUS</p>
          <p>Partner is an independent contractor and not an employee, agent, or legal representative of Company.</p>
          <p className="font-bold">5. CONFIDENTIALITY</p>
          <p>Partner agrees to maintain the confidentiality of all proprietary information.</p>
          <p className="font-bold">6. GOVERNING LAW</p>
          <p>This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware.</p>
        </div>
      </div>
    </div>
  )
}
