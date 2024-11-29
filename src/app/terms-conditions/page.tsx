export default function TermsAndConditions() {
  // TODO: add go back
  const termsConditions = [
    {
      title: "Payment for Pre-Purchase",
      description:
        "Buyer agrees to pay a non-refundable Down Payment of $100 USD ($125 CAD) for the pre-purchase of 1,000 kg of CO2e, to be sequestered in SeaBrick blocks. The Buyer may buy multiple Claims at the same time, to be numbered sequentially.",
    },
    {
      title: "ISO14064-2 Methodology",
      description:
        "ISO14064-2 methodology will be used for validating the  greenhouse gas (GHG) emissions sequestered in the SeaBrick and guidelines for quantification, monitoring, and reporting of those emissions.",
    },
    {
      title: "Reservation of Place in Line",
      description:
        "Upon receipt of the payment for a SeaBrick Claim, the Seller agrees to reserve a place in line for Buyer to purchase SeaBrick. The value of the SeaBrick Claim can be used to offset the cost of that SeaBrick purchase. Limits on purchase size will be based on SeaBrick Claim value. A subsequent assessment and credit may be provided to the Buyer once the SeaBrick is deployed in situ. This reserved place is transferable to another party if Buyer chooses to do so. .",
    },
    {
      title: "Transferability",
      description:
        "The Buyer will gain the ability to transfer their SeaBrick Claim and associated carbon credit and purchase rights to another party in the form of a tokenized SeaBrick Claim. By  by accepting delivery of their SeaBrick Claim in the form of crypto token, the Buyer agrees that possession of the token is the same as ownership and abandons any other legal claim.",
    },
    {
      title: "Non-Refundable Down Payment",
      description:
        "The Down Payment is non-refundable under any circumstances, including but not limited to Buyer deciding not to purchase the Product or Seller being unable to fulfill the order due to force majeure events, changes in regulatory frameworks or underperformance of the project.",
    },
    {
      title: "Registration and Retirement",
      description:
        "Production of SeaBrick Claim will trigger the registration and retirement of the corresponding SeaBrick Claim and carbon credit. SeaBrick Claim value will be based on the value realized by Kelp Island upon the retirement of the credit. Claims will be validated and retired in the order they are purchased.",
    },
    {
      title: "Payout",
      description:
        "The Buyer can claim the current market value of 1 ton of biogenic CO2 once their carbon credit claim has been validated and retired.",
    },
    {
      title: "Taxes and Fees not included",
      description:
        "Payout will be what remains after applicable taxes and third party fees have been deducted.",
    },
    {
      title: "Governing Law",
      description:
        "This Agreement shall be governed by and construed in accordance with the laws of British Columbia, Canada.",
    },
    {
      title: "Entire Agreement",
      description:
        "This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, and representations.",
    },
    {
      title: "Updates",
      description:
        "This agreement may be amended from time to time at the discretion of the Seller, provided that the essential entitlement to 1 ton of biogenic carbon credits and a priority right to purchase SeaBrick  is not compromised.",
    },
  ]
  return (
    <>
      <div className="py-4 px-32 w-full">
        <p className="text-5xl w-full mt-8 mb-5 font-bold text-seabrick-blue">
          Terms and Conditions
        </p>
        <p className="text-lg">
          These Terms and conditions (the &quot;Agreement&quot;) govern the
          purchases of SeaBrick Claims from Kelp Island Inc.
        </p>
        <ul className="w-full">
          {termsConditions.map((d, i) => {
            return (
              <li key={i} className="w-full p-3 list-decimal">
                <p className="mt-1 text-lg font-bold">{d.title}</p>
                <span className="text-lg">{d.description}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
