import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const renderCodeOfConductStep = (formData, errors) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-3xl">Partner’s Code of Conduct</CardTitle>
      <CardDescription>Please read the following code of conduct carefully.</CardDescription>
    </CardHeader>
    <CardContent className="prose custom-prose dark:prose-invert max-w-none space-y-4">
      <div className="pb-4">
        {/* <h3 className="font-bold">PARTNER’S CODE OF CONDUCT</h3> */}
        <p>
          All advertisements and materials involved in or related to the sale of a product or service, or which
          contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by
          Lumino and in advance of their use. The use of the Internet for marketing products and services is subject
          to the same policies and procedures applicable to written or printed material. Please note that to help all
          of our partners maintain compliance with the Visa/MasterCard regulations regarding the advertisement of card
          processing services on the Internet, all of the Visa/MasterCard regulations must be met in addition to the
          following:
        </p>
        <p>
          The following endorsement statement must appear at the bottom of the website’s homepage, “about us” page and
          any website pages displaying Visa/MasterCard logos and/or text or advertising for Merchant services. *All
          Merchant Accounts are referred to and processing services are provided by Lumino. Credit card logos cannot
          appear on your website unless you accept those credit cards as a form of payment, and may not appear on any
          page advertising for Merchant processing services unless the above requirement is met.
        </p>
        <p>
          If you choose to use an “apply now” feature for online Merchant applications, you must have a link on your
          site to your company-branded web page.
        </p>
        <p>
          In addition to the above Visa/MasterCard marketing regulations, there exist legal restrictions or
          Prohibitions on some forms of advertising, notably, but not limited to, fax advertising (entirely prohibited
          in the US), email solicitation, and automated dialers/announcing devices (“ADAD’). While the above-mentioned
          Visa/MasterCard regulations still apply, Lumino has an obligation to notify our partners of the importance
          of familiarizing themselves with the various laws surrounding the use of automated dialers/announcing
          devices. These laws vary in scope and severity based on jurisdictional differences.
        </p>
      </div>
      <p>
        We have summarized the laws and regulations of each of the states about the making of business-to-business
        sales calls utilizing ADAD. You must have the ability to segment your files to ensure compliance. Remember,
        your organization or you personally will be held liable for non-compliance. This list is for information
        purposes only and Lumino does not represent it as complete.
      </p>
      <p>
        ADADs are regulated federally for calls to consumers. However, there are no federal restrictions on their use
        for commercial calls. Furthermore, many states have enacted regulatory frameworks that seek both to protect
        residents (often businesses and consumers) from the annoyance of ADAD calls and to prevent ADAD-generated
        calls from impeding telephone service.
      </p>
      <br />
      <div className="pt-8">
        <h3 className="font-bold">EXPERIENCED PARTNERS</h3>
        <p>
          Lumino recommends that you seek legal advice pertaining to the operation of any ADAD equipment. This
          document is not intended as a replacement for sound legal advice, and the use of ADAD equipment is entirely
          your decision and responsibility.
        </p>
        <br />
        <h4 className="font-bold">AUTOMATED DIALER AND ANNOUNCING DEVICE (ADAD) COMPLIANCE</h4>
        <p>
          In the following states, ADAD delivered business-to-business sales calls are extremely forbidden (whether
          according to criminal statutes or civil regulations): Arkansas (criminal), Maryland (criminal), Mississippi
          (civil), North Carolina (civil), Washington (civil), and Wyoming (criminal).
        </p>
        <p>
          The following states allow business-to-business ADAD calls without restrictions: Alabama, Alaska, Arizona,
          Connecticut, Delaware, Florida, Georgia, Hawaii, Kansas, Louisiana, Missouri, Ohio, Oregon, South Carolina,
          South Dakota, Texas, Vermont, Virginia, and West Virginia.
        </p>
        <p>
          Several states impose various time, place, and manner restrictions. These types of restrictions tend to
          limit the hours during which ADAD calls can be made (typically between 9 a.m. and 9 p.m.), require a short
          period after hang-up for the call to be disconnected (the range tends to be between five and thirty seconds)
          and mandate that the name and contact information of the business for whom the call is being made be
          provided at the start of the call. The states with some combination of these fairly manageable ADAD
          regulations are the following: Idaho, Maine, Massachusetts, Nebraska, Nevada, New York, and Rhode Island.
        </p>
        <p>
          Two states require that the operator of ADAD equipment register with, or obtain a permit from, the state.
          These states are: New Hampshire and Tennessee.
        </p>
        <p>
          Several states have imposed fairly onerous restrictions upon those businesses that attempt to solicit sales
          through the use of business-to-business ADAD calls. Some of these states require that live operators
          introduce the recorded call, that ADAD calls can only be made to businesses with whom the caller has a prior
          relationship or has otherwise consented to receive ADAD calls, and that the ADAD equipment only operates
          while it is attended.
        </p>
        <p>
          The following states require that a live operator introduce an ADAD call, or otherwise be available during
          the call: California, Indiana, and Iowa.
        </p>
        <p>
          Three states require that ADAD calls must be introduced by a live operator unless the recipient has
          previously consented to receiving such calls: New Jersey, North Dakota and Oklahoma.
          <br />
          <br />
          Several states only allow ADAD calls to be made if there is a prior business relationship between the
          recipient and the caller: Colorado, District of Columbia, Illinois, New Mexico, and Utah.
          <br />
          <br />
          Express consent is required to be given by the recipient before ADAD calls can be made to businesses in the
          following states: Michigan, Minnesota, Montana, and Wisconsin.
          <br />
          <br />
          One state requires that ADAD equipment be attended to: Kentucky.
        </p>
        <p>
          Comparative or competitive information must be approved in advance by Lumino, like any other form of sales
          material. Comparisons must be true, current, dated, and factual.
          <br />
          <br />
          Any materials identified as “For Internal Use Only” shall not be used by the public.
        </p>
        <p>
          Accurate and reliable records are necessary to meet both your professional responsibilities and Lumino’s
          legal and financial obligations. Because of this, you are required to keep up-to-date records and files of
          any transactions, correspondence, documentation, etc. involving your clients.
          <br />
          <br />
          You must make your records involving products and services available to Lumino for general auditing purposes
          or to enable Lumino to respond to any regulatory or administrative action against Lumino or yourself.
          <br />
          <br />
          NOTE: Any cost associated with any legal actions involving Lumino as a part of the defendant will be
          deducted from the residual income of the Partner and may result in a material breach of the Partner
          agreement.
        </p>
        <br />
        <h3 className="font-bold">CONFIDENTIALITY</h3>
        <p>
          In your role as a Lumino Partner, you will possess confidential information about your Merchant and Lumino.
          A breach of confidentiality can have serious consequences. Therefore, you must safeguard all confidential
          Merchant and Lumino information and only provide access to individuals who have a legitimate right to it.
          You are responsible for maintaining the security of all confidential information in your possession, which
          shall be held at all times in strict confidence, and you hereby agree to indemnify, defend, and hold
          harmless Lumino from any financial, reputational, or other damage that results from your breach of this
          paragraph. The confidentiality obligations contained herein are in addition to, and not in lieu of, similar
          or greater obligations contained in the Partner Agreement or elsewhere agreed between you and Lumino.
        </p>
        <h3 className="font-bold">VIOLATION OF LUMINO POLICY</h3>
        <p>
          The purpose of policies and procedures is to ensure Lumino's ability to provide the highest quality products
          and services to its Merchants and Partners. In order to protect the solid reputation of Lumino and its
          Partners, appropriate action (verbal or written, contract termination or prosecution) will be taken by
          Lumino on all known violations of its policies and procedures. Lumino requires all Partners to abide by its
          policies and procedures. Due to frequent law changes, these compliances are subject to change. Partners will
          be responsible for being up-to-date with current regulations.
        </p>
      </div>
      <div className="space-y-4 py-4">
        <h3 className="font-bold">Maintaining Records</h3>
        <p className="text-sm">
          Please acknowledge receipt and understanding of the above-stated compliance and code of ethics agreement,
          and return with the Lumino Partner Agreement:
        </p>
        <div className="space-y-2">
          <Label htmlFor="codeOfConductSignature">Typed Signature (Full Name)</Label>
          <Input
            id="codeOfConductSignature"
            value={formData.codeOfConductSignature}
            onChange={(e) => updateFormData("codeOfConductSignature", e.target.value)}
            className={errors.codeOfConductSignature ? "border-red-500" : ""}
          />
          {errors.codeOfConductSignature && <p className="text-red-500 text-sm">{errors.codeOfConductSignature}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="codeOfConductDate">Date</Label>
          <Input
            id="codeOfConductDate"
            type="date"
            value={formData.codeOfConductDate}
            onChange={(e) => updateFormData("codeOfConductDate", e.target.value)}
            className={errors.codeOfConductDate ? "border-red-500" : ""}
          />
          {errors.codeOfConductDate && <p className="text-red-500 text-sm">{errors.codeOfConductDate}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
)
