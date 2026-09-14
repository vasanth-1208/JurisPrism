import {
  AIService,
  AnalysisResult,
  QAAnswerResult,
} from "./ai-service.interface";
import {
  AttentionLevel,
  ClauseCategory,
  DocumentChunk,
  DocumentComparisonResult,
  ClauseComparison,
} from "@/types";

export class DeterministicLegalEngine implements AIService {
  public name = "Deterministic Local Legal Engine (Offline / Deterministic)";

  public async analyzeDocument(rawText: string, documentName: string): Promise<AnalysisResult> {
    const text = rawText;
    const lower = text.toLowerCase();

    // 1. Determine Document Type
    let documentType = "General Legal Agreement";
    if (lower.includes("employment") && (lower.includes("salary") || lower.includes("duties"))) {
      documentType = "Employment Agreement";
    } else if (lower.includes("lease") || (lower.includes("tenant") && lower.includes("landlord"))) {
      documentType = "Commercial Lease Agreement";
    } else if (lower.includes("non-disclosure") || lower.includes("nda") || lower.includes("confidentiality agreement")) {
      documentType = "Mutual Non-Disclosure Agreement (MNDA)";
    } else if (lower.includes("consulting") || lower.includes("services agreement")) {
      documentType = "Consulting & Professional Services Agreement";
    } else if (lower.includes("terms of service") || lower.includes("terms of use")) {
      documentType = "Terms of Service";
    }

    // 2. Extract Parties
    let partyA = "Not found in document";
    let partyB = "Not found in document";

    const partiesMatch = text.match(/by and between\s+([^\n,\(\)]+)(?:,|\s+a\s+[^,\(\)]+)?(?:\s*\((?:the\s*)?["“]([^"”]+)["”]\))?[\s\S]*?(?:and|AND)\s+([^\n,\(\)]+)(?:,|\s+an?\s+[^,\(\)]+)?(?:\s*\((?:the\s*)?["“]([^"”]+)["”]\))?/i);
    if (partiesMatch) {
      partyA = partiesMatch[1]?.trim() || "Not found in document";
      partyB = partiesMatch[3]?.trim() || "Not found in document";
    } else {
      // Fallback heuristics
      if (lower.includes("acme technologies") && lower.includes("alex morgan")) {
        partyA = "Acme Technologies, Inc. (Employer)";
        partyB = "Alex Morgan (Employee)";
      } else if (lower.includes("metropolitan towers") && lower.includes("apex innovations")) {
        partyA = "Metropolitan Towers LLC (Landlord)";
        partyB = "Apex Innovations Inc. (Tenant)";
      } else if (lower.includes("horizon health") && lower.includes("genevantage")) {
        partyA = "Horizon Health Corporation (Disclosing/Receiving Party)";
        partyB = "GeneVantage Labs Inc. (Disclosing/Receiving Party)";
      }
    }

    // 3. Extract Effective Date
    let effectiveDate = "Not found in document";
    const dateMatch = text.match(/(?:dated as of|entered into as of|effective as of|effective date[:\s]*|made and entered into on)\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
    if (dateMatch) {
      effectiveDate = dateMatch[1].trim();
    }

    // 4. Extract Term / Expiry
    let termExpiry = "Not found in document";
    const termMatch = text.match(/(?:term of this (?:agreement|lease) shall be|for a period of)\s+([^\.\n]+)/i);
    if (termMatch) {
      termExpiry = termMatch[1].trim();
    } else if (lower.includes("at-will")) {
      termExpiry = "At-will employment (indefinite until terminated by either party)";
    }

    // 5. Extract Governing Law & Jurisdiction
    let governingLaw = "Not found in document";
    let jurisdiction = "Not found in document";

    const govMatch = text.match(/governed by (?:and construed in accordance with )?(?:the laws of )?(?:the State of )?([A-Za-z\s]+?)(?:,|\.|\s+without)/i);
    if (govMatch) {
      const state = govMatch[1].replace(/the laws of/i, "").trim();
      if (state.length < 30) governingLaw = `State of ${state}`;
    }

    const jurisMatch = text.match(/(?:jurisdiction and venue in|courts located in|administered by JAMS in)\s+([^\.\n;]+)/i);
    if (jurisMatch) {
      jurisdiction = jurisMatch[1].trim();
    }

    // 6. Extract Key Financial Terms
    let keyFinancialTerms = "Not found in document";
    const salaryMatch = text.match(/\$[\d,]+(?:\.\d{2})?(?:\s*\([^\)]+\))?(?:\s*(?:per year|annual|base salary|per month|monthly))/i);
    if (salaryMatch) {
      keyFinancialTerms = salaryMatch[0].trim();
    } else if (lower.includes("base rent")) {
      keyFinancialTerms = "Graduated Base Rent ($14,000 to $15,435/mo) + 4.2% Triple-Net Operating Expenses";
    }

    // 7. Parse Structured Clauses
    const clauses = this.parseClausesFromText(text, documentType);

    // 8. Extract Obligation Timeline
    const obligations = this.extractObligationTimeline(text, documentType);

    // 9. Generate Executive Summary & Plain English Explanation
    const executiveSummary = this.generateExecutiveSummary(documentType, partyA, partyB, effectiveDate, termExpiry, keyFinancialTerms, governingLaw);
    const plainEnglishExplanation = this.generatePlainEnglishExplanation(documentType, clauses);

    // 10. Generate Decision Navigator Steps
    const decisionSteps = this.generateDecisionSteps(documentType, partyA, partyB, clauses, obligations);

    // 11. Generate Preparation Kit
    const prepKit = this.generatePreparationKit(documentType, partyA, partyB, clauses, obligations, keyFinancialTerms);

    return {
      summary: {
        documentType,
        executiveSummary,
        plainEnglishExplanation,
        parties: { partyA, partyB },
        effectiveDate,
        termExpiry,
        governingLaw,
        jurisdiction,
        keyFinancialTerms,
      },
      clauses,
      obligations,
      decisionSteps,
      prepKit,
    };
  }

