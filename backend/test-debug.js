/**
 * Phase 17 Debug Test
 */

const intelligence = require('./src/intelligence');

const testResume = `
JOHN DOE
Senior Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 6+ years of expertise in full-stack development.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2021 - Present
- Led a team of 8 engineers to deliver a cloud-native platform that increased revenue by 35% ($2.5M)
- Architected microservices infrastructure using Node.js, Python, and AWS, reducing system latency by 45%

SKILLS
JavaScript, TypeScript, Python, Node.js, React, AWS, Docker, Kubernetes

CERTIFICATIONS
- AWS Certified Solutions Architect - Professional (2022)
- Certified Kubernetes Administrator (CKA) (2021)
`;

async function runTests() {
  try {
    console.log('Running analysis...');
    const results = await intelligence.analyze(testResume, {
      targetRole: 'Senior Software Engineer',
    });

    console.log('Results:', JSON.stringify(results, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();