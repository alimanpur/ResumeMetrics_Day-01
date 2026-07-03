class InterviewPrepEngine {
  constructor() {
    this.gradeThresholds = [
      { grade: 'A', threshold: 90 },
      { grade: 'B', threshold: 80 },
      { grade: 'C', threshold: 70 },
      { grade: 'D', threshold: 60 },
      { grade: 'F', threshold: 0 }
    ]
    this.categoryGenerators = {
      easy: this.generateEasyQuestions.bind(this),
      medium: this.generateMediumQuestions.bind(this),
      hard: this.generateHardQuestions.bind(this),
      behavioral: this.generateBehavioralQuestions.bind(this),
      technical: this.generateTechnicalQuestions.bind(this),
      project: this.generateProjectQuestions.bind(this),
      hr: this.generateHRQuestions.bind(this),
      systemDesign: this.generateSystemDesignQuestions.bind(this)
    }
  }

  analyze(normalizedDoc, analysis = {}) {
    const doc = normalizedDoc || {}
    const profile = doc.profile || doc
    const skills = Array.isArray(doc.skills) ? doc.skills : []
    const experience = Array.isArray(doc.experience) ? doc.experience : []
    const projects = Array.isArray(doc.projects) ? doc.projects : []
    const education = Array.isArray(doc.education) ? doc.education : []
    const rawText = typeof doc.raw === 'string' ? doc.raw : ''
    const summary = typeof doc.summary === 'string' ? doc.summary : ''
    const designations = typeof doc.designations === 'string' ? doc.designations : ''
    const keywords = typeof doc.keywords === 'string' ? doc.keywords : ''
    const combinedText = [rawText, summary, designations, keywords, ...skills, ...this.flatten(experience.map(e => [e.title, e.company, e.description || ''])), ...this.flatten(projects.map(p => [p.name, p.description || '', p.tech || '']))].join(' ')
    const detectedSkills = this.extractSkills(skills, combinedText)
    const seniorLevel = /senior|lead|architect|principal|staff/i.test(designations + ' ' + summary)
    const lowerCombined = combinedText.toLowerCase()
    const greetingCandidates = ['ananya', 'priya', 'divya', 'pooja', 'shreya', 'kavya', 'nidhi', 'aisha', 'meera', 'ritika', 'sneha', 'tanvi', 'i am', 'this is', 'my name is']
    const matchedGreetings = greetingCandidates.filter(g => lowerCombined.includes(g))
    const greetingName = matchedGreetings.length > 0 ? matchedGreetings[matchedGreetings.length - 1].split(' ').pop().charAt(0).toUpperCase() + matchedGreetings[matchedGreetings.length - 1].split(' ').pop().slice(1) : ''
    const questionCounts = analysis.questionCounts || {}
    const questions = {}
    let likelyQuestions = []
    let weakAreas = []
    let preparationPlan = []
    let talkingPoints = []
    const categories = {
      easy: [],
      medium: [],
      hard: [],
      behavioral: [],
      technical: [],
      project: [],
      hr: [],
      systemDesign: []
    }
    if (questionCounts.easy !== 0) categories.easy = this.categoryGenerators.easy(profile, experience, combinedText, detectedSkills, greetingName).slice(0, questionCounts.easy || 3)
    if (questionCounts.medium !== 0) categories.medium = this.categoryGenerators.medium(profile, experience, combinedText, detectedSkills).slice(0, questionCounts.medium || 3)
    if (questionCounts.hard !== 0) categories.hard = this.categoryGenerators.hard(profile, experience, combinedText, detectedSkills).slice(0, questionCounts.hard || 3)
    if (questionCounts.behavioral !== 0) categories.behavioral = this.categoryGenerators.behavioral(profile, experience, combinedText, detectedSkills).slice(0, questionCounts.behavioral || 3)
    if (questionCounts.technical !== 0) categories.technical = this.categoryGenerators.technical(detectedSkills, combinedText).slice(0, questionCounts.technical || 5)
    if (questionCounts.project !== 0) categories.project = this.categoryGenerators.project(projects, experience, combinedText, detectedSkills).slice(0, questionCounts.project || 3)
    if (questionCounts.hr !== 0) categories.hr = this.categoryGenerators.hr(profile, experience, education, combinedText).slice(0, questionCounts.hr || 3)
    if (seniorLevel && questionCounts.systemDesign !== 0) categories.systemDesign = this.categoryGenerators.systemDesign(profile, experience, combinedText, detectedSkills).slice(0, questionCounts.systemDesign || 3)
    Object.keys(categories).forEach(key => {
      if (categories[key].length > 0) {
        questions[key] = categories[key]
      }
    })
    const allQuestions = Object.values(categories).flat()
    likelyQuestions = this.selectLikelyQuestions(allQuestions, experience, projects, detectedSkills)
    weakAreas = this.identifyWeakAreas(detectedSkills, experience, projects, allQuestions)
    preparationPlan = this.generatePreparationPlan(weakAreas, detectedSkills, experience, projects)
    talkingPoints = this.generateTalkingPoints(profile, experience, projects, detectedSkills)
    const overallReadiness = this.calculateReadinessScore(experience, skills, projects, detectedSkills, seniorLevel)
    const preparationGrade = this.calculateGrade(overallReadiness)
    const summaryText = this.generateSummaryText(overallReadiness, preparationGrade, detectedSkills, experience, projects, seniorLevel)
    return {
      overallReadiness,
      preparationGrade,
      questions,
      likelyQuestions,
      weakAreas,
      preparationPlan,
      talkingPoints,
      summary: summaryText
    }
  }

  flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatten(val) : val), [])
  }

  extractSkills(skillsList, combinedText) {
    const skillSet = new Set()
    const normalizedFromList = (skillsList || []).map(s => typeof s === 'string' ? s.toLowerCase().trim() : '').filter(Boolean)
    normalizedFromList.forEach(skill => skillSet.add(skill))
    const techPatterns = [
      /javascript|node\.?js|express|react(?:\.?js)?|vue(?:\.?js)?|angular(?:js)?|next\.?js|nuxt|svelte|typescript|ts|java(?:script)?/gi,
      /python|django|flask|fastapi|pytest|numpy|pandas|tensorflow|pytorch|scikit|pytorch/i,
      /go|golang|gin|echo|fiber/i,
      /rust|cargo|actix|tokio/i,
      /c\+\+|cpp|qt|boost/i,
      /c sharp|c#|\.net|asp\.net|core/i,
      /php|laravel|symfony|codeigniter/i,
      /ruby|rails|sinatra|padrino/i,
      /swift|swiftui|objective-c/i,
      /kotlin|android|jetpack|jetpack compose/i,
      /sql|mysql|postgres(?:ql)?|mongodb|mongo|mongoose|redis|elasticsearch|cassandra|oracle|sqlite/i,
      /aws|amazon web services|ec2|s3|lambda|cloudfront|rds|iam|ecs|eks|fargate|cloudformation|terraform/i,
      /azure|microsoft azure|azure functions|aks|blob storage|active directory/i,
      /gcp|google cloud|google cloud platform|firebase|bigquery|cloud run|vertex ai/i,
      /docker|kubernetes|k8s|helm|jenkins|gitlab ci|github actions|circleci|travis/i,
      /git|github|gitlab|bitbucket|svn/i,
      /agile|scrum|kanban|sdlc|waterfall|jira|confluence/i,
      /rest(?:ful)?|graphql|soap|api|microservices|serverless|oauth|jwt|webhook/i,
      /linux|unix|bash|shell|powershell|nginx|apache|tomcat/i,
      /aws certified|azure certified|gcp certified|cka|ckad|cissp|cisa|compTia|pmp/i,
      /machine learning|ml|ai|deep learning|nlp|computer vision|data science|analytics/i,
      /blockchain|ethereum|solidity|web3|smart contract/i,
      /react native|flutter|expo|xamarin|ionic/i,
      /selenium|cypress|junit|jest|mocha|chai|puppeteer|lighthouse/i,
      /figma|sketch|adobe|photoshop|illustrator|ui|ux|figjam/i,
      /security|penetration testing|owasp|vulnerability|firewall|vpn|encryption|authentication|authorization/i,
      /wordpress|joomla|drupal/i,
      /scala|apache spark|spark/i,
      /hadoop|hive|pig|hbase/i,
      /salesforce|sap|workday/i,
      /testing|unit testing|integration testing|tdd|bdd|test automation/i,
      /data structures|algorithms|leetcode|hackerrank|competitive programming/i,
      /oop|object oriented|design patterns|solid principles/i,
      /redux|vuex|pinia|context api/i,
      /tailwind|bootstrap|material ui|ant design/i,
      /websocket|socket.io|paho/i,
      /kafka|rabbitmq|activemq|sqs|pubsub/i,
      /prometheus|grafana|datadog|newrelic|splunk|elk/i,
      /oop|oo concepts|polymorphism|inheritance|encapsulation|abstraction/i,
      /oop|object oriented programming/i,
      /flutter|dart/i,
      /ios|swift|objective-c|xcode/i,
      /android|kotlin|java mobile/i,
      /flutter|react native/i,
      /angular|vue|svelte/i,
      /laravel|symfony|codeigniter|wordpress/i,
      /ruby|rails|sinatra/i,
      /r|statistics|data analysis/i,
      /matlab|octave/i,
      /golang|go programming/i,
      /bash|shell scripting|powershell/i,
      /regex|regular expressions/i,
      /xml|json|yaml|toml/i,
      /markdown|asciidoc/i,
      /uml|sequence diagrams|class diagrams/i,
      /figma|adobe xd|invision|zeplin/i,
      /jira|confluence|notion|asana|trello|monday/i,
      /postman|insomnia|swagger|openapi/i,
      /cucumber|behave|gauge/i,
      /pytest|unittest|nose/i,
      /mocha|chai|sinon/i,
      /cypress|playwright|puppeteer|selenium/i,
      /jest|vitest|ava/i,
      /karma|jasmine/i,
      /webpack|rollup|vite|parcel|esbuild/i,
      /babel|typescript compiler|swc/i,
      /npm|yarn|pnpm|npm scripts/i,
      /maven|gradle|ant/i,
      /pip|conda|poetry|virtualenv/i,
      /composer|bundler|cargo/i,
      /terraform|cloudformation|pulumi/i,
      /ansible|chef|puppet/i,
      /vagrant|packer/i,
      /nagios|zabbix|pagerduty/i,
      /datadog|newrelic|appdynamics/i,
      /newrelic|splunk|sumologic/i,
      /logstash|filebeat|metricbeat/i,
      /kibana|grafana/i,
      /jaeger|zipkin|opentelemetry/i,
      /oauth|oidc|saml|ldap|active directory/i,
      /sso|mfa|2fa|totp/i,
      /pki|ssl|tls|https|ssh/i,
      /vpc|subnet|nat gateway|load balancer|cdn/i,
      /cdn|cloudfront|cloudflare|fastly/i,
      /lambda|serverless|faas/i,
      /lambda|step functions|sqs|sns/i,
      /rds|aurora|dynamodb|cosmosdb|firestore/i,
      /blob storage|s3|gs|azure blob/i,
      /cdn|video streaming|webrtc|h.264|h.265|vp8|vp9|av1/i
    ]
    techPatterns.forEach(pattern => {
      const matches = combinedText.match(pattern) || []
      matches.forEach(m => {
        const cleaned = m.toLowerCase().replace(/[^a-z0-9+.#\s]/g, ' ').trim().replace(/\s+/g, ' ')
        if (cleaned) skillSet.add(cleaned)
      })
    })
    normalizedFromList.forEach(skill => skillSet.add(skill))
    return Array.from(skillSet)
  }

  calculateReadinessScore(experience, skills, projects, detectedSkills, isSenior) {
    let score = 35
    const expCount = Array.isArray(experience) ? experience.length : 0
    if (expCount >= 5) score += 25
    else if (expCount >= 3) score += 18
    else if (expCount >= 1) score += 10
    const skillCount = detectedSkills.length
    if (skillCount >= 15) score += 25
    else if (skillCount >= 10) score += 20
    else if (skillCount >= 5) score += 15
    else if (skillCount >= 1) score += 8
    const projCount = Array.isArray(projects) ? projects.length : 0
    if (projCount >= 4) score += 15
    else if (projCount >= 2) score += 10
    else if (projCount >= 1) score += 5
    if (isSenior) score += 5
    return Math.min(100, Math.max(0, score))
  }

  calculateGrade(score) {
    for (const tier of this.gradeThresholds) {
      if (score >= tier.threshold) return tier.grade
    }
    return 'F'
  }

  generateEasyQuestions(profile, experience, combinedText, detectedSkills, greetingName) {
    const questions = []
    const name = typeof profile.name === 'string' && profile.name.trim() ? profile.name : greetingName || 'candidate'
    questions.push({ question: `Hello ${name}, tell me about yourself.`, expectedAnswer: 'Brief professional background, key skills, and career goals aligned with the role.', difficulty: 'easy', area: 'introduction' })
    questions.push({ question: 'Walk me through your resume.', expectedAnswer: 'Chronological overview of experience, education, and key achievements.', difficulty: 'easy', area: 'resume_walkthrough' })
    questions.push({ question: 'What are your greatest strengths?', expectedAnswer: 'Relevant strengths supported by concrete examples from experience.', difficulty: 'easy', area: 'self_assessment' })
    const hasExperience = Array.isArray(experience) && experience.length > 0
    if (hasExperience) {
      const recent = experience[0]
      const title = typeof recent.title === 'string' && recent.title ? recent.title : 'your'
      questions.push({ question: `What did you enjoy most about being a ${title}?`, expectedAnswer: 'Positive aspects of the role that align with strengths and interests.', difficulty: 'easy', area: 'experience' })
      questions.push({ question: 'Describe a typical day at your current or last job.', expectedAnswer: 'Daily tasks, tools, collaboration patterns, and impact.', difficulty: 'easy', area: 'experience' })
      questions.push({ question: 'What is your proudest professional achievement?', expectedAnswer: 'Specific achievement, your contribution, and measurable impact.', difficulty: 'easy', area: 'achievement' })
    }
    questions.push({ question: 'Why are you interested in this role?', expectedAnswer: 'Alignment between skills, career goals, and company mission.', difficulty: 'easy', area: 'motivation' })
    questions.push({ question: 'What are you looking for in your next role?', expectedAnswer: 'Growth opportunities, technology stack, team culture, and impact.', difficulty: 'easy', area: 'career_goals' })
    return questions
  }

  generateMediumQuestions(profile, experience, combinedText, detectedSkills) {
    const questions = []
    questions.push({ question: 'Describe a time you solved a difficult technical problem.', expectedAnswer: 'STAR method: situation, task, action, result with measurable outcome.', difficulty: 'medium', area: 'problem_solving' })
    questions.push({ question: 'Tell me about a time you had conflicting requirements from stakeholders.', expectedAnswer: 'How you prioritized, communicated, and negotiated a resolution.', difficulty: 'medium', area: 'communication' })
    questions.push({ question: 'Explain a technical concept to a non-technical stakeholder.', expectedAnswer: 'Simplified explanation using analogies and avoiding jargon.', difficulty: 'medium', area: 'communication' })
    if (Array.isArray(experience) && experience.length > 0) {
      const recent = experience[0]
      const title = typeof recent.title === 'string' && recent.title ? recent.title : 'your role'
      questions.push({ question: `How do you approach estimating delivery timelines as a ${title}?`, expectedAnswer: 'Techniques like story points, historical data, buffer time, and risk assessment.', difficulty: 'medium', area: 'process' })
      questions.push({ question: 'Describe a time you had to work with a codebase you did not write.', expectedAnswer: 'How you inspected, documented, and improved unfamiliar code.', difficulty: 'medium', area: 'adaptability' })
    }
    questions.push({ question: 'How do you handle competing priorities and tight deadlines?', expectedAnswer: 'Prioritization framework, communication with stakeholders, and incremental delivery.', difficulty: 'medium', area: 'time_management' })
    questions.push({ question: 'Describe a trade-off between technical debt and delivery speed and how you decided.', expectedAnswer: 'Context, decision-making process, and mitigation strategy.', difficulty: 'medium', area: 'technical_judgment' })
    return questions
  }

  generateHardQuestions(profile, experience, combinedText, detectedSkills) {
    const questions = []
    questions.push({ question: 'Describe the most complex system you designed or contributed to.', expectedAnswer: 'Architecture overview, key decisions, trade-offs, and outcomes.', difficulty: 'hard', area: 'system_architecture' })
    questions.push({ question: 'How would you design a system handling millions of requests per second?', expectedAnswer: 'Load balancing, caching, partitioning, replication, and monitoring strategies.', difficulty: 'hard', area: 'scalability' })
    questions.push({ question: 'Explain how you would investigate and resolve a critical production outage under pressure.', expectedAnswer: 'Incident response plan, monitoring, root cause analysis, and communication.', difficulty: 'hard', area: 'incident_management' })
    questions.push({ question: 'How do you approach reducing technical debt in a large legacy system while maintaining velocity?', expectedAnswer: 'Prioritization, incremental refactoring, documentation, and stakeholder alignment.', difficulty: 'hard', area: 'technical_debt' })
    questions.push({ question: 'Walk me through a decision you made that had significant architectural impact.', expectedAnswer: 'Context, options considered, trade-offs, implementation, and outcomes.', difficulty: 'hard', area: 'architecture_decision' })
    questions.push({ question: 'How would you migrate a large monolith to microservices?', expectedAnswer: 'Strangler fig pattern, service boundaries, data consistency, and incremental migration.', difficulty: 'hard', area: 'migration' })
    return questions
  }

  generateBehavioralQuestions(profile, experience, combinedText, detectedSkills) {
    const questions = []
    questions.push({ question: 'Tell me about a time you led a team through a challenging project.', expectedAnswer: 'Situation, leadership actions, team motivation, and outcome.', difficulty: 'behavioral', area: 'leadership' })
    questions.push({ question: 'Describe a conflict with a teammate and how you resolved it.', expectedAnswer: 'Situation, perspective-taking, communication, and resolution.', difficulty: 'behavioral', area: 'conflict_resolution' })
    if (Array.isArray(experience) && experience.length > 0) {
      questions.push({ question: 'Tell me about a time you failed. What did you learn?', expectedAnswer: 'Honest reflection, lessons learned, and how you applied them.', difficulty: 'behavioral', area: 'learning' })
      questions.push({ question: 'Describe a time you delegated tasks effectively to team members.', expectedAnswer: 'Delegation criteria, communication, and outcome.', difficulty: 'behavioral', area: 'delegation' })
    }
    questions.push({ question: 'How do you handle difficult feedback from peers or managers?', expectedAnswer: 'Openness to feedback, reflection, and constructive action taken.', difficulty: 'behavioral', area: 'feedback' })
    questions.push({ question: 'Describe a time you mentored or coached a junior team member.', expectedAnswer: 'Mentoring approach, challenges faced, and progress made.', difficulty: 'behavioral', area: 'mentoring' })
    questions.push({ question: 'Tell me about a time you made an unpopular decision.', expectedAnswer: 'Decision context, communication strategy, and outcome.', difficulty: 'behavioral', area: 'decision_making' })
    questions.push({ question: 'How do you handle ambiguity when requirements are unclear?', expectedAnswer: 'Clarification techniques, assumptions documented, iterative approach, stakeholder updates.', difficulty: 'behavioral', area: 'ambiguity' })
    questions.push({ question: 'Tell me about a time you improved a process or workflow.', expectedAnswer: 'Inefficiency identified, solution implemented, measurable improvement.', difficulty: 'behavioral', area: 'process_improvement' })
    questions.push({ question: 'Describe a time you had to persuade others to adopt your idea.', expectedAnswer: 'Evidence presented, stakeholder alignment, negotiation, and successful adoption.', difficulty: 'behavioral', area: 'persuasion' })
    return questions
  }

  generateTechnicalQuestions(detectedSkills, combinedText) {
    const questions = []
    const has = (skill) => detectedSkills.some(s => s.includes(skill.toLowerCase()))
    if (has('javascript') || has('js') || has('node')) {
      questions.push({ question: 'Explain closures in JavaScript with an example.', expectedAnswer: 'Functions retaining access to enclosing scope even after outer function returns. Practical use cases include data privacy and factory functions.', difficulty: 'technical', area: 'javascript' })
      questions.push({ question: 'Explain the event loop and call stack in JavaScript.', expectedAnswer: 'Synchronous execution, task queue, microtask queue, and how callbacks are scheduled.', difficulty: 'technical', area: 'javascript' })
      questions.push({ question: 'What is the difference between var, let, and const?', expectedAnswer: 'Scope, hoisting, re-declaration rules, and best practices.', difficulty: 'technical', area: 'javascript' })
      if (has('react') || has('react.js')) {
        questions.push({ question: 'Explain React component lifecycle and hooks.', expectedAnswer: 'Mounting, updating, unmounting phases and useEffect, useState, custom hooks, useMemo, useCallback.', difficulty: 'technical', area: 'react' })
        questions.push({ question: 'What is the virtual DOM and why does React use it?', expectedAnswer: 'Lightweight copy of real DOM enabling efficient re-rendering via diffing algorithm.', difficulty: 'technical', area: 'react' })
        questions.push({ question: 'Explain React state management. When would you use Redux or Context?', expectedAnswer: 'Local vs global state, prop drilling, Redux for complex state, Context for simpler shared state.', difficulty: 'technical', area: 'react' })
      }
      if (has('node') || has('node.js')) {
        questions.push({ question: 'Explain the event loop in Node.js.', expectedAnswer: 'Non-blocking I/O, libuv, call stack, callback queue, and phases.', difficulty: 'technical', area: 'nodejs' })
        questions.push({ question: 'How do you handle errors in Express.js applications?', expectedAnswer: 'Middleware error handling, try-catch, async wrappers, custom error classes.', difficulty: 'technical', area: 'nodejs' })
      }
      if (has('typescript') || has('ts')) {
        questions.push({ question: 'Explain interfaces vs types in TypeScript.', expectedAnswer: 'Interfaces for object shapes, types for unions, intersections, primitives, and tuples.', difficulty: 'technical', area: 'typescript' })
        questions.push({ question: 'What are generics in TypeScript and why are they useful?', expectedAnswer: 'Type-safe reusable components, constraints, and flexibility.', difficulty: 'technical', area: 'typescript' })
      }
    }
    if (has('python')) {
      questions.push({ question: 'Explain decorators in Python with an example.', expectedAnswer: 'Functions modifying behavior of other functions or classes, common use in Flask and DRF.', difficulty: 'technical', area: 'python' })
      questions.push({ question: 'Explain list comprehensions and generator expressions in Python.', expectedAnswer: 'Concise syntax for creating lists, memory efficiency with generators.', difficulty: 'technical', area: 'python' })
    }
    if (has('java')) {
      questions.push({ question: 'Explain the difference between abstract classes and interfaces in Java.', expectedAnswer: 'Abstract classes allow partial implementation, interfaces for contracts, default methods.', difficulty: 'technical', area: 'java' })
      questions.push({ question: 'Explain the Java Memory Model and garbage collection basics.', expectedAnswer: 'Heap, stack, GC algorithms, and memory leak prevention.', difficulty: 'technical', area: 'java' })
    }
    if (has('sql') || has('mysql') || has('postgres') || has('postgresql')) {
      questions.push({ question: 'Explain database indexing and when to use it.', expectedAnswer: 'B-trees, hash indexes, trade-offs with write performance, composite indexes.', difficulty: 'technical', area: 'database' })
      questions.push({ question: 'What is the difference between INNER JOIN and LEFT JOIN?', expectedAnswer: 'INNER returns matching rows, LEFT returns all left rows with matches or nulls.', difficulty: 'technical', area: 'database' })
      questions.push({ question: 'Explain database normalization and denormalization.', expectedAnswer: 'Normal forms 1NF through 3NF, trade-offs, and when to denormalize for performance.', difficulty: 'technical', area: 'database' })
    }
    if (has('redis')) {
      questions.push({ question: 'When would you use Redis in a system design?', expectedAnswer: 'Caching, session storage, pub/sub, rate limiting, and leaderboards.', difficulty: 'technical', area: 'redis' })
      questions.push({ question: 'Explain Redis persistence mechanisms.', expectedAnswer: 'RDB snapshots, AOF logging, hybrid approach, trade-offs.', difficulty: 'technical', area: 'redis' })
    }
    if (has('mongodb') || has('mongo')) {
      questions.push({ question: 'Explain the difference between SQL and NoSQL databases.', expectedAnswer: 'Schema flexibility, scalability, consistency models, use cases, CAP theorem.', difficulty: 'technical', area: 'database' })
      questions.push({ question: 'What is aggregation in MongoDB and how do you use it?', expectedAnswer: 'Pipeline stages like match, group, project, sort, lookup, and unwind.', difficulty: 'technical', area: 'mongodb' })
    }
    if (has('api') || has('rest') || has('graphql')) {
      questions.push({ question: 'Explain RESTful API design principles.', expectedAnswer: 'Resources, HTTP verbs, statelessness, versioning, status codes, and HATEOAS.', difficulty: 'technical', area: 'api' })
      if (has('graphql')) {
        questions.push({ question: 'What are the advantages and disadvantages of GraphQL vs REST?', expectedAnswer: 'Flexibility vs complexity, overfetching, caching, schema evolution, N+1 problem.', difficulty: 'technical', area: 'graphql' })
      }
    }
    if (has('docker') || has('kubernetes') || has('k8s')) {
      questions.push({ question: 'Explain the difference between Docker and Kubernetes.', expectedAnswer: 'Docker for containerization, Kubernetes for orchestration and lifecycle management.', difficulty: 'technical', area: 'devops' })
      if (has('kubernetes') || has('k8s')) {
        questions.push({ question: 'What is a Kubernetes Deployment and how does it work?', expectedAnswer: 'Declarative updates, ReplicaSets, rolling updates, rollbacks, and strategies.', difficulty: 'technical', area: 'kubernetes' })
      }
      questions.push({ question: 'Explain Docker volumes and when to use them.', expectedAnswer: 'Persistent storage beyond container lifecycle, bind mounts, named volumes.', difficulty: 'technical', area: 'docker' })
    }
    if (has('aws')) {
      questions.push({ question: 'Explain the AWS shared responsibility model.', expectedAnswer: 'AWS secures infrastructure, customer secures data, access, OS, and applications.', difficulty: 'technical', area: 'cloud' })
      questions.push({ question: 'What is an IAM role and when would you use it?', expectedAnswer: 'Permissions assigned to AWS resources rather than users, for cross-account access.', difficulty: 'technical', area: 'cloud' })
    }
    if (has('agile') || has('scrum')) {
      questions.push({ question: 'What is the difference between Agile and Scrum?', expectedAnswer: 'Agile is a philosophy, Scrum is a framework with sprints, ceremonies, and roles.', difficulty: 'technical', area: 'process' })
      questions.push({ question: 'Explain the Scrum ceremonies and their purpose.', expectedAnswer: 'Sprint planning, daily standup, sprint review, retrospective.', difficulty: 'technical', area: 'process' })
    }
    if (has('git')) {
      questions.push({ question: 'Explain the difference between git merge and git rebase.', expectedAnswer: 'Merge creates a join commit preserving history, rebase rewrites history linearly.', difficulty: 'technical', area: 'version_control' })
      questions.push({ question: 'What is git cherry-pick and when would you use it?', expectedAnswer: 'Applying specific commits from one branch to another, use in hotfixes.', difficulty: 'technical', area: 'version_control' })
    }
    if (has('linux') || has('unix')) {
      questions.push({ question: 'Explain file permissions in Linux.', expectedAnswer: 'Read write execute for owner group others, chmod symbolic and numeric modes.', difficulty: 'technical', area: 'linux' })
      questions.push({ question: 'What is the difference between a process and a thread?', expectedAnswer: 'Process has isolated memory, threads share memory within a process.', difficulty: 'technical', area: 'linux' })
    }
    if (has('security') || has('penetration testing')) {
      questions.push({ question: 'What is OWASP Top 10?', expectedAnswer: 'Common web vulnerabilities: injection, XSS, CSRF, broken auth, sensitive data exposure.', difficulty: 'technical', area: 'security' })
    }
    if (has('oop') || has('object oriented') || has('solid')) {
      questions.push({ question: 'Explain SOLID principles with examples.', expectedAnswer: 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion with code examples.', difficulty: 'technical', area: 'design_patterns' })
      questions.push({ question: 'Describe common design patterns you have used.', expectedAnswer: 'Singleton, Factory, Observer, Strategy, Decorator, and when to apply each.', difficulty: 'technical', area: 'design_patterns' })
    }
    if (has('data structures') || has('algorithms')) {
      questions.push({ question: 'Explain time and space complexity with examples.', expectedAnswer: 'Big O notation, best average worst cases, common sorting and searching complexities.', difficulty: 'technical', area: 'algorithms' })
      questions.push({ question: 'When would you use a hash table versus a binary search tree?', expectedAnswer: 'Hash table for O(1) lookups, BST for ordered data and range queries.', difficulty: 'technical', area: 'data_structures' })
    }
    if (has('kafka') || has('rabbitmq')) {
      questions.push({ question: 'Explain the difference between message queues and publish-subscribe.', expectedAnswer: 'Point-to-point vs broadcast, use cases, durability, and ordering guarantees.', difficulty: 'technical', area: 'messaging' })
    }
    if (has('prometheus') || has('grafana') || has('monitoring')) {
      questions.push({ question: 'How do you approach monitoring and alerting for production systems?', expectedAnswer: 'Metrics, logs, traces, SLIs, SLOs, alerting thresholds, and dashboards.', difficulty: 'technical', area: 'monitoring' })
    }
    if (has('oauth') || has('authentication')) {
      questions.push({ question: 'Explain OAuth 2.0 authorization code flow.', expectedAnswer: 'Client secret, authorization code, token exchange, refresh tokens, and PKCE.', difficulty: 'technical', area: 'authentication' })
    }
    if (has('tensorflow') || has('pytorch') || has('machine learning')) {
      questions.push({ question: 'Explain supervised vs unsupervised learning.', expectedAnswer: 'Labeled data vs unlabeled data, use cases, algorithms, evaluation metrics.', difficulty: 'technical', area: 'machine_learning' })
    }
    if (has('git')) {
      questions.push({ question: 'Explain branching strategies like Git Flow or trunk-based development.', expectedAnswer: 'Branching models, merge strategies, release management, trade-offs.', difficulty: 'technical', area: 'version_control' })
    }
    if (questions.length === 0) {
      questions.push({ question: 'Describe a time you had to learn a new technology quickly.', expectedAnswer: 'Learning strategy, resources used, and real-world application.', difficulty: 'technical', area: 'learning' })
      questions.push({ question: 'Explain how you approach debugging a complex issue.', expectedAnswer: 'Reproduce, isolate, hypothesize, test, document root cause and fix.', difficulty: 'technical', area: 'debugging' })
    }
    return questions
  }

  generateProjectQuestions(projects, experience, combinedText, detectedSkills) {
    const questions = []
    const projectNames = (projects || []).map(p => typeof p.name === 'string' ? p.name : '').filter(Boolean).slice(0, 3)
    if (projectNames.length > 0) {
      projectNames.forEach((name, idx) => {
        const tech = typeof projects[idx].tech === 'string' ? projects[idx].tech : ''
        const techMention = tech ? ` involving ${tech}` : ''
        questions.push({ question: `Tell me about the ${name} project${techMention}.`, expectedAnswer: 'Overview, your role, technologies used, challenges, and outcomes.', difficulty: 'project', area: 'project_overview' })
        questions.push({ question: `What was the most challenging part of the ${name} project?`, expectedAnswer: 'Specific challenge, your approach, and the resolution.', difficulty: 'project', area: 'project_challenges' })
        questions.push({ question: `If you could improve the ${name} project, what would you change?`, expectedAnswer: 'Identified improvement areas, rationale, and proposed solution.', difficulty: 'project', area: 'project_reflection' })
      })
    } else if (Array.isArray(experience) && experience.length > 0) {
      const recent = experience[0]
      const company = typeof recent.company === 'string' && recent.company ? recent.company : 'your previous company'
      const techs = detectedSkills.slice(0, 3).join(', ')
      questions.push({ question: `Tell me about a notable project at ${company}.`, expectedAnswer: 'Project overview, your contribution, outcomes, and lessons learned.', difficulty: 'project', area: 'project_overview' })
      questions.push({ question: 'What was your role in that project and how did you contribute?', expectedAnswer: 'Specific responsibilities, actions taken, and quantifiable impact.', difficulty: 'project', area: 'project_role' })
      questions.push({ question: 'How did you handle testing and deployment for that project?', expectedAnswer: 'Testing strategies, CI/CD pipeline, automation, and monitoring.', difficulty: 'project', area: 'project_testing' })
    }
    return questions
  }

  generateHRQuestions(profile, experience, education, combinedText) {
    const questions = []
    questions.push({ question: 'Tell me about yourself in 60 seconds.', expectedAnswer: 'Elevator pitch covering background, key skills, and why you are a fit.', difficulty: 'hr', area: 'introduction' })
    questions.push({ question: 'What do you know about our company?', expectedAnswer: 'Research on products, culture, recent news, and alignment with their mission.', difficulty: 'hr', area: 'company_research' })
    questions.push({ question: 'Where do you see yourself in 5 years?', expectedAnswer: 'Realistic growth aligned with company trajectory and role expectations.', difficulty: 'hr', area: 'career_goals' })
    questions.push({ question: 'What is your expected salary range?', expectedAnswer: 'Researched market rate, experience-based range, and negotiation readiness.', difficulty: 'hr', area: 'compensation' })
    questions.push({ question: 'Why are you leaving your current job?', expectedAnswer: 'Positive framing focusing on growth, new challenges, and alignment.', difficulty: 'hr', area: 'motivation' })
    if (Array.isArray(experience) && experience.length === 0) {
      questions.push({ question: 'This is your first job. How do you plan to contribute?', expectedAnswer: 'Fresh perspective, eagerness to learn, academic projects, and adaptability.', difficulty: 'hr', area: 'entry_level' })
    }
    questions.push({ question: 'How do you handle work-life balance?', expectedAnswer: 'Boundaries, time management, and examples of sustainable productivity.', difficulty: 'hr', area: 'culture_fit' })
    questions.push({ question: 'What would your manager say about you?', expectedAnswer: 'Positive traits, key contributions, reliability, and team impact.', difficulty: 'hr', area: 'self_awareness' })
    questions.push({ question: 'Describe a time you disagreed with your manager.', expectedAnswer: 'Respectful disagreement, data-driven argument, outcome, and relationship maintained.', difficulty: 'hr', area: 'conflict_resolution' })
    questions.push({ question: 'What questions do you have for us?', expectedAnswer: 'Thoughtful questions about team, growth, tech stack, challenges, and culture.', difficulty: 'hr', area: 'engagement' })
    return questions
  }

  generateSystemDesignQuestions(profile, experience, combinedText, detectedSkills) {
    const questions = []
    const relevantTechs = detectedSkills.filter(s => !['agile', 'scrum', 'git', 'jira'].includes(s)).slice(0, 3)
    const techMention = relevantTechs.length > 0 ? ` using ${relevantTechs.join(' and ')}` : ''
    questions.push({ question: `Design a URL shortener service${techMention}.`, expectedAnswer: 'Requirements gathering, API design, database schema, caching, scaling, monitoring, and trade-offs.', difficulty: 'system_design', area: 'url_shortener' })
    questions.push({ question: 'Design a notification system for a web application.', expectedAnswer: 'Push, email, SMS channels, queueing, retries, fan-out, user preferences, and fallbacks.', difficulty: 'system_design', area: 'notification' })
    questions.push({ question: 'Design an e-commerce product catalog and search.', expectedAnswer: 'Data modeling, indexing, search relevance, caching, CDN, and availability.', difficulty: 'system_design', area: 'ecommerce' })
    questions.push({ question: 'How would you design a real-time chat application?', expectedAnswer: 'WebSocket connections, message queues, presence, history, scaling, and security.', difficulty: 'system_design', area: 'realtime' })
    questions.push({ question: 'Design a rate limiter for a public API.', expectedAnswer: 'Token bucket, sliding window, distributed rate limiting with Redis, and edge caching.', difficulty: 'system_design', area: 'rate_limiting' })
    return questions
  }

  selectLikelyQuestions(allQuestions, experience, projects, detectedSkills) {
    if (!Array.isArray(allQuestions) || allQuestions.length === 0) return []
    const priorityWeights = { introduction: 3, resume_walkthrough: 3, project_overview: 3, system_architecture: 2, problem_solving: 2, leadership: 2, communication: 2, culture_fit: 2, process: 1, learning: 1 }
    const scored = allQuestions.map(q => ({ ...q, score: (priorityWeights[q.area] || 1) + (q.difficulty === 'easy' ? 1 : 0) + (q.difficulty === 'behavioral' ? 1 : 0) + (q.difficulty === 'project' ? 1 : 0) }))
    const unique = []
    const seen = new Set()
    for (const q of scored) {
      const key = `${q.area}-${q.question.slice(0, 20)}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(q)
      }
    }
    unique.sort((a, b) => b.score - a.score)
    return unique.slice(0, 10).map(q => ({ question: q.question, area: q.area, difficulty: q.difficulty }))
  }

  identifyWeakAreas(detectedSkills, experience, projects, allQuestions) {
    const weakAreas = []
    if (detectedSkills.length < 5) weakAreas.push('Limited technical skills demonstrated')
    if (detectedSkills.length < 10) weakAreas.push('Insufficient breadth of technical competencies')
    if (!Array.isArray(experience) || experience.length === 0) weakAreas.push('No professional experience documented')
    if (!Array.isArray(projects) || projects.length === 0) weakAreas.push('No projects showcased')
    const areasCovered = new Set(allQuestions.map(q => q.area))
    if (!areasCovered.has('system_architecture') && !areasCovered.has('scalability')) weakAreas.push('Limited system design experience')
    if (!areasCovered.has('leadership')) weakAreas.push('No leadership experience demonstrated')
    const hasCloud = detectedSkills.some(s => ['aws', 'azure', 'gcp', 'cloud'].some(cloud => s.includes(cloud)))
    if (!hasCloud) weakAreas.push('No cloud platform experience')
    const hasDevOps = detectedSkills.some(s => ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform'].some(d => s.includes(d)))
    if (!hasDevOps) weakAreas.push('Missing DevOps or containerization skills')
    const hasTesting = detectedSkills.some(s => ['testing', 'jest', 'junit', 'selenium', 'cypress', 'tdd', 'bdd'].some(t => s.includes(t)))
    if (!hasTesting) weakAreas.push('Limited testing experience demonstrated')
    const hasSecurity = detectedSkills.some(s => ['security', 'owasp', 'penetration', 'encryption'].some(sec => s.includes(sec)))
    if (!hasSecurity) weakAreas.push('No security expertise shown')
    if (weakAreas.length === 0) weakAreas.push('Resume content insufficient to identify specific weak areas')
    return [...new Set(weakAreas)]
  }

  generatePreparationPlan(weakAreas, detectedSkills, experience, projects) {
    const plan = []
    const hasCloud = detectedSkills.some(s => ['aws', 'azure', 'gcp', 'cloud'].some(cloud => s.includes(cloud)))
    const hasDevOps = detectedSkills.some(s => ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform'].some(d => s.includes(d)))
    const hasTesting = detectedSkills.some(s => ['testing', 'jest', 'junit', 'selenium', 'cypress', 'tdd', 'bdd'].some(t => s.includes(t)))
    const hasSecurity = detectedSkills.some(s => ['security', 'owasp', 'penetration', 'encryption'].some(sec => s.includes(sec)))
    const expCount = Array.isArray(experience) ? experience.length : 0
    const projCount = Array.isArray(projects) ? projects.length : 0
    if (detectedSkills.length < 5) plan.push('Review core technical fundamentals and official language documentation')
    if (!hasCloud) plan.push('Study at least one cloud platform: AWS, Azure, or GCP fundamentals and services')
    if (!hasDevOps) plan.push('Learn containerization with Docker and orchestration with Kubernetes')
    if (!hasTesting) plan.push('Practice writing unit and integration tests using relevant testing frameworks')
    if (!hasSecurity) plan.push('Review OWASP Top 10 and common security vulnerabilities and fixes')
    if (expCount === 0) plan.push('Build 2-3 focused projects demonstrating practical experience')
    if (projCount < 2) plan.push('Document 2-3 projects with clear problem statements and outcomes')
    if (projCount === 0 && expCount === 0) plan.push('Contribute to open source projects or build portfolio pieces')
    if (detectedSkills.length >= 5 && detectedSkills.length < 10) plan.push('Deepen expertise in existing technologies and add complementary skills')
    plan.push('Practice system design with well-known platforms and read architecture blogs')
    plan.push('Prepare STAR method stories for behavioral questions')
    plan.push('Do mock interviews focusing on identified weak areas')
    plan.push('Review and rehearticulate key projects in resume')
    return plan
  }

  generateTalkingPoints(profile, experience, projects, detectedSkills) {
    const talkingPoints = []
    const expCount = Array.isArray(experience) ? experience.length : 0
    const projCount = Array.isArray(projects) ? projects.length : 0
    talkingPoints.push('Opening statement: summary of background, key skills, and what you bring to the role')
    if (expCount > 0) {
      talkingPoints.push('Most impactful project or deliverable in current or most recent role')
      talkingPoints.push('Key technical challenge overcome with measurable results')
      talkingPoints.push('Leadership or collaboration moment that demonstrates soft skills')
    } else {
      talkingPoints.push('Academic projects or self-directed initiatives demonstrating practical skills')
      talkingPoints.push('What you learned from coursework or personal projects')
      talkingPoints.push('How you self-teach and stay updated with technologies')
    }
    if (projCount > 0) {
      const majorProject = projects[0]
      const projName = typeof majorProject.name === 'string' && majorProject.name ? majorProject.name : 'a key project'
      talkingPoints.push(`Deep dive into ${projName}: problem solved, tech stack chosen, outcome achieved`)
    }
    talkingPoints.push('Why you are interested in this company and how your skills solve their problems')
    talkingPoints.push('One area of growth you are actively working on and how you are addressing it')
    const topSkills = detectedSkills.slice(0, 3).join(', ')
    if (topSkills) talkingPoints.push(`Your strongest technical competencies: ${topSkills}`)
    return talkingPoints
  }

  generateSummaryText(overallReadiness, preparationGrade, detectedSkills, experience, projects, isSenior) {
    const expCount = Array.isArray(experience) ? experience.length : 0
    const projCount = Array.isArray(projects) ? projects.length : 0
    const strengths = []
    if (expCount >= 3) strengths.push('solid professional experience')
    if (projCount >= 2) strengths.push('diverse project portfolio')
    if (detectedSkills.length >= 10) strengths.push('broad technical skill set')
    if (isSenior) strengths.push('senior-level expertise')
    const strengthText = strengths.length > 0 ? `Strengths include ${strengths.join(', ')}.` : 'Build more experience and projects.'
    const weaknesses = []
    if (expCount === 0) weaknesses.push('limited or no professional experience')
    if (detectedSkills.length < 5) weaknesses.push('narrow skill breadth')
    if (projCount === 0) weaknesses.push('no showcased projects')
    if (!isSenior) weaknesses.push('may need more senior-level exposure')
    const weaknessText = weaknesses.length > 0 ? `Areas for improvement: ${weaknesses.join(', ')}.` : 'Generally well-rounded.'
    if (overallReadiness >= 80) return `Strong readiness for interview with a grade of ${preparationGrade}. ${strengthText} ${weaknessText} Focus on refining storytelling and system design practice.`
    if (overallReadiness >= 60) return `Moderate readiness with a grade of ${preparationGrade}. ${strengthText} However, ${weaknessText} Prioritize hands-on practice and deeper technical study.`
    return `Low readiness with a grade of ${preparationGrade}. ${weaknessText} ${strengthText} Focus on building foundational knowledge, completing projects, and gaining practical experience.`
  }

  normalizeArray(arr) {
    if (!Array.isArray(arr)) return []
    return arr.map(item => typeof item === 'string' ? item.trim() : '').filter(Boolean)
  }

  getGradeDistribution(questions) {
    const distribution = { easy: 0, medium: 0, hard: 0, behavioral: 0, technical: 0, project: 0, hr: 0, system_design: 0 }
    for (const category of Object.keys(questions)) {
      if (Array.isArray(questions[category])) {
        distribution[category] = questions[category].length
      }
    }
    return distribution
  }

  getInsights(detectedSkills, experience, projects) {
    const insights = {
      topSkills: detectedSkills.slice(0, 5),
      experienceLevel: Array.isArray(experience) ? experience.length : 0,
      projectCount: Array.isArray(projects) ? projects.length : 0,
      seniorityIndicators: detectedSkills.filter(s => ['architect', 'lead', 'principal', 'staff'].some(level => s.includes(level))),
      cloudProfile: detectedSkills.filter(s => ['aws', 'azure', 'gcp', 'cloud'].some(c => s.includes(c))),
      devopsProfile: detectedSkills.filter(s => ['docker', 'kubernetes', 'jenkins', 'terraform', 'cicd'].some(d => s.includes(d)))
    }
    return insights
  }
}

module.exports = new InterviewPrepEngine()