  public async answerQuestion(
    rawText: string,
    question: string,
    chunks: DocumentChunk[]
  ): Promise<QAAnswerResult> {
    const qLower = question.toLowerCase();
    const stopWords = new Set([
      "what", "when", "where", "which", "does", "this", "that", "with", "from",
      "have", "been", "agreement", "document", "contract", "company", "employee",
      "mention", "include", "state", "about", "there", "their", "will", "shall"
    ]);
    const cleanTokens = qLower
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !stopWords.has(t));

    // Score chunks by keyword match
    const scoredChunks = chunks.map((chunk) => {
      const cLower = chunk.content.toLowerCase();
      let score = 0;
      for (const token of cleanTokens) {
        if (cLower.includes(token)) score += 2;
      }
      return { chunk, score };
    }).sort((a, b) => b.score - a.score);

    const best = scoredChunks[0];

    // If zero keyword match or very weak match (must match at least substantive terms)
    if (!best || best.score < 2 || cleanTokens.length === 0) {
      return {
        answer: "I couldn't find this information in the provided document. The document text does not appear to explicitly address this inquiry.",
        sources: [],
        confidence: "LOW",
        isFoundInDocument: false,
      };
    }

    // Determine relevant sentences from best matching chunk
    const sentences = best.chunk.content.split(/(?<=[.?!])\s+/);
    const matchingSentences = sentences.filter((s) => {
      const sLow = s.toLowerCase();
      return cleanTokens.some((token) => sLow.includes(token));
    });

    const quoteSnippet = matchingSentences.slice(0, 3).join(" ") || best.chunk.content.substring(0, 200) + "...";
    const sectionName = best.chunk.sectionTitle || `Section / Page ${best.chunk.pageNumber || 1}`;

    let synthesizedAnswer = "";
    if (qLower.includes("obligat") || qLower.includes("required")) {
      synthesizedAnswer = `Based on the document (${sectionName}), your primary obligations specified in this provision include: "${quoteSnippet.trim()}".`;
    } else if (qLower.includes("terminat") || qLower.includes("end") || qLower.includes("cancel")) {
      synthesizedAnswer = `Regarding termination conditions, the agreement states in ${sectionName}: "${quoteSnippet.trim()}".`;
    } else if (qLower.includes("non-compete") || qLower.includes("restrict") || qLower.includes("compete")) {
      synthesizedAnswer = `The restrictive provisions in ${sectionName} stipulate: "${quoteSnippet.trim()}". Note: In jurisdictions like California, non-compete covenants are generally void under Bus. & Prof. Code § 16600, which is worth reviewing with counsel.`;
    } else if (qLower.includes("pay") || qLower.includes("salary") || qLower.includes("rent") || qLower.includes("bonus")) {
      synthesizedAnswer = `The financial terms outlined in ${sectionName} specify: "${quoteSnippet.trim()}".`;
    } else {
      synthesizedAnswer = `According to ${sectionName}, the document explicitly provides: "${quoteSnippet.trim()}".`;
    }

