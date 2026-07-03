/**
 * AI Evaluation Engine
 * Tests the intelligence layer against various resume types
 * Ensures consistent, reasonable, and hallucination-free analysis
 */

class EvaluationEngine {
  constructor() {
    this.documentNormalizer = require('../resumeIntelligence/documentNormalizer');
    this.atsEngine = require('../atsEngine');
    this.keywordEngine = require('../keywordEngine');
    this.semanticEngine = require('../semanticEngine');
    this.achievementEngine = require('../achievementEngine');
    this.benchmarkEngine = require('../benchmarkEngine');
  }

  /**
   * Run comprehensive evaluation
   * @returns {Object} Evaluation results
   */
  evaluate() {
    const testCases = this.getTestCases();
    const results = [];

    for (const testCase of testCases) {
      const result = this.evaluateTestCase(testCase);
      results.push(result);
    }

    const summary = this.calculateSummary(results);

    return {
      summary,
      results,
      evaluatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get test cases for evaluation
   */
  getTestCases() {
    return [
      {
        name: 'Poor Resume',
        description: 'Resume with weak language, no metrics, missing sections',
        resume: this.getPoorResume(),
        expectedScoreRange: [20, 50],
      },
      {
        name: 'Average Resume',
        description: 'Standard resume with some achievements but room for improvement',
        resume: this.getAverageResume(),
        expectedScoreRange: [50, 70],
      },
      {
        name: 'Strong Resume',
        description: 'Well-crafted resume with strong achievements and good structure',
        resume: this.getStrongResume(),
        expectedScoreRange: [70, 90],
      },
      {
        name: 'Senior Resume',
        description: 'Senior-level resume with leadership and extensive experience',
        resume: this.getSeniorResume(),
        expectedScoreRange: [75, 95],
      },
      {
        name: 'Student Resume',
        description: 'Student or entry-level resume with limited experience',
        resume: this.getStudentResume(),
        expectedScoreRange: [40, 65],
      },
      {
        name: 'Career Change Resume',
        description: 'Resume from professional changing careers',
        resume: this.getCareerChangeResume(),
        expectedScoreRange: [45, 70],
      },
    ];
  }

  /**
   * Evaluate a single test case
   */
  evaluateTestCase(testCase) {
    try {
      // Normalize document
      const normalizedDoc = this.documentNormalizer.normalize(testCase.resume);

      // Run all engines
      const atsResult = this.atsEngine.evaluate(normalizedDoc);
      const keywordResult = this.keywordEngine.extractKeywords(normalizedDoc.cleanedText);
      const semanticResult = this.semanticEngine.analyze(normalizedDoc);
      const achievementResult = this.achievementEngine.analyze(normalizedDoc);
      const benchmarkResult = this.benchmarkEngine.benchmark(normalizedDoc);

      // Calculate overall score
      const overallScore = Math.round(
        (atsResult.atsScore * 0.25) +
        (keywordResult.overallCoverage * 0.25) +
        (semanticResult.overallScore * 0.25) +
        (achievementResult.overallScore * 0.25)
      );

      // Check if score is in expected range
      const [minExpected, maxExpected] = testCase.expectedScoreRange;
      const scoreInRange = overallScore >= minExpected && overallScore <= maxExpected;

      // Validate no hallucinations
      const hallucinationCheck = this.checkForHallucinations(normalizedDoc, {
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
      });

      // Validate consistency
      const consistencyCheck = this.checkConsistency({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
      });

      // Validate reasonableness
      const reasonablenessCheck = this.checkReasonableness({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        benchmark: benchmarkResult,
      });

      return {
        name: testCase.name,
        description: testCase.description,
        overallScore,
        expectedRange: testCase.expectedScoreRange,
        scoreInRange,
        atsScore: atsResult.atsScore,
        keywordCoverage: keywordResult.overallCoverage,
        semanticScore: semanticResult.overallScore,
        achievementScore: achievementResult.overallScore,
        benchmarkScore: benchmarkResult.overallScore,
        hallucinationCheck,
        consistencyCheck,
        reasonablenessCheck,
        passed: scoreInRange && hallucinationCheck.passed && consistencyCheck.passed && reasonablenessCheck.passed,
        issues: [
          ...hallucinationCheck.issues,
          ...consistencyCheck.issues,
          ...reasonablenessCheck.issues,
        ],
      };
    } catch (error) {
      return {
        name: testCase.name,
        description: testCase.description,
        error: error.message,
        passed: false,
        issues: [`Evaluation failed: ${error.message}`],
      };
    }
  }

  /**
   * Check for hallucinations (invented facts)
   */
  checkForHallucinations(normalizedDoc, results) {
    const issues = [];
    let passed = true;

    // Check that ATS issues are based on actual text
    if (results.ats.checks) {
      for (const [category, check] of Object.entries(results.ats.checks)) {
        if (check.issues) {
          for (const issue of check.issues) {
            // Verify evidence is from actual text
            if (issue.evidence && !normalizedDoc.cleanedText.toLowerCase().includes(issue.evidence.toLowerCase())) {
              issues.push(`Potential hallucination in ${category}: evidence not found in text`);
              passed = false;
            }
          }
        }
      }
    }

    // Check that achievements are from actual text
    if (results.achievements.achievements) {
      for (const achievement of results.achievements.achievements) {
        if (!normalizedDoc.cleanedText.toLowerCase().includes(achievement.text.toLowerCase().substring(0, 20))) {
          issues.push('Potential hallucination: achievement not found in original text');
          passed = false;
        }
      }
    }

    return { passed, issues };
  }

  /**
   * Check for consistency across engines
   */
  checkConsistency(results) {
    const issues = [];
    let passed = true;

    // ATS score should align with keyword coverage
    const atsScore = results.ats.atsScore;
    const keywordCoverage = results.keywords.overallCoverage;

    if (Math.abs(atsScore - keywordCoverage) > 40) {
      issues.push(`Inconsistent scores: ATS (${atsScore}) vs Keywords (${keywordCoverage})`);
      passed = false;
    }

    // Semantic score should align with achievement score
    const semanticScore = results.semantic.overallScore;
    const achievementScore = results.achievements.overallScore;

    if (Math.abs(semanticScore - achievementScore) > 35) {
      issues.push(`Inconsistent scores: Semantic (${semanticScore}) vs Achievements (${achievementScore})`);
      passed = false;
    }

    // Achievement weak percentage should align with semantic impact
    const weakPercentage = results.achievements.weakPercentage;
    const impactScore = results.semantic.dimensions?.impact?.score || 0;

    if (weakPercentage > 50 && impactScore > 70) {
      issues.push('Inconsistent: high weak achievement percentage but high impact score');
      passed = false;
    }

    return { passed, issues };
  }

  /**
   * Check for reasonableness
   */
  checkReasonableness(results) {
    const issues = [];
    let passed = true;

    // Scores should be within 0-100
    if (results.ats.atsScore < 0 || results.ats.atsScore > 100) {
      issues.push(`ATS score out of range: ${results.ats.atsScore}`);
      passed = false;
    }

    if (results.keywords.overallCoverage < 0 || results.keywords.overallCoverage > 100) {
      issues.push(`Keyword coverage out of range: ${results.keywords.overallCoverage}`);
      passed = false;
    }

    if (results.semantic.overallScore < 0 || results.semantic.overallScore > 100) {
      issues.push(`Semantic score out of range: ${results.semantic.overallScore}`);
      passed = false;
    }

    if (results.achievements.overallScore < 0 || results.achievements.overallScore > 100) {
      issues.push(`Achievement score out of range: ${results.achievements.overallScore}`);
      passed = false;
    }

    // Check for extreme scores without justification
    if (results.ats.atsScore === 100 && results.ats.recommendations?.length > 5) {
      issues.push('Perfect ATS score but multiple recommendations found');
      passed = false;
    }

    if (results.achievements.strongPercentage === 100 && results.achievements.weakCount > 0) {
      issues.push('Claims 100% strong achievements but has weak achievements');
      passed = false;
    }

    return { passed, issues };
  }

  /**
   * Calculate evaluation summary
   */
  calculateSummary(results) {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;

    const avgScore = Math.round(
      results.reduce((sum, r) => sum + (r.overallScore || 0), 0) / total
    );

    const scoreRanges = results.map(r => ({
      name: r.name,
      score: r.overallScore,
      expected: r.expectedRange,
      inRange: r.scoreInRange,
    }));

    const allIssues = results.flatMap(r => r.issues || []);

    return {
      total,
      passed,
      failed,
      passRate: Math.round((passed / total) * 100),
      averageScore: avgScore,
      scoreRanges,
      totalIssues: allIssues.length,
      issues: allIssues.slice(0, 20),
      overall: passed === total ? 'PASS' : passed >= total * 0.8 ? 'MOSTLY_PASS' : 'FAIL',
    };
  }

  // Test case generators
  getPoorResume() {
    return `
JOHN DOE
123 Main St

EXPERIENCE
Company A
- Responsible for various tasks
- Worked on multiple projects
- Helped with customer service

Company B
- Tasked with daily operations
- Assisted in team meetings

EDUCATION
Some College

SKILLS
Communication
Teamwork
`;
  }

  getAverageResume() {
    return `
JANE SMITH
jane@email.com | (555) 123-4567 | linkedin.com/in/jane

PROFESSIONAL SUMMARY
Experienced software developer with 5 years of experience.

EXPERIENCE
Software Engineer at TechCorp (2020-Present)
- Developed web applications using React and Node.js
- Improved application performance by optimizing database queries
- Collaborated with cross-functional teams

Junior Developer at StartupXYZ (2018-2020)
- Built features for e-commerce platform
- Worked on bug fixes and maintenance

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2018

SKILLS
JavaScript, React, Node.js, SQL, Git, Agile
`;
  }

  getStrongResume() {
    return `
ALEX JOHNSON
alex@email.com | (555) 987-6543 | linkedin.com/in/alex | github.com/alex

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 7+ years of experience building scalable web applications.

EXPERIENCE
Senior Software Engineer at BigTech Inc. (2021-Present)
- Led development of microservices architecture serving 2M+ users
- Increased system performance by 45% through optimization
- Managed team of 5 engineers, delivering 12 major features
- Reduced deployment time from 2 hours to 15 minutes (87% improvement)

Software Engineer at StartupXYZ (2018-2021)
- Developed React frontend for SaaS platform used by 50K customers
- Implemented CI/CD pipeline reducing bugs by 35%
- Built REST APIs handling 10K requests per minute

EDUCATION
Master of Science in Computer Science
Stanford University, 2018

SKILLS
JavaScript, TypeScript, React, Node.js, Python, SQL, MongoDB, AWS, Docker, Kubernetes, GraphQL, REST APIs, CI/CD, Agile, Git

CERTIFICATIONS
AWS Certified Solutions Architect
`;
  }

  getSeniorResume() {
    return `
DR. MICHAEL CHEN
michael@email.com | (555) 555-5555 | linkedin.com/in/michael

EXECUTIVE SUMMARY
Principal Engineer with 15+ years of experience leading technical strategy and engineering teams.

EXPERIENCE
Principal Engineer at Fortune500 Corp (2019-Present)
- Directed technical strategy for $50M product line serving 10M users
- Led organization of 50+ engineers across 4 teams
- Drove architectural decisions reducing infrastructure costs by $2M annually
- Established engineering best practices adopted company-wide

Senior Engineering Manager at TechGiant (2015-2019)
- Managed $10M budget and team of 25 engineers
- Launched 3 successful products generating $30M in revenue
- Improved team productivity by 40% through process optimization

EDUCATION
Ph.D. in Computer Science
MIT, 2008

SKILLS
System Design, Architecture, Leadership, Strategy, Cloud Architecture, Microservices, Distributed Systems, Python, Java, Go, AWS, Azure, Kubernetes, Terraform, CI/CD, Agile, Scrum
`;
  }

  getStudentResume() {
    return `
SARAH WILLIAMS
sarah.williams@email.com | (555) 222-3333

OBJECTIVE
Recent Computer Science graduate seeking entry-level software engineering position.

EDUCATION
Bachelor of Science in Computer Science
State University, Expected May 2025
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering

PROJECTS
E-Commerce Website (2024)
- Built full-stack web application using React and Node.js
- Implemented user authentication and payment processing
- Deployed on AWS with Docker containers

Campus Event Management System (2023)
- Developed mobile-responsive web app for university
- Used MongoDB for database, Express.js for backend
- Led team of 3 students

SKILLS
JavaScript, Python, React, Node.js, Express, MongoDB, SQL, Git, HTML, CSS

ACTIVITIES
Computer Science Club Member (2022-Present)
- Participated in hackathons and coding competitions
`;
  }

  getCareerChangeResume() {
    return `
DAVID BROWN
david.brown@email.com | (555) 444-5555 | linkedin.com/in/david

PROFESSIONAL SUMMARY
Marketing professional transitioning to data analytics. 8 years of marketing experience with strong analytical background.

EXPERIENCE
Marketing Manager at RetailCorp (2019-2024)
- Analyzed customer data to optimize marketing campaigns, increasing ROI by 35%
- Built predictive models for customer segmentation using Python
- Created dashboards in Tableau tracking $5M in marketing spend
- Led data-driven decision making for team of 6

Marketing Specialist at StartupABC (2017-2019)
- Conducted market research and competitive analysis
- Used Excel and SQL to analyze sales data
- Developed reporting frameworks improving insights delivery by 40%

EDUCATION
Bachelor of Business Administration
University of Business, 2017

CERTIFICATIONS
Google Data Analytics Certificate (2024)
- Completed intensive program covering SQL, Python, Tableau, R

SKILLS
SQL, Python, Tableau, Excel, Data Analysis, Statistics, Marketing Analytics, A/B Testing, Customer Segmentation, Campaign Optimization
`;
  }
}

module.exports = new EvaluationEngine();