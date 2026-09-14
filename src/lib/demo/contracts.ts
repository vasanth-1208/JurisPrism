export interface DemoContract {
  id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
  documentType: string;
  rawText: string;
}

export const DEMO_CONTRACTS: DemoContract[] = [
  {
    id: "demo-employment-agreement",
    title: "Senior Software Engineer Employment Agreement",
    category: "Employment & Labor",
    description: "Standard executive employment agreement with IP assignment, non-compete covenants, bonus clawbacks, and termination provisions.",
    filename: "Employment_Agreement_Acme_Technologies.txt",
    documentType: "Employment Agreement",
    rawText: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is entered into as of October 1, 2024 (the "Effective Date"), by and between Acme Technologies, Inc., a Delaware corporation with its principal place of business at 500 Silicon Vista Way, San Francisco, CA 94105 (the "Company"), and Alex Morgan, an individual residing at 742 Evergreen Terrace, San Francisco, CA 94110 (the "Employee").

RECITALS
WHEREAS, the Company desires to employ the Employee as a Senior Software Engineer, and the Employee desires to accept such employment upon the terms and subject to the conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual promises, covenants, and conditions herein contained, the parties agree as follows:

1. POSITION AND DUTIES
1.1 Title and Reporting. The Employee shall serve as Senior Software Engineer, reporting to the VP of Engineering. The Employee shall perform all duties customary to such position and such other duties as may be assigned from time to time by the Company.
1.2 Devotion of Time. The Employee agrees to devote their full working time, attention, and energies to the business of the Company, and shall not, during the term of employment, engage in any other business activities, consulting, or employment without prior written approval of the Company.

2. COMPENSATION AND BENEFITS
2.1 Base Salary. The Company shall pay the Employee an annualized base salary of $185,000 (One Hundred Eighty-Five Thousand US Dollars), payable in accordance with the Company's standard payroll practices, less applicable withholdings and deductions.
2.2 Discretionary Annual Bonus. The Employee shall be eligible to receive an annual discretionary performance bonus targeted at 15% of the Base Salary, subject to the achievement of individual and corporate objectives determined exclusively by the Board of Directors.
2.3 Equity Incentive. Subject to the approval of the Board of Directors, the Employee shall be granted an option to purchase 25,000 shares of the Company's Common Stock, subject to a standard four-year vesting schedule with a one-year cliff (25% vesting after 12 months, and 1/48th monthly thereafter).
2.4 Benefits. The Employee shall be eligible to participate in such health, dental, retirement (401k), and paid-time-off (PTO) benefit plans as are made generally available to other full-time employees, consisting of 20 days PTO per calendar year.

3. TERM AND TERMINATION
3.1 At-Will Employment. The Employee's employment with the Company is "at-will." Either party may terminate the employment relationship at any time, with or without cause, and with or without advance notice, subject to Section 3.2.
3.2 Notice Requirement. The Employee agrees to provide thirty (30) calendar days' advance written notice to the Company prior to any voluntary resignation. The Company reserves the right to accelerate the departure date upon receipt of such notice.
3.3 Termination for Cause. The Company may terminate the Employee's employment immediately without notice or severance in the event of "Cause," defined as: (a) material breach of this Agreement or Company policies; (b) willful misconduct or fraud; (c) conviction of a felony; or (d) chronic failure to perform reasonable assigned duties following ten (10) days written cure notice.
3.4 Severance. If the Employee is terminated by the Company without Cause, and conditioned upon Employee executing a comprehensive general release of claims in favor of the Company, the Company shall pay Employee severance pay equal to three (3) months of Base Salary and continue COBRA premium subsidies for three (3) months.

4. INTELLECTUAL PROPERTY AND INVENTIONS
4.1 Proprietary Information. Employee agrees to hold all Company proprietary information, trade secrets, software code, customer data, and system architectures in strict confidence indefinitely.
4.2 Assignment of Inventions. Employee hereby irrevocably assigns and transfers to the Company all right, title, and interest in and to all inventions, discoveries, designs, algorithms, developments, works of authorship, whether patentable or copyrightable, created, conceived, or reduced to practice by Employee, solely or jointly, during the period of employment that relate to the Company's current or demonstrably anticipated business or products.
4.3 Prior Inventions. Any inventions created by Employee prior to the Effective Date are listed on Exhibit A. If no Exhibit A is attached, Employee warrants that no prior inventions exist.

5. RESTRICTIVE COVENANTS
5.1 Non-Competition. During the term of employment and for a period of twelve (12) months following the termination of employment for any reason, Employee shall not directly or indirectly engage in, perform services for, invest in, or assist any business entity that directly competes with the Company's core cloud-infrastructure products within the United States.
5.2 Non-Solicitation of Employees. For a period of twelve (12) months following termination, Employee shall not induce, solicit, or recruit any Company employee, contractor, or consultant to leave Company employment.
5.3 Non-Solicitation of Customers. For a period of twelve (12) months following termination, Employee shall not solicit or divert any customer or client of the Company with whom Employee had material business contact during the final twelve (12) months of employment.

6. INDEMNIFICATION AND LIABILITY
6.1 Employee Liability. Employee shall be personally liable for, and shall indemnify the Company against, any damages, losses, or legal costs arising from Employee's gross negligence, willful misconduct, or unauthorized disclosure of Company confidential data.
6.2 Limitation of Company Liability. In no event shall the Company be liable to Employee for any consequential, indirect, punitive, or special damages arising out of this Agreement.

7. DISPUTE RESOLUTION AND GOVERNING LAW
7.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.
7.2 Mandatory Arbitration. Any dispute, claim, or controversy arising out of or relating to this Agreement or Employee's employment shall be submitted to final and binding arbitration administered by JAMS in San Francisco, California, pursuant to its Employment Arbitration Rules. The parties waive any right to trial by jury or to participate in class action litigation.
7.3 Attorney's Fees. In any action or arbitration to enforce the terms of this Agreement, the prevailing party shall be entitled to recover reasonable attorneys' fees and costs.

8. MISCELLANEOUS
8.1 Entire Agreement. This Agreement constitutes the complete agreement between the parties regarding employment and supersedes all prior oral or written understandings.
8.2 Severability. If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary, and the remaining provisions shall remain in full force.
8.3 Counterparts. This Agreement may be executed in counterparts and via electronic signature.

IN WITNESS WHEREOF, the parties have executed this Employment Agreement as of the Effective Date.

ACME TECHNOLOGIES, INC.
By: /s/ Sarah Jenkins
Name: Sarah Jenkins
Title: Chief Executive Officer

EMPLOYEE:
By: /s/ Alex Morgan
Name: Alex Morgan
Date: October 1, 2024`,
  },
  {
    id: "demo-commercial-lease",
    title: "Commercial Real Estate Lease Agreement",
    category: "Real Estate & Leasing",
    description: "Office building commercial lease agreement with triple-net (NNN) expenses, security deposit, default acceleration, and holdover provisions.",
    filename: "Commercial_Lease_Metropolitan_Towers.txt",
    documentType: "Commercial Lease",
    rawText: `COMMERCIAL LEASE AGREEMENT

This Commercial Lease Agreement (the "Lease") is made and entered into on November 15, 2024, by and between Metropolitan Towers LLC, a New York limited liability company ("Landlord"), and Apex Innovations Inc., a Delaware corporation ("Tenant").

1. PREMISES
Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, Suite 1400 (the "Premises"), comprising approximately 4,200 rentable square feet located on the 14th floor of the commercial office building situated at 350 Madison Avenue, New York, NY 10017 (the "Building").

2. TERM AND RENEWAL OPTION
2.1 Initial Term. The term of this Lease shall be for thirty-six (36) consecutive months, commencing on January 1, 2025 (the "Commencement Date") and expiring on December 31, 2027 (the "Expiration Date"), unless terminated earlier pursuant to the terms hereof.
2.2 Option to Renew. Tenant shall have one (1) option to renew this Lease for an additional period of three (3) years (the "Renewal Term"), provided Tenant is not in material default. Tenant must deliver unconditional written notice of election to renew to Landlord no later than one hundred eighty (180) days prior to the Expiration Date. Failure to provide timely notice shall automatically terminate the renewal option.

3. RENT AND FINANCIAL OBLIGATIONS
3.1 Base Rent. Tenant shall pay Landlord monthly Base Rent in advance on or before the first (1st) day of each calendar month as follows:
- Year 1 (Months 1-12): $14,000.00 per month ($168,000 annual)
- Year 2 (Months 13-24): $14,700.00 per month (5% increase)
- Year 3 (Months 25-36): $15,435.00 per month (5% increase)
3.2 Late Charge and Interest. If any installment of Rent is not received by Landlord within five (5) calendar days of its due date, Tenant shall immediately pay a late fee equal to 8% of the overdue amount, plus interest accruing at 1.5% per month until paid in full.
3.3 Operating Expenses (Triple Net). Tenant shall pay its proportionate share (4.2%) of Building Operating Expenses, including real estate property taxes, structural building insurance, and common area maintenance (CAM), billed monthly.
3.4 Security Deposit. Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $42,000.00 (equivalent to three months Base Rent) as security for the faithful performance of all Lease covenants.

4. USE AND MAINTENANCE
4.1 Permitted Use. The Premises shall be used exclusively for general executive and administrative office purposes and for no other purpose without Landlord's prior written consent.
4.2 Tenant Maintenance. Tenant shall, at its sole cost and expense, keep the interior of the Premises in good order, condition, and repair, including interior partitions, light fixtures, electrical wiring, and HVAC distribution components within the suite.
4.3 Alterations. Tenant shall make no structural alterations, additions, or improvements without Landlord's prior written consent. Any permitted alterations costing over $5,000 shall require Landlord's designated contractor.

5. INSURANCE AND INDEMNIFICATION
5.1 Tenant Insurance. Tenant shall maintain Commercial General Liability insurance with limits of not less than $2,000,000 per occurrence and $4,000,000 general aggregate, naming Landlord as an additional insured. Proof of insurance must be furnished annually thirty (30) days prior to policy expiration.
5.2 Indemnification. Tenant shall defend, indemnify, and hold harmless Landlord, its agents, and employees from and against any and all claims, liabilities, damages, or costs (including legal fees) arising from Tenant's use of the Premises or any negligence of Tenant's agents, employees, or visitors.

6. DEFAULT AND REMEDIES
6.1 Events of Default. Each of the following constitutes an Event of Default: (a) failure to pay Rent within ten (10) days after written notice; (b) failure to cure any non-monetary covenant breach within twenty (20) days following notice; (c) bankruptcy or insolvency of Tenant.
6.2 Acceleration of Rent. Upon the occurrence of an Event of Default, Landlord may terminate this Lease, re-enter the Premises, and accelerate the entire balance of all remaining unpaid Rent due for the balance of the Lease Term, immediately due and payable.

7. SURRENDER AND HOLDOVER
7.1 Surrender. Upon expiration or termination, Tenant shall surrender the Premises in broom-clean condition, reasonable wear and tear excepted.
7.2 Holdover Penalty. If Tenant holds over possession of the Premises following expiration without Landlord's express written agreement, Tenant shall pay monthly holdover rent equal to 200% of the Base Rent in effect immediately prior to expiration, and shall indemnify Landlord against all losses resulting from delayed delivery to incoming tenants.

8. GOVERNING LAW AND JURISDICTION
This Lease shall be governed by and construed under the laws of the State of New York. The parties consent to exclusive jurisdiction and venue in the Supreme Court of the State of New York, County of New York.

METROPOLITAN TOWERS LLC (Landlord)
By: /s/ Richard Sterling, Managing Member

APEX INNOVATIONS INC. (Tenant)
By: /s/ Elena Rostova, Chief Financial Officer`,
  },
  {
    id: "demo-mutual-nda",
    title: "Mutual Non-Disclosure Agreement (MNDA)",
    category: "Confidentiality & IP",
    description: "Bilateral confidentiality agreement with strict definition of confidential data, exclusion carve-outs, return/destruction duties, and 2-year survival term.",
    filename: "Mutual_NDA_Horizon_GeneVantage.txt",
    documentType: "Non-Disclosure Agreement",
    rawText: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is made effective as of August 10, 2024 ("Effective Date"), by and between Horizon Health Corporation, a Massachusetts corporation ("Horizon"), and GeneVantage Labs Inc., a Delaware corporation ("GeneVantage"). Horizon and GeneVantage may collectively be referred to as the "Parties" or individually as a "Party."

1. PURPOSE
The Parties wish to explore potential business partnerships and collaborative research regarding gene-editing diagnostic workflows (the "Purpose"). In connection with the Purpose, each Party may disclose to the other Party certain non-public, proprietary, or confidential information.

2. CONFIDENTIAL INFORMATION
2.1 Definition. "Confidential Information" means all non-public technical, clinical, financial, business, operational, customer, or software information disclosed by one Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally, visually, or in writing, that is marked as "Confidential" or "Proprietary" or that reasonably should be understood to be confidential given the nature of the information.
2.2 Exclusions. Confidential Information does not include information that: (a) is or becomes publicly available without breach of this Agreement; (b) was already known to Receiving Party without confidentiality restrictions prior to disclosure; (c) is independently developed by Receiving Party without reference to or reliance upon Disclosing Party's Confidential Information; or (d) is received from a third party without an obligation of confidentiality.

3. OBLIGATIONS OF RECEIVING PARTY
3.1 Standard of Care. The Receiving Party shall protect Disclosing Party's Confidential Information using the same degree of care it uses for its own confidential information of like nature, but in no event less than a reasonable degree of care.
3.2 Permitted Use. The Receiving Party shall use Confidential Information solely in furtherance of the Purpose and for no other commercial or competitive purpose.
3.3 Need-to-Know Access. The Receiving Party may disclose Confidential Information only to its employees, directors, and professional legal and financial advisors who have a strict need to know for the Purpose and who are bound by written confidentiality obligations at least as restrictive as those contained herein.

4. COMPELLED DISCLOSURE
If Receiving Party is legally compelled by court order, subpoena, or administrative regulation to disclose any Confidential Information, Receiving Party shall provide prompt written notice to Disclosing Party (to the extent legally permissible) within five (5) business days to enable Disclosing Party to seek a protective order.

5. RETURN OR DESTRUCTION OF MATERIALS
Within ten (10) business days following written request by Disclosing Party or upon termination of discussions regarding the Purpose, Receiving Party shall, at Disclosing Party's option, promptly return or securely destroy all tangible materials containing Confidential Information and certify in writing by an authorized officer that such destruction is complete.

6. TERM AND SURVIVAL
This Agreement shall govern disclosures made for a period of one (1) year from the Effective Date. The confidentiality and non-use obligations set forth herein shall survive termination of this Agreement for a period of two (2) years from the date of disclosure; provided, however, that with respect to any trade secrets, such obligations shall survive for so long as the information remains a trade secret under applicable law.

7. NO LICENSE OR WARRANTY
Nothing in this Agreement grants either Party any license, copyright, patent, trademark, or other intellectual property right. All information is provided "AS IS," without warranty of accuracy, completeness, or fitness for a particular purpose.

8. INJUNCTIVE RELIEF
The Parties acknowledge that unauthorized disclosure or use of Confidential Information will cause irreparable injury for which monetary damages alone would be inadequate. Disclosing Party shall be entitled to seek temporary and permanent injunctive relief without the necessity of posting a bond.

9. GOVERNING LAW AND VENUE
This Agreement shall be governed by and interpreted under the laws of the State of Delaware, without regard to conflicts of law rules. Any legal proceedings shall be brought exclusively in the state or federal courts located in Wilmington, Delaware.

HORIZON HEALTH CORPORATION
By: /s/ Dr. Marcus Thorne, Chief Scientific Officer

GENEVANTAGE LABS INC.
By: /s/ Claire Deveraux, VP Business Development`,
  },
  {
    id: "demo-employment-redline",
    title: "Senior Software Engineer Employment Agreement (Candidate Redline)",
    category: "Employment & Labor (Comparison Version)",
    description: "Modified counter-draft of the Acme Technologies agreement with removed non-compete, increased severance (6 months), mutual IP exclusions, and narrower cause definitions.",
    filename: "Employment_Agreement_Acme_Redline_v2.txt",
    documentType: "Employment Agreement",
    rawText: `EMPLOYMENT AGREEMENT (REVISED DRAFT v2 - REDLINE)

This Employment Agreement (the "Agreement") is entered into as of October 1, 2024 (the "Effective Date"), by and between Acme Technologies, Inc., a Delaware corporation (the "Company"), and Alex Morgan, an individual residing in San Francisco, CA (the "Employee").

1. POSITION AND DUTIES
1.1 Title and Reporting. The Employee shall serve as Senior Software Engineer, reporting to the VP of Engineering.
1.2 Devotion of Time. The Employee agrees to devote their professional working hours to Company business, but retains the right to engage in personal open-source projects, writing, and advisory roles that do not directly conflict with Company products.

2. COMPENSATION AND BENEFITS
2.1 Base Salary. The Company shall pay the Employee an annualized base salary of $195,000 (One Hundred Ninety-Five Thousand US Dollars), payable bi-weekly.
2.2 Annual Bonus. The Employee shall participate in an annual bonus pool with a guaranteed minimum floor of 10% and a target of 20% based on mutually agreed OKRs.
2.3 Equity Incentive. Option grant of 30,000 shares of Common Stock with 4-year vesting and single-trigger acceleration upon change of control.
2.4 Benefits. Full health/dental/vision coverage with 25 days PTO per calendar year.

3. TERM AND TERMINATION
3.1 Notice Requirement. Either party may terminate with fourteen (14) days advance written notice.
3.2 Termination for Cause. "Cause" is narrowly defined as a final criminal conviction of a felony or intentional fraud causing material financial harm to Company.
3.3 Severance. If terminated without Cause, Employee shall receive six (6) months of Base Salary plus full COBRA premium coverage for six (6) months.

4. INTELLECTUAL PROPERTY
4.1 Carve-Out for Personal Inventions. Assignment of inventions is strictly limited to inventions created during working hours using Company equipment that relate directly to Company's proprietary cloud product. All personal inventions created on Employee's personal time remain Employee's exclusive property.

5. RESTRICTIVE COVENANTS
5.1 Non-Competition. DELETED IN ITS ENTIRETY (Void under California Business and Professions Code § 16600).
5.2 Non-Solicitation. Limited to 6 months post-termination, strictly covering direct encouragement of engineers with whom Employee worked directly.

6. INDEMNIFICATION AND LIABILITY
6.1 Mutual Indemnification. Company shall defend and indemnify Employee against all third-party claims arising from Employee's good-faith performance of duties.
6.2 Mutual Limitation of Liability. Neither party shall be liable for indirect or consequential damages.

7. DISPUTE RESOLUTION
7.1 Governing Law. State of California.
7.2 Mediation First. Parties agree to good-faith mediation before initiating binding arbitration in San Francisco, CA.

ACME TECHNOLOGIES, INC. /s/ Sarah Jenkins
EMPLOYEE /s/ Alex Morgan`,
  }
];
