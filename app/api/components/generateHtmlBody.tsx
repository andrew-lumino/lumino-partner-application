export function generateHtmlBody(formData: any, agreementText: string): string {
  const styles = {
    body: "font-family: sans-serif; line-height: 1.6; color: #333;",
    h1: "font-size: 24px; color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px;",
    h2: "font-size: 20px; color: #2a2a2a; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 30px;",
    ul: "list-style-type: none; padding-left: 0;",
    li: "margin-bottom: 10px; background-color: #f9f9f9; padding: 10px; border-radius: 4px;",
    strong: "color: #000;",
    pre: "background-color: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 12px; line-height: 1.5;",
  }

  const summaryHtml = `
    <div style="${styles.body}">
      <h1 style="${styles.h1}">New Lumino Partner Application</h1>
      <p>A new partner application has been submitted by <strong>${formData.partnerFullName}</strong> (${
        formData.partnerEmail
      }).</p>
      
      <h2 style="${styles.h2}">Partner Information</h2>
      <ul style="${styles.ul}">
        <li style="${styles.li}"><strong>Full Name:</strong> ${formData.partnerFullName}</li>
        <li style="${styles.li}"><strong>Email:</strong> ${formData.partnerEmail}</li>
        <li style="${styles.li}"><strong>Phone:</strong> ${formData.partnerPhone || "N/A"}</li>
        <li style="${styles.li}"><strong>Address:</strong> ${formData.partnerAddress}, ${formData.partnerCity}, ${
          formData.partnerState
        } ${formData.partnerZip}</li>
      </ul>

      <h2 style="${styles.h2}">Business Information</h2>
      <ul style="${styles.ul}">
        <li style="${styles.li}"><strong>Business Name:</strong> ${formData.businessName}</li>
        <li style="${styles.li}"><strong>Principal Name(s):</strong> ${formData.principalName || "N/A"}</li>
        <li style="${styles.li}"><strong>Business Address:</strong> ${formData.businessAddress}, ${
          formData.businessCity
        }, ${formData.businessState} ${formData.businessZip}</li>
        <li style="${styles.li}"><strong>Business Phone:</strong> ${formData.businessPhone || "N/A"}</li>
        <li style="${styles.li}"><strong>Federal Tax ID:</strong> ${formData.federalTaxId}</li>
        <li style="${styles.li}"><strong>Business Type:</strong> ${formData.businessType}</li>
        <li style="${styles.li}"><strong>Website URL:</strong> ${formData.websiteUrl || "N/A"}</li>
      </ul>

      <h2 style="${styles.h2}">W-9 Information</h2>
      <ul style="${styles.ul}">
        <li style="${styles.li}"><strong>Name on Tax Return:</strong> ${formData.w9Name}</li>
        <li style="${styles.li}"><strong>Business Name (if different):</strong> ${formData.w9BusinessName || "N/A"}</li>
        <li style="${styles.li}"><strong>Tax Classification:</strong> ${formData.w9TaxClassification} ${
          formData.w9TaxClassification === "llc" ? `(${formData.w9LlcClassification})` : ""
        }</li>
        <li style="${styles.li}"><strong>Address:</strong> ${formData.w9Address}</li>
        <li style="${styles.li}"><strong>City, State, ZIP:</strong> ${formData.w9CityStateZip}</li>
        <li style="${styles.li}"><strong>TIN:</strong> ${formData.w9TINType.toUpperCase()}: ${formData.w9TIN}</li>
      </ul>
      
      <h2 style="${styles.h2}">Signatures</h2>
      <ul style="${styles.ul}">
        <li style="${styles.li}"><strong>Code of Conduct Signature:</strong> ${
          formData.codeOfConductSignature
        } on ${formData.codeOfConductDate}</li>
        <li style="${styles.li}"><strong>Agreement Signature:</strong> ${formData.signatureFullName} on ${
          formData.signatureDate
        }</li>
      </ul>
    </div>
  `

  return summaryHtml
}
