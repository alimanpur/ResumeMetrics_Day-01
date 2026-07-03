class ProjectIntelligenceEngine {
    constructor() {
        this.techKeywords = [
            'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin',
            'react', 'angular', 'vue', 'svelte', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'fastapi',
            'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'sqlite',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'circleci', 'github actions', 'gitlab ci',
            'tensorflow', 'pytorch', 'pandas', 'numpy', 'spark', 'hadoop', 'scikit-learn',
            'graphql', 'rest', 'api', 'microservices', 'serverless', 'soap',
            'git', 'webpack', 'babel', 'eslint', 'jest', 'mocha', 'cypress', 'selenium',
            'android', 'ios', 'flutter', 'react native', 'swiftui', 'kotlin',
            'nginx', 'apache', 'linux', 'bash', 'shell', 'powershell',
            'figma', 'adobe xd', 'photoshop',
            'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
            'oauth', 'jwt', 'https', 'ssl', 'tls'
        ];
        
        this.complexityKeywords = [
            'microservices', 'distributed', 'scalable', 'real-time', 'high availability', 'fault tolerant',
            'machine learning', 'deep learning', 'blockchain', 'iot', 'security', 'encryption',
            'cloud', 'containerization', 'orchestration', 'streaming', 'data pipeline', 'etl',
            'caching', 'load balanc', 'algorithm optimization', 'concurrency', 'parallel processing'
        ];
        
        this.businessKeywordSets = {
            revenue: ['revenue', 'sales', 'income', 'profit', 'earnings', 'monetized', 'roi', 'return on investment'],
            users: ['users', 'ma u', 'dau', 'wau', 'engagement', 'audience', 'customers', 'clients', 'downloads', 'installs'],
            efficiency: ['efficiency', 'optimization', 'optimized', 'automated', 'streamlined', 'performance', 'latency', 'throughput'],
            cost: ['cost savings', 'savings', 'reduced cost', 'budget', 'expense reduction', 'cut costs', 'spent']
        };
        
        this.leadershipKeywords = ['led', 'managed', 'headed', 'directed', 'coordinated', 'mentored', 'architected', 'spearheaded', 'initiated'];
        this.impactKeywords = ['improved', 'increased', 'reduced', 'saved', 'launched', 'delivered', 'built', 'created', 'designed', 'deployed'];
        this.prestigeKeywords = ['hackathon', 'competition', 'award', 'winner', 'top', 'first place', 'finalist', 'published', 'research'];
        this.innovationKeywords = ['novel', 'innovative', 'unique', 'first', 'pioneer', 'original', 'patent', 'proprietary', 'breakthrough', 'groundbreaking', 'state-of-the-art', 'cutting-edge', 'new'];
        
        this.metricPatterns = [
            /\$[\d,]+(?:\.\d+)?\s*(?:million|billion|k|m|b)?\b/gi,
            /\b\d{2,}(?:,\d{3})*(?:\.\d+)?\s*(?:users|customers|clients|requests|transactions|downloads|visits|orders|signups|appointments)\b/gi,
            /\b\d+(?:\.\d+)?\s*(?:x|times)\s*(?:faster|improvement|increase|decrease|reduction|gain)\b/gi,
            /\b\d+(?:\.\d+)?\s*(?:%|percent)\b/gi,
            /\b\d+(?:\.\d+)?\s*(?:ms|milliseconds|seconds|minutes|hours)\b/gi,
            /\b(?:increased|decreased|improved|reduced|saved|grew|cut|boosted)\b[^.]*?\d+/gi,
            /\b\d+[^.]*?\b(?:increase|decrease|improvement|reduction|saving|growth|boost)\b/gi
        ];
    }
    
    analyze(normalizedDoc) {
        if (!normalizedDoc || !Array.isArray(normalizedDoc.sections)) {
            return this._getEmptyResult();
        }
        
        const projectSection = normalizedDoc.sections.find(section => section.type === 'projects');
        if (!projectSection || !projectSection.content) {
            return this._getEmptyResult();
        }
        
        const projects = this._extractProjects(projectSection.content);
        if (projects.length === 0) {
            return this._getEmptyResult();
        }
        
        const analyzedProjects = projects.map(project => {
            const difficulty = this._analyzeDifficulty(project);
            const businessValue = this._analyzeBusinessValue(project);
            const resumeValue = this._analyzeResumeValue(project);
            const interviewProbability = this._analyzeInterviewProbability(project);
            const innovation = this._analyzeInnovation(project);
            const technicalBreadth = this._analyzeTechnicalBreadth(project);
            const missingDocumentation = this._detectMissingDocumentation(project);
            const missingMetrics = this._detectMissingMetrics(project);
            const projectScore = this._calculateProjectScore({
                businessValue,
                resumeValue,
                interviewProbability,
                innovation,
                technicalBreadth,
                difficulty,
                missingDocumentation,
                missingMetrics
            });
            
            return {
                name: project.name,
                description: project.description,
                technologies: project.technologies,
                difficulty,
                businessValue,
                resumeValue,
                interviewProbability,
                innovation,
                technicalBreadth,
                missingDocumentation,
                missingMetrics,
                projectScore,
                grade: this._getGrade(projectScore)
            };
        });
        
        const totalProjects = analyzedProjects.length;
        const averageScore = Math.round(analyzedProjects.reduce((sum, project) => sum + project.projectScore, 0) / totalProjects);
        const topProject = analyzedProjects.reduce((top, project) => project.projectScore > top.projectScore ? project : top, analyzedProjects[0]);
        const missingDocs = analyzedProjects.filter(p => p.missingDocumentation).map(p => p.name);
        const missingMetricProjects = analyzedProjects.filter(p => p.missingMetrics).map(p => p.name);
        const summary = this._generateSummary(totalProjects, averageScore);
        const recommendations = this._generateRecommendations(analyzedProjects, missingDocs, missingMetricProjects);
        const scoreDistribution = this._calculateScoreDistribution(analyzedProjects);
        
        return {
            totalProjects,
            projects: analyzedProjects,
            averageScore,
            topProject,
            missingDocumentation: missingDocs,
            missingMetrics: missingMetricProjects,
            summary,
            recommendations,
            scoreDistribution
        };
    }
    
    _extractProjects(text) {
        if (!text || typeof text !== 'string') return [];
        
        const projects = [];
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        let currentProject = null;
        let currentContent = [];
        
        const strongPattern = /\*\*.*\*\*/;
        
        for (const line of lines) {
            const isStrong = strongPattern.test(line);
            const cleanLine = line.replace(/\*\*/g, '').trim();
            
            if (isStrong && this._looksLikeProjectHeader(cleanLine)) {
                if (currentProject) {
                    currentProject.description = currentContent.join('\n').trim();
                    currentProject.technologies = this._extractTechnologies(currentProject.description + ' ' + currentProject.name);
                    projects.push(currentProject);
                }
                currentProject = {
                    name: cleanLine,
                    description: '',
                    technologies: []
                };
                currentContent = [];
            } else if (currentProject) {
                currentContent.push(line);
            }
        }
        
        if (currentProject) {
            currentProject.description = currentContent.join('\n').trim();
            currentProject.technologies = this._extractTechnologies(currentProject.description + ' ' + currentProject.name);
            projects.push(currentProject);
        }
        
        if (projects.length === 0 && text.trim().length > 0) {
            const fallback = {
                name: 'General Projects',
                description: text.trim(),
                technologies: this._extractTechnologies(text)
            };
            projects.push(fallback);
        }
        
        return projects;
    }
    
    _looksLikeProjectHeader(text) {
        const lower = text.toLowerCase();
        const skipTerms = ['technologies', 'tech stack', 'skills', 'description', 'overview', 'github', 'link', 'website', 'demo'];
        
        if (skipTerms.some(term => lower === term || lower.startsWith(term + ':'))) {
            return false;
        }
        
        if (/[a-z]/.test(text) && text.length > 1) {
            return true;
        }
        
        return false;
    }
    
    _extractTechnologies(text) {
        if (!text) return [];
        const lower = text.toLowerCase();
        const found = new Set();
        
        for (const tech of this.techKeywords) {
            const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'i');
            if (regex.test(lower)) {
                found.add(tech);
            }
        }
        
        return Array.from(found);
    }
    
    _analyzeDifficulty(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        let score = 0;
        
        for (const keyword of this.complexityKeywords) {
            if (text.includes(keyword)) {
                score += keyword === 'microservices' || keyword === 'distributed' || keyword === 'blockchain' || keyword === 'machine learning' || keyword === 'deep learning' ? 3 : 2;
            }
        }
        
        const techCount = this._analyzeTechnicalBreadth(project);
        score += Math.max(0, Math.floor((techCount - 2) / 2));
        
        if (text.includes('real-time')) score += 1;
        if (text.includes('high availability')) score += 1;
        if (text.includes('legacy')) score -= 1;
        if (text.includes('simple') || text.includes('basic')) score -= 1;
        
        if (score <= 1) return 'Easy';
        if (score <= 3) return 'Medium';
        if (score <= 5) return 'Hard';
        return 'Very Hard';
    }
    
    _analyzeBusinessValue(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        let score = 0;
        
        const categoryScores = Object.values(this.businessKeywordSets);
        for (const keywords of categoryScores) {
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    score += 15;
                    break;
                }
            }
        }
        
        const monetaryMatches = text.match(/\$[\d,]+(?:\.\d+)?\s*(?:million|billion|k|m|b)?\b/gi);
        if (monetaryMatches) {
            score += Math.min(20, monetaryMatches.length * 10);
        }
        
        const userMatches = text.match(/\b\d{2,}(?:,\d{3})*(?:\.\d+)?\b/g);
        if (userMatches && !text.includes('202') && !text.includes('19')) {
            score += Math.min(15, userMatches.length * 3);
        }
        
        if (text.includes('award') || text.includes('winner')) score += 5;
        
        return Math.min(100, Math.max(0, score));
    }
    
    _analyzeResumeValue(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        let score = 30;
        
        for (const term of this.leadershipKeywords) {
            if (text.includes(term)) {
                score += 10;
                break;
            }
        }
        
        let impactCount = 0;
        for (const term of this.impactKeywords) {
            if (text.includes(term)) impactCount++;
        }
        score += Math.min(20, impactCount * 5);
        
        for (const term of this.prestigeKeywords) {
            if (text.includes(term)) {
                score += 10;
                break;
            }
        }
        
        if (text.includes('open source')) score += 5;
        if (text.includes('production') || text.includes('live') || text.includes('deployed')) score += 5;
        if (text.includes('published') || text.includes('released')) score += 5;
        if (text.includes('maintained') || text.includes('maintain')) score += 3;
        
        return Math.min(100, Math.max(0, score));
    }
    
    _analyzeInterviewProbability(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        let score = 20;
        
        const interviewKeywords = ['microservices', 'distributed', 'scalable', 'real-time', 'optimization', 'algorithm', 'architecture', 'design pattern', 'system design', 'database', 'caching', 'concurrency'];
        for (const keyword of interviewKeywords) {
            if (text.includes(keyword)) score += 8;
        }
        
        const popularTech = ['react', 'node.js', 'python', 'aws', 'docker', 'kubernetes', 'mongodb', 'tensorflow', 'javascript', 'typescript'];
        for (const tech of popularTech) {
            if (text.includes(tech)) score += 3;
        }
        
        if (text.includes('award') || text.includes('hackathon') || text.includes('winner')) score += 10;
        if (text.includes('published') || text.includes('research')) score += 8;
        if (text.includes('open source')) score += 5;
        if (text.includes('first')) score += 5;
        
        const metricCount = this._countMetricMatches(text);
        score += Math.min(10, metricCount * 2);
        
        return Math.min(100, Math.max(0, score));
    }
    
    _analyzeInnovation(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        let score = 10;
        
        for (const term of this.innovationKeywords) {
            if (text.includes(term)) score += 12;
        }
        
        const emergingTech = ['ai', 'ml', 'machine learning', 'blockchain', 'iot', 'ar', 'vr', 'augmented reality', 'virtual reality', 'webgpu', 'webassembly', 'quantum'];
        for (const tech of emergingTech) {
            if (text.includes(tech)) score += 5;
        }
        
        if (text.includes('research')) score += 5;
        if (text.includes('prototyp')) score += 3;
        if (text.includes('experimental')) score += 3;
        
        const techCount = this._analyzeTechnicalBreadth(project);
        if (techCount >= 6) score += 10;
        else if (techCount >= 4) score += 6;
        else if (techCount >= 2) score += 3;
        
        return Math.min(100, Math.max(0, score));
    }
    
    _analyzeTechnicalBreadth(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        const found = new Set();
        
        for (const tech of this.techKeywords) {
            const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'i');
            if (regex.test(text)) {
                found.add(tech);
            }
        }
        
        const frameworkPatterns = [
            /\bnext\.?js\b/gi, /\bnuxt\.?js\b/gi, /\bexpress\.?js\b/gi,
            /\b(?:react|angular|vue|svelte)\b/gi
        ];
        
        for (const pattern of frameworkPatterns) {
            const matches = text.match(pattern);
            if (matches) {
                for (const match of matches) found.add(match);
            }
        }
        
        return found.size;
    }
    
    _detectMissingDocumentation(project) {
        if (!project.description || project.description.length < 20) return true;
        
        const text = project.description.toLowerCase();
        const docIndicators = [
            'purpose', 'goal', 'objective', 'description', 'overview', 'about',
            'architecture', 'design', 'implementation', 'functionality', 'features', 'summary',
            'context', 'scope', 'background'
        ];
        
        const hasDocKeyword = docIndicators.some(keyword => text.includes(keyword));
        const hasSentences = (text.match(/[.!?]+/g) || []).length >= 2;
        const hasSubstantialLength = text.split(/\s+/).length >= 15;
        
        if (!hasSubstantialLength) return true;
        
        return !hasDocKeyword && !hasSentences;
    }
    
    _detectMissingMetrics(project) {
        const text = `${project.name} ${project.description}`.toLowerCase();
        
        const metricMatches = this._countMetricMatches(text);
        
        if (metricMatches > 0) return false;
        
        const impactWords = ['improved', 'increased', 'decreased', 'reduced', 'saved', 'grew', 'cut', 'boosted', 'enhanced', 'minimized'];
        const hasImpactStatement = impactWords.some(word => text.includes(word));
        if (hasImpactStatement) return false;
        
        const hasNumbers = /\d{2,}/.test(text);
        if (!hasNumbers) return true;
        
        const words = text.split(/\s+/);
        if (words.length < 15) return true;
        
        return false;
    }
    
    _countMetricMatches(text) {
        let count = 0;
        for (const pattern of this.metricPatterns) {
            const matches = text.match(pattern);
            if (matches) count += matches.length;
        }
        return count;
    }
    
    _calculateProjectScore(data) {
        let score = 0;
        
        const businessNormalized = Math.min(100, Math.max(0, data.businessValue));
        const resumeNormalized = Math.min(100, Math.max(0, data.resumeValue));
        const interviewNormalized = Math.min(100, Math.max(0, data.interviewProbability));
        const innovationNormalized = Math.min(100, Math.max(0, data.innovation));
        const breadthNormalized = Math.min(10, Math.max(0, data.technicalBreadth));
        
        score += businessNormalized * 0.25;
        score += resumeNormalized * 0.25;
        score += interviewNormalized * 0.20;
        score += innovationNormalized * 0.15;
        score += breadthNormalized * 2;
        
        const difficultyPoints = { 'Easy': 2, 'Medium': 3, 'Hard': 4, 'Very Hard': 5 };
        score += difficultyPoints[data.difficulty] || 0;
        
        if (!data.missingDocumentation) score += 2.5;
        if (!data.missingMetrics) score += 2.5;
        
        return Math.min(100, Math.round(score));
    }
    
    _getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }
    
    _generateSummary(totalProjects, averageScore) {
        if (totalProjects === 0) return 'No projects found in resume.';
        
        const grade = this._getGrade(averageScore);
        
        if (averageScore >= 85) {
            return `Resume contains ${totalProjects} project${totalProjects > 1 ? 's' : ''} with strong overall quality (average score: ${averageScore}, grade: ${grade}). Projects demonstrate solid technical depth and business impact.`;
        }
        
        if (averageScore >= 70) {
            return `Resume contains ${totalProjects} project${totalProjects > 1 ? 's' : ''} with good quality (average score: ${averageScore}, grade: ${grade}). Technical breadth and business value are well represented with room for improvement.`;
        }
        
        if (averageScore >= 60) {
            return `Resume contains ${totalProjects} project${totalProjects > 1 ? 's' : ''} with moderate quality (average score: ${averageScore}, grade: ${grade}). Projects show basic technical competency but lack compelling metrics or documentation.`;
        }
        
        return `Resume contains ${totalProjects} project${totalProjects > 1 ? 's' : ''} with significant improvement needed (average score: ${averageScore}, grade: ${grade}). Projects lack measurable outcomes, technical depth, or clear documentation.`;
    }
    
    _generateRecommendations(projects, missingDocs, missingMetricProjects) {
        const recommendations = [];
        
        if (missingDocs.length > 0) {
            recommendations.push(`Improve documentation for ${missingDocs.length} project${missingDocs.length > 1 ? 's' : ''}: ${missingDocs.join(', ')}. Add clear purpose, architecture, implementation details, and personal contribution context.`);
        }
        
        if (missingMetricProjects.length > 0) {
            recommendations.push(`Add quantifiable metrics to ${missingMetricProjects.length} project${missingMetricProjects.length > 1 ? 's' : ''}: ${missingMetricProjects.join(', ')}. Include specific numbers for user impact, revenue, efficiency gains, cost savings, performance improvements, or scale.`);
        }
        
        const lowComplexityCount = projects.filter(p => p.difficulty === 'Easy').length;
        if (lowComplexityCount > projects.length * 0.5 && projects.length > 1) {
            recommendations.push('Consider adding or enhancing projects that demonstrate advanced technical skills, system design, and architectural decision-making beyond basic implementations.');
        }
        
        const lowInnovationProjects = projects.filter(p => p.innovation < 40);
        if (lowInnovationProjects.length > 0) {
            recommendations.push('Enhance project uniqueness for selected projects by highlighting novel approaches, research contributions, or innovative solutions that differentiate you from other candidates.');
        }
        
        const lowBreadthProjects = projects.filter(p => p.technicalBreadth < 3);
        if (lowBreadthProjects.length > 0) {
            recommendations.push('Showcase broader technical stack breadth across projects. Highlight modern frameworks, cloud platforms, and tools to demonstrate versatility and current industry alignment.');
        }
        
        const noAwards = projects.filter(p => !p.description || !this.prestigeKeywords.some(k => p.description.toLowerCase().includes(k)));
        if (noAwards.length === projects.length && projects.length > 0) {
            recommendations.push('Consider mentioning any awards, hackathon results, publications, or open source contributions to strengthen project credibility.');
        }
        
        const strongProjects = projects.filter(p => p.projectScore >= 80);
        if (strongProjects.length > 0 && recommendations.length > 0) {
            recommendations.push(`Leverage your strongest project${strongProjects.length > 1 ? 's' : ''} (${strongProjects.map(p => p.name).join(', ')}) as primary talking points during interviews.`);
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Resume projects are well-structured with strong documentation and metrics. Consider adding direct links to live demos or repositories for immediate validation.');
        }
        
        return recommendations;
    }
    
    _calculateScoreDistribution(projects) {
        const distribution = {
            'Easy': 0,
            'Medium': 0,
            'Hard': 0,
            'Very Hard': 0
        };
        
        for (const project of projects) {
            if (Object.prototype.hasOwnProperty.call(distribution, project.difficulty)) {
                distribution[project.difficulty]++;
            }
        }
        
        return distribution;
    }
    
    _getEmptyResult() {
        return {
            totalProjects: 0,
            projects: [],
            averageScore: 0,
            topProject: null,
            missingDocumentation: [],
            missingMetrics: [],
            summary: 'No projects found in resume.',
            recommendations: ['Add at least one project with clear description, technical stack, and measurable outcomes to strengthen your resume.'],
            scoreDistribution: {
                'Easy': 0,
                'Medium': 0,
                'Hard': 0,
                'Very Hard': 0
            }
        };
    }
}

module.exports = new ProjectIntelligenceEngine();
