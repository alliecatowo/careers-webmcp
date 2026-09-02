const SKILL_DICTIONARY: Record<string, { category: 'skills' | 'technologies'; aliases?: string[] }> = {
    // Programming Languages
    javascript: { category: 'technologies' },
    typescript: { category: 'technologies' },
    python: { category: 'technologies' },
    java: { category: 'technologies' },
    go: { category: 'technologies' },
    csharp: { category: 'technologies', aliases: ['c#'] },
    ruby: { category: 'technologies' },
    php: { category: 'technologies' },
    swift: { category: 'technologies' },
    kotlin: { category: 'technologies' },
    sql: { category: 'technologies' },

    // Frontend
    react: { category: 'technologies', aliases: ['react.js'] },
    'next.js': { category: 'technologies' },
    angular: { category: 'technologies' },
    vue: { category: 'technologies', aliases: ['vue.js'] },
    redux: { category: 'technologies' },
    html: { category: 'technologies', aliases: ['html5'] },
    css: { category: 'technologies', aliases: ['css3', 'sass', 'scss'] },

    // Backend
    'node.js': { category: 'technologies' },
    express: { category: 'technologies', aliases: ['express.js'] },
    django: { category: 'technologies' },
    flask: { category: 'technologies' },
    'spring boot': { category: 'technologies' },

    // Cloud & DevOps
    aws: { category: 'technologies', aliases: ['amazon web services'] },
    azure: { category: 'technologies' },
    gcp: { category: 'technologies', aliases: ['google cloud platform'] },
    docker: { category: 'technologies' },
    kubernetes: { category: 'technologies', aliases: ['k8s'] },
    terraform: { category: 'technologies' },
    jenkins: { category: 'technologies' },
    'ci/cd': { category: 'skills' },

    // Databases
    postgresql: { category: 'technologies' },
    mysql: { category: 'technologies' },
    mongodb: { category: 'technologies' },
    redis: { category: 'technologies' },
    
    // Methodologies & Skills
    'machine learning': { category: 'skills', aliases: ['ml'] },
    'data analysis': { category: 'skills' },
    'ui/ux': { category: 'skills', aliases: ['ui', 'ux'] },
    agile: { category: 'skills' },
    scrum: { category: 'skills' },
    'product management': { category: 'skills' },
    'project management': { category: 'skills' },

    // Tools
    figma: { category: 'technologies' },
    git: { category: 'technologies' },
};

function capitalize(s: string) {
    return s.replace(/\b\w/g, l => l.toUpperCase());
}

export function extractSkills(text: string): { skills: string[], technologies: string[] } {
    const lowerText = text.toLowerCase();
    const foundSkills = new Set<string>();
    const foundTechnologies = new Set<string>();

    for (const [skill, config] of Object.entries(SKILL_DICTIONARY)) {
        const patterns = [skill, ...(config.aliases || [])];
        for (const pattern of patterns) {
            // Use word boundaries to avoid matching substrings like 'react' in 'reaction'
            const regex = new RegExp(`\\b${pattern.replace('.', '\\.')}\\b`, 'g');
            if (lowerText.match(regex)) {
                if (config.category === 'skills') {
                    foundSkills.add(capitalize(skill));
                } else {
                    foundTechnologies.add(capitalize(skill));
                }
            }
        }
    }

    return {
        skills: Array.from(foundSkills),
        technologies: Array.from(foundTechnologies)
    };
}
