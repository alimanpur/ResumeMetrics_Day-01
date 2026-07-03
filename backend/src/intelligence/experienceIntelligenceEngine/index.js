class ExperienceIntelligenceEngine {
  constructor() {
    this.dimensionKeys = [
      'impact',
      'leadership',
      'ownership',
      'businessValue',
      'technicalComplexity',
      'careerGrowth',
      'roleConsistency',
      'timeline'
    ];
    this.weights = {
      impact: 1.2,
      leadership: 1.0,
      ownership: 1.0,
      businessValue: 1.1,
      technicalComplexity: 0.9,
      careerGrowth: 0.9,
      roleConsistency: 0.8,
      timeline: 0.8
    };
    this.impactPatterns = [
      /\b\d+(?:\.\d+)?%/g,
      /\$\d+(?:,\d{3})*(?:\.\d+)?\b/g,
      /\b\d{1,3}(?:,\d{3})+|\b\d{4,}\b/g,
      /(?:saved|reduced|decreased|cut|shortened|accelerated)\s+(?:\d+\s?)?(?:hours?|minutes?|weeks?|months?|days?|years?)/gi,
      /(?:increased|improved|boosted|grew|raised)\s+(?:\d+(?:\.\d+)?%)?\s*(?:percent|%|\d+)?/gi,
      /\b(?:top|#1|first|leading|best)\b[^.]{0,20}(?:percent|%|company|industry|team)/gi,
      /\b\d+x\s+(?:faster|return|increase|improvement|growth)\b/gi,
      /\b(?:record|personal|all-time)\s+high\b/gi
    ];
    this.leadershipPatterns = [
      /\bled\s+(?:the\s+)?(?:team|group|department|organization|initiative|project|effort)\b/gi,
      /\bmanaged\s+(?:a\s+)?(?:team|group|people|staff|crew|unit|department|members|directs?)\b/gi,
      /\bmentored\b/gi,
      /\bdirected\b/gi,
      /\bheaded\b/gi,
      /\bteam\s+lead\b/gi,
      /\b(?:senior|lead|principal)\s+(?:engineer|developer|architect|designer|scientist|consultant)\b/gi,
      /\bsupervised\b/gi,
      /\bcoordinated\b/gi,
      /\bguided\s+(?:a\s+)?(?:team|group|developers|juniors|interns)\b/gi,
      /\bchaired?\b/gi,
      /\boversaw\b/gi
    ];
    this.ownershipPatterns = [
      /\bowned\b/gi,
      /\bdelivered\b/gi,
      /\bresponsible\s+for\s+end-to-end\b/gi,
      /\bend-to-end\b/gi,
      /\baccountable\s+for\b/gi,
      /\bbuilt\s+from\s+scratch\b/gi,
      /\blaunched?\b/gi,
      /\blead\s+owner\b/gi,
      /\bdrove\b/gi,
      /\bpioneered?\b/gi,
      /\bestablished?\b/gi,
      /\binitiated?\b/gi,
      /\bfull\s+ownership\b/gi,
      /\bdrove\s+(?:the\s+)?(?:development|delivery|strategy|initiative|project)\b/gi,
      /\bsingle-handedly\b/gi,
      /\bpersonally\s+built\b/gi
    ];
    this.businessValuePatterns = [
      /\brevenue\b/gi,
      /\bcost\s+(?:reduction|saving|savings|optimization|cut|cutting)\b/gi,
      /\befficiency\b/gi,
      /\bgrowth\b/gi,
      /\bmarket\s+(?:share|expansion|penetration)\b/gi,
      /\bprofit\b/gi,
      /\bROI\b|\breturn\s+on\s+investment\b/gi,
      /\bcompetitiveness?\b/gi,
      /\bstrategic\b/gi,
      /\btransform(?:ation|ed|ing)\b/gi,
      /\boptimization\b/gi,
      /\bscal(e|ed|ing)\b/gi,
      /\bconvert(?:sion|ed|ing)\b/gi,
      /\bretention\b/gi,
      /\bcustomer\s+(?:satisfaction|lifetime\s+value|NPS|base)\b/gi,
      /\bprofitability\b/gi,
      /\boperational\s+(?:excellence|efficiency)\b/gi,
      /\bbottom\s+line\b/gi
    ];
    this.technicalPatterns = [
      /\b(?:microservices|kubernetes|docker|kafka|redis|elasticsearch|graphql|grpc)\b/gi,
      /\b(?:react|angular|vue|node\.?js|python|java|go|rust|ruby|swift|kotlin|typescript)\b/gi,
      /\b(?:blockchain|AI\s+powered|machine\s+learning|deep\s+learning|NLP|computer\s+vision|artificial\s+intelligence)\b/gi,
      /\b(?:big\s+data|Hadoop|Spark|TensorFlow|PyTorch|data\s+lake|data\s+warehouse|ETL)\b/gi,
      /\b(?:distributed\s+systems|high\s+availability|load\s+balancing|CI\/?CD|DevOps|SRE)\b/gi,
      /\b(?:programming|programmatically|algorithm|data\s+structure|API|SDK|OAuth|REST)\b/gi,
      /\b(?:cloud|AWS|Azure|GCP|serverless)\b/gi
    ];
    this.problemSolvingPatterns = [
      /\bsolved?\b/gi,
      /\bresolved?\b/gi,
      /\bfixed\b/gi,
      /\barchitect(?:ed|ure)?\b/gi,
      /\bdesigned?\b/gi,
      /\boptimized?\b/gi,
      /\brefactored?\b/gi,
      /\bmigrated?\b/gi,
      /\brewrote?\b/gi,
      /\bimproved\s+(?:code|system|process|architecture|performance)\b/gi,
      /\bdebugged\b/gi,
      /\btroubleshot\b/gi,
      /\banalyz(?:ed|ing|e)\b/gi,
      /\breconcil(?:ed|ing|e)\b/gi
    ];
    this.careerGrowthPatterns = [
      /\bpromotion\b|\bpromoted\b/gi,
      /\badvanced\b/gi,
      /\bprogressed?\b/gi,
      /\btransferred\s+to\b/gi,
      /\bmoved\s+to\s+(?:senior|lead|principal|staff|manager|director|head)\b/gi,
      /\bjunior\s+to\s+senior\b/gi,
      /\bfrom\s+(?:intern|junior|entry|associate|trainee)\s+(?:to\s+)?(?:mid|senior|lead|principal)\b/gi,
      /\bcareer\s+progression\b/gi,
      /\b(?:escalated|escalating)\s+(?:responsibilities|scope|impact)\b/gi,
      /\bnew\s+challenges?\b/gi,
      /\b(?:increased|expanding|growing)\s+(?:responsibilities|scope|duties)\b/gi,
      /\bnext\s+(?:step|level|role)\b/gi,
      /\b(?:learned|mastered|acquired)\s+(?:new\s+)?(?:skills?|technologies?)\b/gi
    ];
    this.roleConsistencyPatterns = [
      /\b(?:senior|lead|staff|principal|chief)\s+(?:software\s+)?(?:engineer|developer|scientist|architect|designer|manager|director|analyst|consultant)\b/gi,
      /\b(?:software|systems?|devops)\s+engineer\b/gi,
      /\b(?:frontend|backend|full\s+stack)\s+developer\b/gi,
      /\blead\s+(?:engineer|developer|architect|designer)\b/gi,
      /\b(?:technical|software)\s+(?:lead|mentor|coach)\b/gi,
      /\b(?:project|product|program)\s+manager\b/gi
    ];
    this.datePatterns = [
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b/gi,
      /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b/gi,
      /\b\d{4}\s*[-–—]\s*\d{4}\b/g,
      /\b\d{4}\s*[-–—]\s*(?:present|current)\b/gi,
      /\b(?:since|until|to)\s+\d{4}\b/g
    ];
    this.reasonTemplates = {
      impact: ['Strong quantifiable achievements with detailed metrics', 'Moderate quantifiable achievements present', 'Limited measurable outcomes detected'],
      leadership: ['Leadership experience clearly demonstrated', 'Some leadership indicators present', 'No clear leadership signals detected'],
      ownership: ['Strong ownership and delivery-focused language used', 'Some ownership language detected', 'Limited ownership mindset indicators'],
      businessValue: ['Clear business impact and value creation demonstrated', 'Some business value indicators present', 'Limited connection to business outcomes'],
      technicalComplexity: ['Advanced technical complexity and problem-solving demonstrated', 'Some technical depth and problem-solving evident', 'Limited technical complexity indicators'],
      careerGrowth: ['Clear career progression and growth trajectory shown', 'Some growth and progression indicators present', 'Limited career growth signals detected'],
      roleConsistency: ['Consistent role progression and specialization visible', 'Some role consistency indicated', 'Role progression unclear or inconsistent'],
      timeline: ['Timeline clearly documented with date ranges', 'Partial timeline information found', 'Insufficient timeline data']
    };
  }

  grade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  analyze(normalizedDoc) {
    const section = this.extractExperienceSection(normalizedDoc);
    if (!section) return this.emptyResult();

    const text = this.normalizeText(section.content || section.text || '');
    if (!text) return this.emptyResult();

    const dimensions = this.dimensionKeys.reduce((acc, key) => {
      acc[key] = this[`analyze${this.capitalize(key)}`](text);
      return acc;
    }, {});

    const overallScore = this.computeOverallScore(dimensions);
    const strengths = this.getTopDimensions(dimensions, 3);
    const weaknesses = this.getBottomDimensions(dimensions, 3);
    const gaps = this.detectGaps(text);

    const summary = this.buildSummary(overallScore, dimensions, strengths, weaknesses, gaps);

    return {
      overallScore,
      dimensions,
      strengths,
      weaknesses,
      gaps,
      summary
    };
  }

  extractExperienceSection(doc) {
    if (!doc || !Array.isArray(doc.sections)) return null;
    return doc.sections.find(section => section.type === 'experience') || null;
  }

  normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  emptyResult() {
    const empty = { score: 0, grade: 'F', reason: 'Insufficient evidence', evidence: [], recommendation: '' };
    const dims = {};
    this.dimensionKeys.forEach(key => {
      dims[key] = { ...empty, recommendation: 'Add relevant experience details' };
    });
    return { overallScore: 0, dimensions: dims, strengths: [], weaknesses: ['No experience section found'], gaps: [], summary: 'No experience data available for analysis' };
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  computeOverallScore(dimensions) {
    const total = this.dimensionKeys.reduce((sum, key) => sum + (dimensions[key].score * (this.weights[key] || 1)), 0);
    const maxWeight = this.dimensionKeys.reduce((sum, key) => sum + (this.weights[key] || 1), 0);
    return Math.round(Math.min(Math.max(total / maxWeight, 0), 100));
  }

  getTopDimensions(dimensions, count) {
    return this.dimensionKeys
      .slice()
      .sort((a, b) => dimensions[b].score - dimensions[a].score)
      .slice(0, count);
  }

  getBottomDimensions(dimensions, count) {
    return this.dimensionKeys
      .slice()
      .sort((a, b) => dimensions[a].score - dimensions[b].score)
      .slice(0, count);
  }

  extractEvidence(text, patterns) {
    const evidence = [];
    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        evidence.push(match[0]);
        if (evidence.length >= 8) break;
      }
      if (evidence.length >= 8) break;
    }
    return evidence.slice(0, 8);
  }

  scoreFromMatches(text, patterns, pointsPerMatch, maxScore) {
    let count = 0;
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) count += matches.length;
    }
    return Math.min(count * pointsPerMatch, maxScore);
  }

  analyzeImpact(text) {
    const patterns = this.impactPatterns;
    const evidence = this.extractEvidence(text, patterns);
    const score = Math.min(
      this.scoreFromMatches(text, [patterns[0]], 8, 25) +
      this.scoreFromMatches(text, [patterns[1]], 10, 25) +
      this.scoreFromMatches(text, [patterns[2]], 2, 15) +
      this.scoreFromMatches(text, [patterns[3]], 7, 15) +
      this.scoreFromMatches(text, [patterns[4]], 6, 10) +
      this.scoreFromMatches(text, [patterns[5]], 5, 5) +
      this.scoreFromMatches(text, [patterns[6]], 3, 3) +
      this.scoreFromMatches(text, [patterns[7]], 2, 2),
      100
    );

    const reason = this.getReason(score, 'impact');
    const recommendation = this.getRecommendation(score, 'impact');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeLeadership(text) {
    const patterns = this.leadershipPatterns;
    const score = Math.min(this.scoreFromMatches(text, patterns, 5, 100), 100);
    const evidence = this.extractEvidence(text, patterns);
    const reason = this.getReason(score, 'leadership');
    const recommendation = this.getRecommendation(score, 'leadership');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeOwnership(text) {
    const patterns = this.ownershipPatterns;
    const score = Math.min(this.scoreFromMatches(text, patterns, 5, 100), 100);
    const evidence = this.extractEvidence(text, patterns);
    const reason = this.getReason(score, 'ownership');
    const recommendation = this.getRecommendation(score, 'ownership');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeBusinessValue(text) {
    const patterns = this.businessValuePatterns;
    const score = Math.min(this.scoreFromMatches(text, patterns, 5, 100), 100);
    const evidence = this.extractEvidence(text, patterns);
    const reason = this.getReason(score, 'businessValue');
    const recommendation = this.getRecommendation(score, 'businessValue');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeTechnicalComplexity(text) {
    const techPatterns = this.technicalPatterns;
    const problemSolving = this.problemSolvingPatterns;
    const techScore = Math.min(this.scoreFromMatches(text, techPatterns, 2, 40), 40);
    const problemScore = Math.min(this.scoreFromMatches(text, problemSolving, 4, 60), 60);
    const score = Math.min(techScore + problemScore, 100);

    const evidence = [
      ...this.extractEvidence(text, techPatterns),
      ...this.extractEvidence(text, problemSolving)
    ].slice(0, 8);

    const reason = this.getReason(score, 'technicalComplexity');
    const recommendation = this.getRecommendation(score, 'technicalComplexity');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeCareerGrowth(text) {
    const patterns = this.careerGrowthPatterns;
    const score = Math.min(this.scoreFromMatches(text, patterns, 6, 100), 100);
    const evidence = this.extractEvidence(text, patterns);
    const reason = this.getReason(score, 'careerGrowth');
    const recommendation = this.getRecommendation(score, 'careerGrowth');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeRoleConsistency(text) {
    const patterns = this.roleConsistencyPatterns;
    const roles = [];
    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        roles.push(match[0].toLowerCase());
      }
    }

    const uniqueRoles = [...new Set(roles)];
    let score = uniqueRoles.length >= 4 ? 90 : uniqueRoles.length >= 3 ? 75 : uniqueRoles.length >= 2 ? 55 : uniqueRoles.length >= 1 ? 35 : 15;
    const evidence = uniqueRoles.slice(0, 6);

    const reason = this.getReason(score, 'roleConsistency');
    const recommendation = this.getRecommendation(score, 'roleConsistency');
    return { score, grade: this.grade(score), reason, evidence, recommendation };
  }

  analyzeTimeline(text) {
    const evidence = [];
    for (const pattern of this.datePatterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        evidence.push(match[0]);
      }
    }

    const score = evidence.length >= 5 ? 95 : evidence.length >= 4 ? 80 : evidence.length >= 3 ? 65 : evidence.length >= 2 ? 50 : evidence.length >= 1 ? 30 : 15;
    const gaps = this.detectGaps(text);

    const reason = this.getReason(score, 'timeline');
    const recommendation = this.getRecommendation(score, 'timeline');
    return { score, grade: this.grade(score), reason, evidence: evidence.slice(0, 5), recommendation, gapsDetected: gaps.length > 0 ? gaps : undefined };
  }

  detectGaps(text) {
    const gaps = [];
    const rangePattern = /\b\d{4}\s*[-–—]\s*(\d{4}|present|current)\b/g;
    const ranges = [];
    let match;

    while ((match = rangePattern.exec(text)) !== null) {
      const startYear = parseInt(match[0].match(/\d{4}/)?.[0] || '0');
      const endMatch = match[0].match(/(\d{4})\s*[-–—]\s*(\d{4}|present|current)/);
      let endYear = 0;
      if (endMatch) {
        endYear = endMatch[2] === 'present' || endMatch[2] === 'current' ? new Date().getFullYear() : parseInt(endMatch[2]);
      }
      ranges.push({ start: startYear, end: endYear });
    }

    if (ranges.length >= 2) {
      const sorted = ranges.sort((a, b) => a.start - b.start);
      for (let i = 1; i < sorted.length; i++) {
        const gapStart = sorted[i-1].end + 1;
        const gapEnd = sorted[i].start - 1;
        if (gapEnd > gapStart && gapEnd - gapStart > 0) {
          const desc = `Potential career gap from ${gapStart} to ${gapEnd}`;
          const exists = gaps.some(g => g.start === gapStart && g.end === gapEnd);
          if (!exists) gaps.push({ start: gapStart, end: gapEnd, description: desc });
        }
      }
    }

    return gaps.slice(0, 3);
  }

  getReason(score, dimension) {
    const templates = this.reasonTemplates[dimension] || ['No analysis data', 'No analysis data', 'No analysis data'];
    if (score >= 60) return templates[0];
    if (score >= 25) return templates[1];
    return templates[2];
  }

  getRecommendation(score, dimension) {
    const recommendations = {
      impact: ['Maintain detailed metrics in all experience bullets', 'Enhance achievements with precise quantifiable metrics', 'Add specific metrics (% or dollar figures) to demonstrate impact'],
      leadership: ['Clearly document leadership philosophy and team achievements', 'Expand on leadership scope, team sizes, and outcomes', 'Highlight leadership experiences such as team leadership and mentoring'],
      ownership: ['Maintain clear ownership narrative across experiences', 'Strengthen ownership statements with end-to-end delivery examples', 'Use ownership language (owned, delivered, built) to show accountability'],
      businessValue: ['Quantify business value with precise figures where possible', 'Deepen business impact statements with specific outcomes', 'Connect achievements to business results (revenue, cost, efficiency)'],
      technicalComplexity: ['Continue showcasing advanced technical initiatives', 'Add technical depth with complex problem examples', 'Highlight specific technical challenges and solutions'],
      careerGrowth: ['Showcase continuous skill development and promotions', 'Expand on career milestones and increasing responsibilities', 'Include promotions, new responsibilities, and progression milestones'],
      roleConsistency: ['Maintain a coherent career progression narrative', 'Ensure a logical progression narrative between roles', 'Clarify role progression and responsibilities across positions'],
      timeline: ['Ensure consistent date formatting across all entries', 'Include clear and consistent date ranges for each position', 'Include clear and consistent date ranges for each position']
    };

    const recs = recommendations[dimension] || ['Continue improving', 'Continue improving', 'Continue improving'];
    if (score >= 60) return recs[0];
    if (score >= 25) return recs[1];
    return recs[2];
  }

  buildSummary(overallScore, dimensions, strengths, weaknesses, gaps) {
    const grade = this.grade(overallScore);
    const gradeDescriptions = {
      A: 'Exceptional experience profile with strong, verifiable achievements.',
      B: 'Strong experience profile with clear skills and impact demonstration.',
      C: 'Solid experience profile with good potential and minor gaps.',
      D: 'Adequate experience profile requiring more quantifiable metrics and detail.',
      F: 'Experience profile is lacking critical details and measurable outcomes.'
    };

    const topStrength = strengths[0] ? dimensions[strengths[0]].reason : 'none identified';
    const topWeakness = weaknesses[0] ? dimensions[weaknesses[0]].reason : 'none identified';
    const gapNote = gaps.length > 0 ? ` ${gaps.length} potential timeline gap(s) detected.` : '';

    return `${grade}: ${gradeDescriptions[grade] || ''} Primary strength is ${topStrength}. Primary area for improvement: ${topWeakness}.${gapNote}`;
  }
}

module.exports = new ExperienceIntelligenceEngine();
