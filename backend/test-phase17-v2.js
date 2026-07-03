/**
 * Phase 17 Enhanced AI Engine Test V2
 * Tests all new intelligence engines with full output
 */

const intelligence = require('./src/intelligence');

// Test resume with various characteristics
const testResume = `
JOHN DOE
Senior Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe | Location: San Francisco, CA

SUMMARY
Experienced software engineer with 6+ years of expertise in full-stack development, 
cloud architecture, and team leadership. Proven track record of delivering scalable 
solutions and driving business impact.

EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2021 - Present
- Led a team of 8 engineers to deliver a cloud-native platform that increased revenue by 35% ($2.5M)
- Architected microservices infrastructure using Node.js, Python, and AWS, reducing system latency by 45%
- Implemented CI/CD pipelines with Docker and Kubernetes, accelerating deployment frequency by 3x
- Mentored 5 junior developers, improving team productivity by 25%
- Led migration from monolith to microservices, achieving 99.9% uptime

Software Engineer | StartupXYZ | 2018 - 2021
- Developed React-based frontend applications serving 100K+ users
- Built RESTful APIs using Express.js and PostgreSQL, handling 10K+ requests per second
- Improved application performance by 40% through code optimization and caching strategies
- Collaborated with cross-functional teams to launch 3 major product features
- Reduced bug count by 30% through implementation of comprehensive testing frameworks

Junior Developer | WebSolutions | 2016 - 2018
- Created responsive web applications using HTML, CSS, and JavaScript
- Assisted in development of e-commerce platform processing $500K+ in transactions
- Participated in code reviews and agile development processes

EDUCATION
Bachelor of Science in Computer Science | Stanford University | 2016
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems

SKILLS
Programming: JavaScript, TypeScript, Python, Java, SQL
Frontend: React, Angular, Vue.js, HTML5, CSS3, Redux, Webpack
Backend: Node.js, Express, Django, Spring Boot, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch, MySQL
Cloud & DevOps: AWS, Azure, Docker, Kubernetes, Terraform, CI/CD, Jenkins
Tools: Git, GitHub, Jira, Confluence, Postman, Swagger
Methodologies: Agile, Scrum, TDD, Microservices, Serverless

CERTIFICATIONS
- AWS Certified Solutions Architect - Professional (2022)
- Certified Kubernetes Administrator (CKA) (2021)
- MongoDB Certified Developer (2020)

PROJECTS
E-Commerce Platform | Personal Project | 2023
- Built full-stack e-commerce application using React, Node.js, and MongoDB
- Implemented payment processing with Stripe, handling $10K+ in test transactions
- Deployed on AWS with auto-scaling, achieving 99.5% uptime
- Technologies: React, Node.js, MongoDB, AWS, Stripe API

Open Source Contribution | Various | 2022 - Present
- Contributed to 5+ open source projects with 500+ GitHub stars
- Developed reusable components used by 1000+ developers
`;

async function runTests() {
  console.log('='.repeat(80));
  console.log('PHASE 17: ENHANCED AI ENGINE TEST');
  console.log('='.repeat(80));
  console.log();

  try {
    console.log('🚀 Starting comprehensive analysis...\n');

    // Run analysis
    const results = await intelligence.analyze(testResume, {
      targetRole: 'Senior Software Engineer',
    });

    console.log('✅ Analysis completed successfully!\n');
    console.log('='.repeat(80));
    console.log('COMPREHENSIVE REPORT OUTPUT');
    console.log('='.repeat(80));
    console.log(JSON.stringify(results.comprehensiveReport, null, 2));
    console.log();

    // Verify all required fields
    const report = results.comprehensiveReport;
    const requiredFields = [
      'executiveSummary',
      'atsScore', 'keywordScore', 'formattingScore', 'grammarScore', 'readabilityScore',
      'leadershipScore', 'impactScore', 'achievementScore', 'technicalScore',
      'recruiterConfidence', 'hiringProbability', 'industryBenchmark', 'roleReadiness',
      'strengths', 'weaknesses', 'topPriorityFixes',
      'actionVerbAnalysis', 'quantificationAnalysis', 'keywordHeatmap',
      'missingKeywords', 'matchedKeywords', 'sectionAnalysis',
      'timelineAnalysis', 'resumeFlow', 'skillDistribution',
      'experienceDistribution', 'educationAnalysis', 'projectsAnalysis', 'certificationAnalysis',
      'atsCompatibility', 'aiRewriteSuggestions', 'beforeAfterExamples',
      'recruiterNotes', 'interviewReadiness', 'careerGrowthSuggestions',
      'metadata'
    ];

    console.log('='.repeat(80));
    console.log('VERIFICATION');
    console.log('='.repeat(80));

    let allPresent = true;
    for (const field of requiredFields) {
      const present = report[field] !== undefined;
      if (!present) {
        console.log(`❌ MISSING: ${field}`);
        allPresent = false;
      } else {
        console.log(`✅ PRESENT: ${field}`);
      }
    }

    // Verify scores have reason, evidence, recommendation
    console.log('\nVerifying score fields include reason, evidence, recommendation:\n');
    const scoresWithEvidence = [
      'atsScore', 'keywordScore', 'formattingScore', 'grammarScore', 'readabilityScore',
      'leadershipScore', 'impactScore', 'achievementScore', 'technicalScore',
      'hiringProbability', 'industryBenchmark', 'roleReadiness'
    ];

    for (const field of scoresWithEvidence) {
      const score = report[field];
      const hasReason = score?.reason !== undefined;
      const hasEvidence = score?.evidence !== undefined;
      const hasRecommendation = score?.recommendation !== undefined;

      if (hasReason && hasEvidence && hasRecommendation) {
        console.log(`✅ ${field}: Has reason, evidence, recommendation`);
      } else {
        console.log(`❌ ${field}: Missing ${!hasReason ? 'reason ' : ''}${!hasEvidence ? 'evidence ' : ''}${!hasRecommendation ? 'recommendation' : ''}`);
        allPresent = false;
      }
    }

    console.log();
    console.log('='.repeat(80));
    if (allPresent) {
      console.log('✅ ALL VERIFICATIONS PASSED');
    } else {
      console.log('❌ SOME VERIFICATIONS FAILED');
    }
    console.log('='.repeat(80));
    console.log();

    process.exit(allPresent ? 0 : 1);
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();