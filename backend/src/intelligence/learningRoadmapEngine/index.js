class LearningRoadmapEngine {
  constructor() {
    this.complexityMap = {
      programming: 12,
      framework: 8,
      tool: 4,
      soft: 6,
      methodology: 4
    };

    this.categoryPatterns = {
      programming: /(?:javascript|python|java|c\+\+|c sharp|c#|ruby|go|golang|rust|typescript|php|swift|kotlin|scala|perl|matlab|r\b|sql|html|css|assembly|bash|shell|powershell|kotlin|dart|flutter)/gi,
      framework: /(?:react|vue|angular|express|django|flask|spring|spring boot|rails|laravel|next\.?js|node\.?js|asp\.net|jquery|bootstrap|tailwind|svelte|ember|backbone|fastapi|flask|rails|symfony|codeigniter|xamarin|ionic)/gi,
      tool: /(?:git|docker|kubernetes|k8s|aws|azure|gcp|amazon web services|jenkins|terraform|ansible|webpack|babel|eslint|linux|nginx|apache|postman|figma|photoshop|illustrator|jira|confluence|notion|slack|trello|asana|github actions|gitlab ci|circleci|travis ci|sonarqube|newrelic|datadog|splunk|grafana|prometheus|kafka|rabbitmq|redis|mongodb|mysql|postgresql|oracle|mariadb)/gi,
      soft: /(?:communication|leadership|teamwork|team work|problem.?solving|time.?management|adaptability|critical.?thinking|creativity|conflict.?resolution|negotiation|public.?speaking|presentation|emotional.?intelligence|empathy|collaboration|mentoring|coaching)/gi,
      methodology: /(?:agile|scrum|kanban|waterfall|devops|ci\/cd|tdd|bdd|project.?management|lean|six.?sigma|design.?thinking|product.?management|sprint|retrospective|user.?story|backlog|roadmapping|okr|kpi)/gi
    };

    this.resources = {
      javascript: { free: ['MDN Web Docs JavaScript Guide', 'freeCodeCamp JavaScript Course', 'JavaScript.info', 'Eloquent JavaScript (book)'] },
      python: { free: ['Python.org Official Tutorial', 'Automate the Boring Stuff with Python', 'freeCodeCamp Python Course', 'Python for Everybody (Coursera)'] },
      java: { free: ['Official Java Tutorials', 'Codecademy Java Course', 'University of Helsinki Java MOOC', 'Java Programming (YouTube)'] },
      react: { free: ['Official React Documentation', 'freeCodeCamp React Course', 'React Tutorial (YouTube)', 'Scrimba React Course'] },
      node: { free: ['Official Node.js Documentation', 'NodeSchool.io', 'freeCodeCamp Back End Course', 'The Odin Project'] },
      docker: { free: ['Docker Official Tutorial', 'Docker for Beginners', 'freeCodeCamp Docker Course', 'Play with Docker'] },
      aws: { free: ['AWS Free Tier & Documentation', 'AWS Cloud Practitioner Essentials', 'freeCodeCamp AWS Course', 'AWS Skill Builder (free tier)'] },
      git: { free: ['Git Official Documentation', 'Pro Git Book (free)', 'freeCodeCamp Git Course', 'GitHub Skills'] },
      sql: { free: ['SQLBolt', 'W3Schools SQL Tutorial', 'Mode Analytics SQL Tutorial', 'Khan Academy SQL'] },
      mongodb: { free: ['MongoDB University Free Courses', 'MongoDB Official Documentation', 'freeCodeCamp MongoDB Course'] },
      typescript: { free: ['TypeScript Handbook', 'freeCodeCamp TypeScript Course', 'TypeScript Deep Dive (book)', 'Official TypeScript Docs'] },
      html: { free: ['MDN Web Docs HTML', 'freeCodeCamp HTML Course', 'W3Schools HTML Tutorial'] },
      css: { free: ['MDN Web Docs CSS', 'freeCodeCamp CSS Course', 'CSS Tricks', 'Kevin Powell (YouTube)'] },
      linux: { free: ['Linux Journey', 'freeCodeCamp Linux Course', 'The Linux Command Handbook', 'OverTheWire Bandit'] },
      kubernetes: { free: ['Kubernetes Basics', 'Kubernetes Documentation', 'freeCodeCamp Kubernetes Course', 'Katacoda K8s Scenarios'] },
      graphql: { free: ['Official GraphQL Documentation', 'How to GraphQL', 'freeCodeCamp GraphQL Course'] },
      webpack: { free: ['Official Webpack Documentation', 'Webpack Academy', 'freeCodeCamp Webpack Course', 'SurviveJS Webpack Book'] }
    };

    this.skillProjects = {
      javascript: ['Build a To-Do List App', 'Create a Weather Dashboard', 'Develop a Real-time Chat App', 'Build a Quiz Game with Timer'],
      python: ['Web Scraper for Price Tracking', 'Data Analysis on Public Datasets', 'Task Automation Script', 'Machine Learning Sentiment Analyzer'],
      java: ['Build a Console Banking App', 'Create a CRUD API', 'Develop a Desktop Chat Client', 'Build a Spring Boot REST Service'],
      react: ['E-commerce Product Gallery', 'Social Media Dashboard Clone', 'Task Management Kanban Board', 'Real-time Notifications Feed'],
      node: ['RESTful API with Express', 'Authentication Microservice', 'Real-time Chat Backend', 'File Upload Service'],
      docker: ['Containerize a Node.js App', 'Docker Compose Multi-service Setup', 'CI/CD Pipeline with Docker', 'Load Balancer with Docker Swarm'],
      aws: ['Deploy a Static Site on S3', 'Serverless Function with Lambda', 'RDS Database Setup', 'CloudWatch Monitoring Dashboard'],
      git: ['Open Source Contribution', 'Branching Strategy Implementation', 'Automated Release Workflow', 'Git Hooks Setup'],
      sql: ['Database Design for E-commerce', 'Data Export and Reporting Query', 'Stored Procedures Implementation', 'Query Optimization Project'],
      mongodb: ['User Profile Database', 'Blog Content Store', 'Real-time Analytics Pipeline', 'Aggregation Framework Demo'],
      typescript: ['Type-safe Todo App', 'Library with Generic Types', 'React App with TypeScript', 'Node.js API with TS'],
      html: ['Personal Portfolio Page', 'Accessible Landing Page', 'Email Template Design', 'Interactive Form with Validation'],
      css: ['Responsive Grid Layouts', 'CSS Animation Showcase', 'Dark Mode Theme Implementation', 'Mobile-first Navigation'],
      linux: ['Shell Script Automation', 'System Monitoring Script', 'LAMP Stack Setup on Linux', 'Custom Bash Aliases and Functions'],
      kubernetes: ['Deploy a Microservice on K8s', 'Auto-scaling Configuration', 'Secret Management Setup', 'Helm Chart Creation'],
      graphql: ['GraphQL API with Apollo', 'Real-time Subscriptions Server', 'Schema Stitching Example', 'Client-side Caching Setup'],
      webpack: ['Custom Webpack Configuration', 'Code Splitting Implementation', 'Asset Pipeline Optimization', 'Development vs Production Builds']
    };

    this.defaultResources = ['freeCodeCamp', 'MDN Web Docs', 'W3Schools', 'GeeksforGeeks', 'Official Documentation', 'YouTube tutorials and playlists', 'GitHub open source examples'];
    this.defaultProjects = ['Build a portfolio project', 'Create a proof of concept', 'Follow intermediate tutorials', 'Participate in coding challenges'];
  }

  analyze(normalizedDoc, skillsData = {}, analysis = {}) {
    const resumeSkills = this._extractResumeSkills(normalizedDoc);
    const targetRole = this._parseTargetRole(skillsData);
    const existingSkillNames = this._normalizeList(resumeSkills);

    const criticalSkills = [];
    const importantSkills = [];
    const optionalSkills = [];

    const criticalTarget = targetRole.critical || [];
    const importantTarget = targetRole.important || [];
    const optionalTarget = targetRole.optional || [];

    for (const skill of criticalTarget) {
      if (!this._skillPresent(existingSkillNames, skill.name)) {
        const category = this._categorizeSkill(skill.name);
        const estimatedTime = this._estimateLearningTime(skill.name, category);
        criticalSkills.push({
          name: skill.name,
          reason: this._buildCriticalReason(skill),
          estimatedTime,
          currentLevel: 0,
          priority: 'critical',
          suggestedProjects: this._getProjects(skill.name),
          resources: this._getResources(skill.name),
          category
        });
      }
    }

    for (const skill of importantTarget) {
      const relatedExisting = this._findRelatedSkill(existingSkillNames, skill.name);
      if (!this._skillPresent(existingSkillNames, skill.name) || relatedExisting) {
        const category = this._categorizeSkill(skill.name);
        const estimatedTime = this._estimateLearningTime(skill.name, category);
        const currentLevel = relatedExisting ? this._estimateProficiency(relatedExisting) : 0;
        importantSkills.push({
          name: skill.name,
          reason: this._buildImportantReason(skill, relatedExisting),
          estimatedTime,
          currentLevel,
          priority: 'important',
          suggestedProjects: this._getProjects(skill.name),
          resources: this._getResources(skill.name),
          category
        });
      }
    }

    for (const skill of optionalTarget) {
      if (!this._skillPresent(existingSkillNames, skill.name)) {
        const category = this._categorizeSkill(skill.name);
        const estimatedTime = this._estimateLearningTime(skill.name, category);
        optionalSkills.push({
          name: skill.name,
          reason: 'Emerging technology or nice-to-have for the target role',
          estimatedTime,
          currentLevel: 0,
          priority: 'optional',
          suggestedProjects: this._getProjects(skill.name),
          resources: this._getResources(skill.name),
          category
        });
      }
    }

    const allSkills = [...criticalSkills, ...importantSkills, ...optionalSkills];
    const totalWeeks = allSkills.reduce((sum, s) => sum + (s.estimatedTime || 0), 0);
    const recommendedOrder = this._buildRecommendedOrder(allSkills);
    const weeklyPlan = this._buildWeeklyPlan(allSkills, totalWeeks);
    const overallPriority = this._computeOverallPriority(criticalSkills, importantSkills, optionalSkills);
    const summary = this._buildSummary(overallPriority, totalWeeks, criticalSkills, importantSkills, optionalSkills);

    return {
      overallPriority,
      learningEta: totalWeeks,
      criticalSkills,
      importantSkills,
      optionalSkills,
      recommendedOrder,
      weeklyPlan,
      summary,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  _extractResumeSkills(doc) {
    if (!doc || typeof doc !== 'object') return [];
    if (Array.isArray(doc)) return doc.filter(item => typeof item === 'string');
    const candidates = [];
    if (Array.isArray(doc.skills)) candidates.push(...doc.skills);
    if (Array.isArray(doc.extractedSkills)) candidates.push(...doc.extractedSkills);
    if (Array.isArray(doc.technicalSkills)) candidates.push(...doc.technicalSkills);
    if (Array.isArray(doc.softSkills)) candidates.push(...doc.softSkills);
    if (typeof doc.skills === 'string') {
      const parsed = doc.skills.split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean);
      candidates.push(...parsed);
    }
    if (doc.content && typeof doc.content === 'string') {
      const regex = /\b([A-Za-z][A-Za-z0-9\+#\.]{2,})\b/g;
      let match;
      while ((match = regex.exec(doc.content)) !== null) {
        candidates.push(match[1]);
      }
    }
    return candidates.filter(item => typeof item === 'string' && item.trim().length > 0);
  }

  _parseTargetRole(skillsData) {
    if (!skillsData || typeof skillsData !== 'object') {
      return { critical: [], important: [], optional: [] };
    }
    if (skillsData.targetRole && typeof skillsData.targetRole === 'object') {
      const role = skillsData.targetRole;
      return {
        critical: Array.isArray(role.required) ? role.required.map(s => this._normalizeSkillEntry(s)) : [],
        important: Array.isArray(role.preferred) ? role.preferred.map(s => this._normalizeSkillEntry(s)) : [],
        optional: Array.isArray(role.niceToHave) ? role.niceToHave.map(s => this._normalizeSkillEntry(s)) : []
      };
    }
    if (skillsData.criticalSkills || skillsData.importantSkills || skillsData.optionalSkills) {
      return {
        critical: Array.isArray(skillsData.criticalSkills) ? skillsData.criticalSkills.map(s => this._normalizeSkillEntry(s)) : [],
        important: Array.isArray(skillsData.importantSkills) ? skillsData.importantSkills.map(s => this._normalizeSkillEntry(s)) : [],
        optional: Array.isArray(skillsData.optionalSkills) ? skillsData.optionalSkills.map(s => this._normalizeSkillEntry(s)) : []
      };
    }
    return { critical: [], important: [], optional: [] };
  }

  _normalizeSkillEntry(entry) {
    if (typeof entry === 'string') {
      return { name: entry.trim(), frequency: 1.0 };
    }
    if (entry && typeof entry === 'object') {
      return {
        name: (entry.name || entry.skill || '').trim(),
        frequency: typeof entry.frequency === 'number' ? entry.frequency : (typeof entry.frequency === 'string' ? parseFloat(entry.frequency) : 1.0)
      };
    }
    return { name: '', frequency: 1.0 };
  }

  _normalizeList(skills) {
    return skills.map(s => typeof s === 'string' ? s.toLowerCase().trim() : String(s).toLowerCase().trim()).filter(Boolean);
  }

  _skillPresent(skills, name) {
    if (!name) return false;
    const target = name.toLowerCase().trim();
    return skills.some(s => {
      if (s === target) return true;
      if (s.includes(target) || target.includes(s)) return true;
      return this._isAlias(s, target);
    });
  }

  _isAlias(skillA, skillB) {
    const aliases = {
      'node.js': ['node', 'nodejs', 'node js'],
      'node': ['node.js', 'nodejs', 'node js'],
      'c#': ['c sharp', 'csharp', 'c sharp'],
      'c++': ['cpp', 'c plus plus'],
      'react.js': ['reactjs', 'react js', 'react'],
      'vue.js': ['vuejs', 'vue js', 'vue'],
      'aws': ['amazon web services', 'amazon aws'],
      'azure': ['microsoft azure', 'azure cloud'],
      'gcp': ['google cloud platform', 'google cloud', 'google cloud gcp'],
      'ci/cd': ['continuous integration', 'continuous deployment', 'cicd'],
      'ui/ux': ['user interface', 'user experience', 'ui ux', 'uiux'],
      'machine learning': ['ml', 'machinelearning'],
      'artificial intelligence': ['ai'],
      'natural language processing': ['nlp'],
      'postgresql': ['postgres', 'postgre sql'],
      'mongodb': ['mongo', 'mongo db'],
      'mysql': ['my sql'],
      'javascript': ['js', 'ecmascript'],
      'typescript': ['ts'],
      'frontend': ['front-end', 'front end', 'frontend development'],
      'backend': ['back-end', 'back end', 'backend development'],
      'fullstack': ['full-stack', 'full stack', 'fullstack development']
    };

    const groupA = aliases[skillA] || [];
    const groupB = aliases[skillB] || [];

    if (groupA.includes(skillB)) return true;
    if (groupB.includes(skillA)) return true;

    const baseA = skillA.replace(/\.js$/i, '').replace(/\s+/g, '');
    const baseB = skillB.replace(/\.js$/i, '').replace(/\s+/g, '');
    if (baseA === baseB) return true;

    return false;
  }

  _categorizeSkill(name) {
    if (!name) return 'tool';
    const lower = name.toLowerCase();
    let matched = false;
    for (const [category, pattern] of Object.entries(this.categoryPatterns)) {
      pattern.lastIndex = 0;
      if (pattern.test(lower)) {
        matched = true;
        const count = (lower.match(pattern) || []).length;
        if (count >= 1) return category;
      }
    }
    if (!matched) {
      if (/\d+$/.test(lower)) return 'tool';
      if (lower.length > 12) return 'programming';
    }
    return 'tool';
  }

  _estimateLearningTime(name, category) {
    const base = this.complexityMap[category] || 4;
    const length = name.replace(/\s+/g, '').length;
    if (length <= 3) return base + 4;
    if (length <= 6) return base + 2;
    if (length <= 10) return base + 1;
    if (length <= 15) return base;
    if (length <= 20) return base + 1;
    return base + 2;
  }

  _estimateProficiency(skillName) {
    const name = skillName.toLowerCase();
    if (name.length <= 4) return 4;
    if (name.length <= 8) return 3;
    return 2;
  }

  _buildCriticalReason(skill) {
    const freq = typeof skill.frequency === 'number' ? Math.round(skill.frequency * 100) : 100;
    if (freq >= 80) {
      return `Appears in ${freq}% of target role job descriptions but missing from resume`;
    }
    return `Core requirement for target role, missing from resume`;
  }

  _buildImportantReason(skill, relatedExisting) {
    if (relatedExisting) {
      return `Complements existing skill: ${relatedExisting}`;
    }
    return `Required for target role advancement`;
  }

  _getProjects(name) {
    const lower = name.toLowerCase().trim();
    if (this.skillProjects[lower]) return this.skillProjects[lower];
    const aliases = {
      'vue.js': 'vue', 'vuejs': 'vue', 'vue js': 'vue',
      'react.js': 'react', 'reactjs': 'react', 'react js': 'react',
      'angular.js': 'angular', 'angularjs': 'angular',
      'node.js': 'node', 'nodejs': 'node', 'node js': 'node',
      'express.js': 'express', 'expressjs': 'express',
      'next.js': 'next', 'nextjs': 'next',
      'jquery': 'jquery',
      'bootstrap': 'bootstrap',
      'tailwind': 'tailwind',
      'spring': 'spring',
      'spring boot': 'spring',
      'laravel': 'laravel',
      'rails': 'rails',
      'flask': 'flask',
      'django': 'django',
      'asp.net': 'asp',
      'c#': 'c#',
      'c++': 'c++',
      'c sharp': 'c#',
      'typescript': 'typescript',
      'graphql': 'graphql',
      'redis': 'redis',
      'kafka': 'kafka',
      'rabbitmq': 'rabbitmq',
      'nginx': 'nginx',
      'linux': 'linux',
      'postgresql': 'sql',
      'mysql': 'sql',
      'mongodb': 'mongodb',
      'firebase': 'javascript',
      'redux': 'react',
      'tailwindcss': 'tailwind',
      'figma': 'figma',
      'photoshop': 'photoshop',
      'illustrator': 'illustrator',
      'jira': 'jira',
      'confluence': 'confluence',
      'notion': 'notion',
      'slack': 'slack',
      'trello': 'trello',
      'asana': 'asana',
      'terraform': 'terraform',
      'ansible': 'ansible',
      'jenkins': 'jenkins',
      'github actions': 'github actions',
      'gitlab ci': 'gitlab ci',
      'selenium': 'selenium',
      'jest': 'jest',
      'mocha': 'mocha',
      'pytest': 'python',
      'junit': 'java',
      'scala': 'scala',
      'go': 'go',
      'golang': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'dart': 'dart',
      'flutter': 'flutter'
    };

    const canonical = aliases[lower] || lower;
    if (this.skillProjects[canonical]) return this.skillProjects[canonical];
    const category = this._categorizeSkill(name);
    const generic = {
      programming: [`Complete ${name} fundamentals`, `Practice algorithm challenges with ${name}`, `Build utilities with ${name}`, `Contribute to ${name} open source`],
      framework: [`Learn ${name} core patterns`, `Build a sample application`, `Create reusable components`, `Integrate with an API`],
      tool: [`Configure ${name} in a project`, `Complete official tutorials`, `Automate a workflow`, `Document setup process`],
      soft: [`Apply ${name} in teamwork settings`, `Seek feedback on ${name}`, `Train others on ${name}`, `Reflect and improve`],
      methodology: [`Study ${name} principles`, `Implement in a project`, `Run a retrospective`, `Document process improvements`]
    };
    return generic[category] || [`Explore ${name} basics`, `Follow beginner to intermediate guides`, `Build a practice project`, `Join community discussions`];
  }

  _getResources(name) {
    const lower = name.toLowerCase().trim();
    const aliased = {
      'vue.js': 'vue', 'vuejs': 'vue',
      'react.js': 'reactjs', 'reactjs': 'react', 'react js': 'react',
      'angular.js': 'angularjs', 'angularjs': 'angular',
      'node.js': 'node', 'nodejs': 'node', 'node js': 'node',
      'express.js': 'express',
      'next.js': 'next',
      'c#': 'c#', 'c sharp': 'c#',
      'c++': 'c++',
      'postgresql': 'sql',
      'mysql': 'sql',
      'graphql': 'graphql'
    };
    const key = aliased[lower] || lower;
    if (this.resources[key]) return this.resources[key].free;
    if (this.resources[lower]) return this.resources[lower].free;
    return [...this.defaultResources];
  }

  _findRelatedSkill(skills, targetName) {
    const target = targetName.toLowerCase().trim();
    const relationships = {
      'react': ['javascript', 'frontend', 'web', 'html', 'css', 'redux', 'node'],
      'vue': ['javascript', 'frontend', 'web', 'html', 'css', 'vuex', 'node'],
      'angular': ['javascript', 'typescript', 'frontend', 'web', 'html', 'css'],
      'node.js': ['javascript', 'backend', 'server', 'express', 'api'],
      'python': ['django', 'flask', 'data science', 'machine learning', 'pandas', 'numpy'],
      'docker': ['devops', 'ci/cd', 'cloud', 'kubernetes', 'linux'],
      'kubernetes': ['docker', 'devops', 'cloud', 'linux'],
      'aws': ['cloud', 'devops', 'docker', 'linux'],
      'machine learning': ['python', 'data science', 'ai', 'numpy', 'pandas'],
      'data science': ['python', 'sql', 'statistics', 'machine learning'],
      'project management': ['agile', 'scrum', 'leadership', 'communication'],
      'agile': ['scrum', 'kanban', 'project management', 'teamwork'],
      'sql': ['database', 'mysql', 'postgresql', 'mongodb', 'data'],
      'mongodb': ['nosql', 'database', 'node', 'javascript'],
      'typescript': ['javascript', 'react', 'node', 'angular', 'vue'],
      'linux': ['bash', 'shell', 'docker', 'devops', 'git'],
      'figma': ['design', 'ui', 'ux', 'prototyping'],
      'jenkins': ['ci/cd', 'devops', 'docker', 'git'],
      'terraform': ['devops', 'cloud', 'aws', 'azure', 'gcp'],
      'ansible': ['devops', 'linux', 'docker', 'cloud'],
      'graphql': ['api', 'node', 'react', 'javascript', 'backend'],
      'redux': ['react', 'javascript', 'state management'],
      'tailwind': ['css', 'html', 'frontend', 'react', 'vue'],
      'bootstrap': ['css', 'html', 'frontend', 'javascript'],
      'firebase': ['javascript', 'node', 'database', 'authentication', 'react']
    };

    const candidates = relationships[target] || [];
    for (const skill of skills) {
      if (candidates.contains || candidates.includes(skill)) return skill;
    }
    return null;
  }

  _buildRecommendedOrder(skills) {
    const priorityWeight = { critical: 0, important: 1, optional: 2 };
    const sorted = [...skills].sort((a, b) => {
      const pa = priorityWeight[a.priority] ?? 1;
      const pb = priorityWeight[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      const ta = a.estimatedTime || 0;
      const tb = b.estimatedTime || 0;
      return ta - tb;
    });
    return sorted.map(s => s.name);
  }

  _buildWeeklyPlan(skills, totalWeeks) {
    if (!skills.length) return [];
    const weeks = Math.max(1, Math.ceil(totalWeeks));
    const plan = [];
    let currentWeek = 1;
    let remaining = weeks;

    for (const skill of skills) {
      const skillWeeks = Math.max(1, Math.round(skill.estimatedTime || 1));
      const allocated = Math.min(skillWeeks, remaining);
      plan.push({
        week: currentWeek,
        skill: skill.name,
        duration: allocated,
        priority: skill.priority,
        category: skill.category,
        objectives: this._buildWeeklyObjectives(skill, allocated),
        tasks: this._buildWeeklyTasks(skill, allocated, currentWeek)
      });
      currentWeek += allocated;
      remaining -= allocated;
      if (remaining <= 0) break;
    }

    return plan;
  }

  _buildWeeklyObjectives(skill, weeks) {
    const base = [`Master ${skill.name} fundamentals`, `Apply ${skill.name} in practical scenarios`];
    if (weeks > 1) base.push(`Build advanced proficiency in ${skill.name}`);
    if (weeks > 2) base.push(`Complete a full project using ${skill.name}`);
    return base;
  }

  _buildWeeklyTasks(skill, weeks, currentWeek) {
    const taskSet = {
      programming: [
        [`Week 1: Setup environment and learn syntax`, `Complete 20 coding exercises`, `Build a simple script`],
        [`Week 2: Deepen understanding of core concepts`, `Solve 15 medium problems`, `Add error handling`],
        [`Week 3: Integrate with existing tech stack`, `Develop a complete application`, `Write unit tests`]
      ],
      framework: [
        [`Week 1: Install framework and create project scaffold`, `Complete official tutorial`, `Build a single component`],
        [`Week 2: Learn routing and state management`, `Create multi-view app`, `Handle data fetching`],
        [`Week 3: Implement advanced features`, `Add authentication`, `Deploy to staging`]
      ],
      tool: [
        [`Week 1: Install and configure tool`, `Run basic commands`, `Document setup process`],
        [`Week 2: Explore advanced features`, `Integrate with development workflow`, `Troubleshoot common issues`]
      ],
      soft: [
        [`Week 1: Study key principles`, `Practice in low-stakes settings`, `Record self-assessment`],
        [`Week 2: Apply in team or real scenario`, `Seek constructive feedback`, `Iterate on approach`]
      ],
      methodology: [
        [`Week 1: Learn terminology and principles`, `Read case studies`, `Map current process`],
        [`Week 2: Pilot methodology on small project`, `Document outcomes`, `Identify improvements`]
      ]
    };

    const tasks = taskSet[skill.category] || [
      [`Week 1: Research ${skill.name} fundamentals`, `Find beginner resources`, `Create learning notes`],
      [`Week 2: Complete basic tutorials`, `Build simple project`, `Review progress`]
    ];
    const selected = [];
    const maxWeeks = Math.max(0, weeks - 1);
    for (let i = 0; i <= maxWeeks && i < tasks.length; i++) {
      selected.push(...tasks[i].map(t => t.replace(/Week \d+:/, `Week ${currentWeek}:`)));
    }
    return selected.length ? selected : [`Complete introduction to ${skill.name}`, `Build a practice project`, `Review and document`];
  }

  _computeOverallPriority(critical, important, optional) {
    const total = critical + important + optional;
    if (critical >= 5) return 'high';
    if (critical >= 2 && important >= 2) return 'high';
    if (critical >= 2) return 'high';
    if (critical >= 1) {
      if (important >= 2) return 'high';
      return 'medium';
    }
    if (important >= 3) return 'medium';
    if (total > 0) return 'low';
    return 'low';
  }

  _buildSummary(priority, totalWeeks, critical, important, optional) {
    const parts = [];
    parts.push(`Learning roadmap generated with ${priority} overall priority.`);
    parts.push(`Estimated total learning time: ${totalWeeks} weeks.`);
    if (critical.length > 0) {
      parts.push(`${critical.length} critical skill(s) require immediate attention.`);
    }
    if (important.length > 0) {
      parts.push(`${important.length} important skill(s) complement your existing profile.`);
    }
    if (optional.length > 0) {
      parts.push(`${optional.length} optional enhancement(s) available.`);
    }
    if (critical.length > 0) {
      parts.push('Recommended approach: Focus on critical skills first, then proceed to important ones.');
    } else if (important.length > 0) {
      parts.push('Recommended approach: Strengthen important skills and consider optional additions later.');
    } else {
      parts.push('Recommended approach: Continue building on existing strengths.');
    }
    return parts.join(' ');
  }
}

module.exports = new LearningRoadmapEngine();