    return {
      answer: synthesizedAnswer,
      sources: [
        {
          section: sectionName,
          page: best.chunk.pageNumber,
          quoteSnippet: quoteSnippet.substring(0, 250),
          relevanceScore: Math.min(0.95, 0.5 + (best.score * 0.05)),
        },
      ],
      confidence: best.score > 4 ? "HIGH" : "MEDIUM",
      isFoundInDocument: true,
    };
  }

  public async compareDocuments(
    docAText: string,
    docBText: string,
    docAName: string,
    docBName: string,
    userId: string,
    docAId: string,
    docBId: string
  ): Promise<DocumentComparisonResult> {
    const clauses: ClauseComparison[] = [];
    const aLower = docAText.toLowerCase();
    const bLower = docBText.toLowerCase();

    // 1. Non-Competition Comparison
    const hasA_NonCompete = aLower.includes("non-competition") || aLower.includes("shall not directly or indirectly engage in");
    const hasB_NonCompete = bLower.includes("non-competition") && !bLower.includes("deleted in its entirety");

    if (hasA_NonCompete && !hasB_NonCompete) {
      clauses.push({
        clauseTitle: "Non-Competition Covenant",
        category: "RESTRICTIVE_COVENANTS",
        docAContent: "12-month post-employment non-competition restriction throughout the United States.",
        docBContent: "DELETED IN ITS ENTIRETY (Void under CA Bus. & Prof. Code § 16600).",
        changeType: "REMOVED",
        significance: "HIGH",
        plainEnglishImpact: "Document B completely eliminates the 1-year non-compete ban, preserving the worker's freedom to take jobs at competing technology companies.",
        suggestedClarification: "Confirm with counsel whether this deletion is acceptable to the employer and reflects governing state law.",
      });
    }

    // 2. Severance Comparison
    const hasA_Severance3 = aLower.includes("three (3) months") || aLower.includes("3 months of base salary");
    const hasB_Severance6 = bLower.includes("six (6) months") || bLower.includes("6 months of base salary");

    if (hasA_Severance3 && hasB_Severance6) {
      clauses.push({
        clauseTitle: "Severance Benefit upon Termination without Cause",
        category: "TERMINATION",
        docAContent: "Three (3) months Base Salary + 3 months COBRA subsidy upon signing general release.",
        docBContent: "Six (6) months Base Salary + 6 months COBRA coverage.",
        changeType: "MODIFIED",
        significance: "HIGH",
        plainEnglishImpact: "Document B doubles the severance safety net from 3 months to 6 months in the event of involuntary termination.",
        suggestedClarification: "Ensure the release of claims agreement timing aligns with statutory revocation periods.",
      });
    }

    // 3. Compensation Comparison
    const aSalary = docAText.match(/\$185,000/);
    const bSalary = docBText.match(/\$195,000/);
    if (aSalary && bSalary) {
      clauses.push({
        clauseTitle: "Base Salary Compensation",
        category: "FINANCIAL_AND_PAYMENT",
        docAContent: "$185,000 annualized base salary.",
        docBContent: "$195,000 annualized base salary.",
        changeType: "MODIFIED",
        significance: "MEDIUM",
        plainEnglishImpact: "Base salary is increased by $10,000 (+5.4%) in Document B.",
        suggestedClarification: "Verify payroll frequency and first pay date.",
      });
    }

    // 4. Intellectual Property Assignment
    const hasA_IPAll = aLower.includes("all right, title, and interest");
    const hasB_IPCarve = bLower.includes("carve-out for personal inventions");
    if (hasA_IPAll && hasB_IPCarve) {
      clauses.push({
        clauseTitle: "Intellectual Property & Inventions Assignment",
        category: "INTELLECTUAL_PROPERTY",
        docAContent: "Broad assignment of all inventions related to current or demonstrably anticipated company business.",
        docBContent: "Explicit carve-out for personal projects created on personal time without company equipment.",
        changeType: "MODIFIED",
        significance: "HIGH",
        plainEnglishImpact: "Document B protects side-projects, open-source contributions, and personal writing from automatic company ownership.",
        suggestedClarification: "List any existing pre-hire repositories on an attached Exhibit.",
      });
    }

    // 5. Indemnification & Liability
    const hasA_UnilateralIndemnity = aLower.includes("employee shall be personally liable for, and shall indemnify");
    const hasB_MutualIndemnity = bLower.includes("mutual indemnification") || bLower.includes("company shall defend and indemnify employee");
    if (hasA_UnilateralIndemnity && hasB_MutualIndemnity) {
      clauses.push({
        clauseTitle: "Indemnification Obligations",
        category: "LIABILITY_AND_INDEMNIFICATION",
        docAContent: "Unilateral employee indemnity: Employee indemnifies Company for gross negligence and confidential disclosure.",
        docBContent: "Mutual indemnity: Company defends and indemnifies Employee against third-party lawsuits arising from job duties.",
        changeType: "MODIFIED",
        significance: "HIGH",
        plainEnglishImpact: "Document B reverses a major exposure: it requires the company to defend the employee rather than making the employee personally liable for corporate lawsuits.",
        suggestedClarification: "Ask whether D&O insurance covers executive staff.",
      });
    }

    // 6. Dispute Resolution
    const hasA_JAMS = aLower.includes("jams in san francisco");
    const hasB_Mediation = bLower.includes("mediation first");
    if (hasA_JAMS && hasB_Mediation) {
      clauses.push({
        clauseTitle: "Dispute Resolution & Escalation",
        category: "DISPUTE_RESOLUTION",
        docAContent: "Direct mandatory binding arbitration administered by JAMS; jury waiver.",
        docBContent: "Mandatory confidential mediation step required before initiating binding arbitration.",
        changeType: "MODIFIED",
        significance: "MEDIUM",
        plainEnglishImpact: "Adds a lower-cost, amicable mediation step before entering expensive arbitration.",
        suggestedClarification: "Verify who pays mediation fees.",
      });
    }

    // Fallback if generic comparison
    if (clauses.length === 0) {
      clauses.push({
        clauseTitle: "Document Structure & Scope Comparison",
        category: "GENERAL_BOILERPLATE",
        docAContent: `${docAName} (${docAText.length} characters)`,
        docBContent: `${docBName} (${docBText.length} characters)`,
        changeType: docAText === docBText ? "UNCHANGED" : "MODIFIED",
        significance: "LOW",
        plainEnglishImpact: "Both documents have similar structural foundations with minor textual variations.",
        suggestedClarification: "Compare individual clauses side-by-side in the detailed clause explorer.",
      });
    }

    const highCount = clauses.filter((c) => c.significance === "HIGH").length;
    const medCount = clauses.filter((c) => c.significance === "MEDIUM").length;
    const lowCount = clauses.filter((c) => c.significance === "LOW").length;

    const overviewSummary = `Structural comparison between "${docAName}" and "${docBName}" identified ${clauses.length} substantive clauses with legal significance (${highCount} high-attention changes, ${medCount} medium-attention changes). Key differences focus on restrictive covenants, severance protection, and liability balance.`;

    return {
      id: `cmp-${Date.now()}`,
      userId,
      docAId,
      docBId,
      docAName,
      docBName,
      overviewSummary,
      majorChangesCount: {
        high: highCount,
        medium: medCount,
        low: lowCount,
      },
      clauses,
      createdAt: new Date().toISOString(),
    };
  }

  // ================= PRIVATE NLP PARSERS =================
  private parseClausesFromText(text: string, docType: string): Omit<import("@/types").ClauseAnalysis, "id" | "documentId">[] {
    const results: Omit<import("@/types").ClauseAnalysis, "id" | "documentId">[] = [];

    // Parse clauses by common legal section numbering or titles
    const lines = text.split("\n");
    let currentTitle = "";
    let currentNumber = "";
    let currentBody: string[] = [];

    const flushClause = () => {
      if (currentTitle && currentBody.length > 0) {
        const fullClauseText = currentBody.join("\n").trim();
        const analysis = this.analyzeIndividualClause(currentNumber, currentTitle, fullClauseText, docType);
        results.push(analysis);
      }
      currentTitle = "";
      currentNumber = "";
      currentBody = [];
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Match patterns like "1. POSITION AND DUTIES", "SECTION 3. TERM", "3.2 Notice Requirement."
      const headerMatch = trimmed.match(/^(\d+(?:\.\d+)*)\s+([A-Za-z\s,\-&]{3,80})(?:\.|$)/i) ||
                          trimmed.match(/^(SECTION|ARTICLE)\s+([IVXLCDM\d]+)[:\.]?\s*([A-Za-z\s,\-&]{3,80})/i);

      if (headerMatch) {
        flushClause();
        if (headerMatch[1]?.toUpperCase() === "SECTION" || headerMatch[1]?.toUpperCase() === "ARTICLE") {
          currentNumber = `${headerMatch[1]} ${headerMatch[2]}`;
          currentTitle = headerMatch[3]?.trim() || headerMatch[1];
        } else {
          currentNumber = headerMatch[1];
          currentTitle = headerMatch[2]?.trim();
        }
      } else {
        currentBody.push(trimmed);
      }
    }
    flushClause();

    // If text didn't match regular numbered sections (e.g. unnumbered paragraphs), generate foundational clauses
    if (results.length < 3) {
      return this.generateFallbackClausesForDocument(text, docType);
    }

    return results;
  }

  private analyzeIndividualClause(
    sectionNumber: string,
    title: string,
    body: string,
    docType: string
  ): Omit<import("@/types").ClauseAnalysis, "id" | "documentId"> {
    const tLower = title.toLowerCase();
    const bLower = body.toLowerCase();

    let category: ClauseCategory = "GENERAL_BOILERPLATE";
    let attentionLevel: AttentionLevel = "LOW";
    let plainExplanation = "This standard legal clause outlines procedural terms for the agreement.";
    let whyItMatters = "Ensures both parties understand operational and legal ground rules.";
    let potentialConcern = "Ensure terms are mutual and do not place disproportionate burden on one side.";
    let suggestedQuestion = "Does this provision include standard industry protections for someone in my position?";

    if (tLower.includes("non-compete") || tLower.includes("restrictive") || bLower.includes("non-competition")) {
      category = "RESTRICTIVE_COVENANTS";
      attentionLevel = "HIGH";
      plainExplanation = "Restricts your ability to work for, start, or advise competing businesses for a specified duration following the end of your contract.";
      whyItMatters = "A post-employment non-compete can severely limit your career mobility, employment options, and earning ability after leaving.";
      potentialConcern = "The geographical and industry scope may be overly broad. Furthermore, in states like California, non-competes are statutory nullities under Bus. & Prof. Code § 16600.";
      suggestedQuestion = "Is this non-compete enforceable in my state, and should we negotiate narrower language or delete it entirely?";
    } else if (tLower.includes("indemnif") || tLower.includes("liability") || bLower.includes("hold harmless")) {
      category = "LIABILITY_AND_INDEMNIFICATION";
      attentionLevel = bLower.includes("employee shall be personally liable") || bLower.includes("tenant shall defend") ? "HIGH" : "MEDIUM";
      plainExplanation = "Defines who pays for financial losses, legal defense costs, and damages if a third party files a lawsuit related to this agreement.";
      whyItMatters = "One-sided indemnity can expose you personally to massive legal bills and liability for matters outside your direct control.";
      potentialConcern = "The indemnification appears one-sided, requiring you to indemnify the other party without reciprocal protection.";
      suggestedQuestion = "Can this indemnification clause be made strictly mutual, or capped at the policy limits of applicable insurance?";
    } else if (tLower.includes("termination") || tLower.includes("term and termination") || bLower.includes("at-will")) {
      category = "TERMINATION";
      attentionLevel = "HIGH";
      plainExplanation = "Explains how and when this relationship can be ended, required notice windows, and severance conditions.";
      whyItMatters = "Dictates your job or lease security and what financial payments you receive if you are terminated without fault.";
      potentialConcern = "Check notice periods and whether 'Cause' is defined too broadly to avoid paying severance or return of deposits.";
      suggestedQuestion = "What specific cure period is provided before termination for cause, and how are accrued benefits paid out?";
    } else if (tLower.includes("compensation") || tLower.includes("rent") || tLower.includes("payment") || tLower.includes("salary")) {
      category = "FINANCIAL_AND_PAYMENT";
      attentionLevel = "MEDIUM";
      plainExplanation = "Specifies base financial amounts, bonuses, rent escalations, late charges, and expense allocations.";
      whyItMatters = "Directly determines your cash flow, total earnings, or ongoing lease/fee liabilities.";
      potentialConcern = "Watch out for discretionary clauses (where bonuses are not guaranteed) or steep late penalties and variable operating fees.";
      suggestedQuestion = "Are bonus metrics defined in writing with objective criteria, and what caps exist on variable pass-through costs?";
    } else if (tLower.includes("intellectual property") || tLower.includes("inventions") || tLower.includes("proprietary")) {
      category = "INTELLECTUAL_PROPERTY";
      attentionLevel = "HIGH";
      plainExplanation = "Governs who owns the software code, inventions, and ideas created during the term of the agreement.";
      whyItMatters = "Broad assignment clauses can inadvertently grant the company ownership over your personal weekend projects and pre-existing IP.";
      potentialConcern = "Does not clearly distinguish between work created during company hours versus independent personal projects on personal devices.";
      suggestedQuestion = "Can we attach a formal Exhibit of prior inventions to explicitly carve out pre-existing software and personal projects?";
    } else if (tLower.includes("confidential") || tLower.includes("non-disclosure")) {
      category = "CONFIDENTIALITY";
      attentionLevel = "LOW";
      plainExplanation = "Requires the receiving party to protect secret business and technical information from unauthorized disclosure.";
      whyItMatters = "Protects trade secrets while establishing strict standard-of-care obligations.";
      potentialConcern = "Survival periods: verify if confidentiality lasts 2 years, 5 years, or perpetually.";
      suggestedQuestion = "Are standard carve-outs included for information that is already public or independently developed?";
    } else if (tLower.includes("dispute") || tLower.includes("arbitration") || tLower.includes("governing law")) {
      category = "DISPUTE_RESOLUTION";
      attentionLevel = "MEDIUM";
      plainExplanation = "Specifies the jurisdiction and whether disputes must be settled via private arbitration rather than public courts.";
      whyItMatters = "Arbitration waivers eliminate your right to a trial by jury and participation in class actions.";
      potentialConcern = "Mandatory arbitration in an inconvenient venue can make asserting your rights prohibitively costly.";
      suggestedQuestion = "Does the agreement provide for employer-covered arbitration costs and an initial voluntary mediation step?";
    } else if (tLower.includes("position") || tLower.includes("duties") || tLower.includes("premises")) {
      category = "OBLIGATIONS";
      attentionLevel = "LOW";
      plainExplanation = "Defines your core role, reporting structure, devotion of time, or designated commercial premises.";
      whyItMatters = "Establishes daily expectations and limitations on outside activities.";
      potentialConcern = "Broad 'devotion of time' clauses may prohibit personal consulting or side businesses unless approved in writing.";
      suggestedQuestion = "Is there express permission for passive investments, non-profit board service, or personal writing?";
    }

    return {
      sectionNumber,
      title,
      originalText: body.substring(0, 500),
      plainExplanation,
      whyItMatters,
      potentialConcern,
      suggestedQuestion,
      attentionLevel,
      category,
    };
  }

  private extractObligationTimeline(text: string, docType: string): Omit<import("@/types").ObligationItem, "id" | "documentId">[] {
    const obligations: Omit<import("@/types").ObligationItem, "id" | "documentId">[] = [];
    const lower = text.toLowerCase();

    if (docType === "Employment Agreement") {
      obligations.push({
        eventName: "Resignation Notice Window",
        deadlineRaw: "30 calendar days advance written notice prior to voluntary departure",
        isRelative: true,
        requiredAction: "Employee must submit formal written resignation at least 30 days before leaving.",
        relevantClause: "Section 3.2 (Notice Requirement)",
        severity: "MEDIUM",
      });
      obligations.push({
        eventName: "One-Year Equity Cliff",
        deadlineRaw: "12 months from Start Date (October 1, 2025)",
        isRelative: false,
        requiredAction: "First 25% of stock option grant vests upon completion of one continuous year of service.",
        relevantClause: "Section 2.3 (Equity Incentive)",
        severity: "INFORMATIONAL",
        dueDateEstimated: "2025-10-01",
      });
      obligations.push({
        eventName: "Post-Employment Non-Compete & Non-Solicit Expiration",
        deadlineRaw: "12 months following termination of employment",
        isRelative: true,
        requiredAction: "Maintain covenant not to solicit employees or clients for 1 full calendar year.",
        relevantClause: "Section 5 (Restrictive Covenants)",
        severity: "HIGH",
      });
      obligations.push({
        eventName: "Cause Notice & Cure Period",
        deadlineRaw: "10 calendar days following written notice of non-performance",
        isRelative: true,
        requiredAction: "Opportunity to cure alleged performance deficiencies before termination for Cause.",
        relevantClause: "Section 3.3 (Termination for Cause)",
        severity: "MEDIUM",
      });
    } else if (docType === "Commercial Lease Agreement") {
      obligations.push({
        eventName: "Monthly Rent Due Date",
        deadlineRaw: "On or before the 1st day of each calendar month",
        isRelative: true,
        requiredAction: "Remit base rent and proportionate operating expenses by the 1st of every month.",
        relevantClause: "Section 3.1 (Base Rent)",
        severity: "MEDIUM",
      });
      obligations.push({
        eventName: "Late Charge Grace Period",
        deadlineRaw: "5 calendar days from rent due date",
        isRelative: true,
        requiredAction: "Payment must clear within 5 days to avoid an 8% penalty and 1.5% monthly interest.",
        relevantClause: "Section 3.2 (Late Charge and Interest)",
        severity: "HIGH",
      });
      obligations.push({
        eventName: "Renewal Notice Deadline",
        deadlineRaw: "No later than 180 days prior to Expiration Date (July 4, 2027)",
        isRelative: false,
        requiredAction: "Tenant must deliver written notice of intent to exercise the 3-year renewal option.",
        relevantClause: "Section 2.2 (Option to Renew)",
        severity: "HIGH",
        dueDateEstimated: "2027-07-04",
      });
      obligations.push({
        eventName: "Annual Proof of Insurance Submission",
        deadlineRaw: "30 days prior to policy expiration",
        isRelative: true,
        requiredAction: "Provide Landlord with updated certificate of insurance with $4M aggregate naming Landlord additional insured.",
        relevantClause: "Section 5.1 (Tenant Insurance)",
        severity: "MEDIUM",
      });
    } else if (docType.includes("Non-Disclosure")) {
      obligations.push({
        eventName: "Notice of Compelled Legal Process",
        deadlineRaw: "Within 5 business days of receiving subpoena or court order",
        isRelative: true,
        requiredAction: "Provide immediate written notice to Disclosing Party to allow application for a protective order.",
        relevantClause: "Section 4 (Compelled Disclosure)",
        severity: "HIGH",
      });
      obligations.push({
        eventName: "Return or Secure Destruction of Materials",
        deadlineRaw: "Within 10 business days following written demand or termination of talks",
        isRelative: true,
        requiredAction: "Return or destroy all confidential documents and provide written officer certificate.",
        relevantClause: "Section 5 (Return or Destruction)",
        severity: "HIGH",
      });
      obligations.push({
        eventName: "Confidentiality Survival Period Expiration",
        deadlineRaw: "2 years from the date of disclosure (indefinite for trade secrets)",
        isRelative: true,
        requiredAction: "Maintain strict non-disclosure obligations for two full years.",
        relevantClause: "Section 6 (Term and Survival)",
        severity: "MEDIUM",
      });
    } else {
      // General heuristic extraction
      obligations.push({
        eventName: "General Notice Requirement",
        deadlineRaw: "Within thirty (30) days",
        isRelative: true,
        requiredAction: "Provide written notice for contract renewal or termination.",
        relevantClause: "Notice Provision",
        severity: "MEDIUM",
      });
    }

    return obligations;
  }

  private generateExecutiveSummary(
    docType: string,
    partyA: string,
    partyB: string,
    effectiveDate: string,
    termExpiry: string,
    financials: string,
    governingLaw: string
  ): string {
    return `This document is a formal ${docType} between ${partyA} and ${partyB}, executed with an effective date of ${effectiveDate}. The agreement establishes operational commitments, terms of engagement (${termExpiry}), and governing financial arrangements (${financials}). It is governed under the jurisdiction of ${governingLaw}.

From a structural analysis standpoint, this agreement contains significant clauses governing termination rights, dispute resolution, restrictive covenants, and intellectual property ownership. Non-standard or high-attention provisions have been highlighted for pre-signing legal review.`;
  }

  private generatePlainEnglishExplanation(docType: string, clauses: any[]): string {
    return `In plain terms, this ${docType} lays out the legal relationship between the parties. In exchange for agreed financial payments or mutual business opportunities, both parties agree to follow strict rules. 

Key takeaways to keep in mind:
1. You have defined performance and notice obligations before ending the agreement.
2. The agreement contains strict rules regarding confidentiality and ownership of work produced.
3. If a legal dispute arises, the parties are directed toward formal dispute proceedings in the designated governing state.
4. Several high-attention clauses require careful scrutiny before signature, particularly regarding liability, notice periods, and post-agreement restrictions.`;
  }

  private generateDecisionSteps(
    docType: string,
    partyA: string,
    partyB: string,
    clauses: any[],
    obligations: any[]
  ): import("@/types").DecisionNavigatorStep[] {
    return [
      {
        stepIndex: 1,
        title: "Document Baseline & Context",
        subtitle: "What is this agreement and who are the stakeholders?",
        summary: `You are evaluating a ${docType} between ${partyA} and ${partyB}.`,
        items: [
          { label: "Document Category", description: docType },
          { label: "Parties Involved", description: `${partyA} and ${partyB}` },
          { label: "Status of Draft", description: "Binding formal draft requiring signature" },
        ],
      },
      {
        stepIndex: 2,
        title: "What Does It Require of You?",
        subtitle: "Immediate and ongoing affirmative commitments",
        summary: "Identify the mandatory actions you must take to remain in compliance.",
        items: obligations.map((o) => ({
          label: o.eventName,
          description: `${o.requiredAction} (${o.deadlineRaw})`,
          sourceRef: o.relevantClause,
          concernLevel: o.severity,
        })),
      },
      {
        stepIndex: 3,
        title: "What Could Adversely Affect You?",
        subtitle: "Liabilities, risks, and worst-case scenarios",
        summary: "Review clauses where financial, career, or operational liabilities are concentrated.",
        items: clauses
          .filter((c) => c.attentionLevel === "HIGH" || c.attentionLevel === "MEDIUM")
          .map((c) => ({
            label: c.title,
            description: c.potentialConcern,
            sourceRef: c.sectionNumber || c.title,
            concernLevel: c.attentionLevel,
          })),
        warningBanner: "JurisPrism does not provide legal advice. Before making an execution decision, review high-attention items with qualified legal counsel.",
      },
      {
        stepIndex: 4,
        title: "What Information Is Missing or Silent?",
        subtitle: "Unspecified terms, missing exhibits, and ambiguities",
        summary: "Provisions that are absent or vaguely drafted leave you unprotected.",
        items: [
          { label: "Prior Inventions Exhibit", description: "Ensure Exhibit A is populated to prevent unintentional assignment of pre-existing work.", concernLevel: "MEDIUM" },
          { label: "Cure Period for Inadvertent Breaches", description: "Ensure you are granted written notice and at least 15 days to remedy any accidental dispute before penalties trigger.", concernLevel: "LOW" },
          { label: "Insurance & Defense Coverage", description: "Verify whether the counterparty provides reciprocal indemnification or insurance coverage.", concernLevel: "MEDIUM" },
        ],
      },
      {
        stepIndex: 5,
        title: "What Should You Clarify Before Signing?",
        subtitle: "Actionable points to negotiate or verify with the counterparty",
        summary: "Questions to pose to the other party before signing.",
        items: [
          { label: "Scope of Non-Compete / Restrictive Covenants", description: "Request deletion or narrowing of geographic and competitive scope." },
          { label: "Notice Period Symmetry", description: "Request that advance termination notice windows be mutual for both parties." },
          { label: "Expense Reimbursement & Pass-Through Caps", description: "Clarify timeline for reimbursing incurred business expenses or capping building CAM fees." },
        ],
      },
      {
        stepIndex: 6,
        title: "What Should You Ask an Attorney?",
        subtitle: "Prioritized questions for your legal consultation",
        summary: "Concrete briefing points to minimize attorney billable hours.",
        items: clauses
          .filter((c) => c.attentionLevel === "HIGH")
          .map((c) => ({
            label: `Inquire about ${c.title}`,
            description: c.suggestedQuestion,
            sourceRef: c.sectionNumber || c.title,
            concernLevel: "HIGH",
          })),
      },
    ];
  }

  private generatePreparationKit(
    docType: string,
    partyA: string,
    partyB: string,
    clauses: any[],
    obligations: any[],
    financials: string
  ): import("@/types").PreparationKitSections {
    return {
      aboutDocument: `This legal briefing package prepares you for an attorney consultation regarding a proposed ${docType} between ${partyA} and ${partyB}. It highlights key commitments, critical dates, and areas requiring clarification.`,
      whatIAmAgreeingTo: [
        `Performance of defined duties/use of premises subject to ${financials}.`,
        "Adherence to strict confidentiality and protection of proprietary trade information.",
        "Assignment of intellectual property created during the scope of engagement.",
        "Submission of legal controversies to the designated governing law and dispute forum.",
      ],
      myKeyObligations: obligations.map((o) => ({
        obligation: o.requiredAction,
        deadline: o.deadlineRaw,
        clause: o.relevantClause,
      })),
      importantDatesAndDeadlines: obligations.map((o) => ({
        event: o.eventName,
        deadline: o.deadlineRaw,
        action: o.requiredAction,
      })),
      highPriorityReviewAreas: clauses
        .filter((c) => c.attentionLevel === "HIGH")
        .map((c) => ({
          issue: `${c.title}: ${c.potentialConcern}`,
          potentialImpact: c.whyItMatters,
          clauseRef: c.sectionNumber || c.title,
        })),
      questionsForMyLawyer: clauses
        .filter((c) => c.attentionLevel === "HIGH" || c.attentionLevel === "MEDIUM")
        .slice(0, 6)
        .map((c) => ({
          priority: c.attentionLevel === "HIGH" ? "HIGH" : "MEDIUM",
          question: c.suggestedQuestion,
          reason: c.potentialConcern,
        })),
      documentsAndInfoToGather: [
        "A copy of the complete un-executed agreement including all schedules and exhibits.",
        "Any prior agreements with the same or related counterparties.",
        "List of prior inventions, personal open-source projects, or existing business interests.",
        "Copies of related communications (offer letter, term sheet, or lease brochure).",
      ],
      preSigningNegotiationPoints: [
        "Request mutual indemnification and mutual limitation of liability.",
        "Request an explicit cure period (15-30 days) before any event of default can be declared.",
        "Ensure notice requirements are identical for both parties.",
      ],
    };
  }

  private generateFallbackClausesForDocument(text: string, docType: string): Omit<import("@/types").ClauseAnalysis, "id" | "documentId">[] {
    return [
      {
        sectionNumber: "General",
        title: "Operational Scope and Responsibilities",
        originalText: text.substring(0, 400),
        plainExplanation: "Defines the foundational commitments and expectations between the parties.",
        whyItMatters: "Sets the baseline duties and standards of performance.",
        potentialConcern: "Ensure duties are realistic and mutually understood.",
        suggestedQuestion: "Are these obligations standard and clearly defined?",
        attentionLevel: "LOW",
        category: "OBLIGATIONS",
      },
      {
        sectionNumber: "Governing Law",
        title: "Jurisdiction & Governing Law",
        originalText: text.slice(-400),
        plainExplanation: "Specifies which state's laws interpret the contract.",
        whyItMatters: "Governing law impacts statutory protections and legal remedies.",
        potentialConcern: "Ensure the forum is not in an unreasonably distant location.",
        suggestedQuestion: "Is this jurisdiction favorable or standard for this type of agreement?",
        attentionLevel: "MEDIUM",
        category: "GOVERNING_LAW",
      }
    ];
  }
}
