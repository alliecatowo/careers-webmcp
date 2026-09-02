export function extractLinks(text: string): { github?: string, linkedin?: string } {
    const links: { github?: string, linkedin?: string } = {};

    const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/i;
    const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/i;

    const linkedinMatch = text.match(linkedinRegex);
    if (linkedinMatch) {
        links.linkedin = linkedinMatch[0];
    }

    const githubMatch = text.match(githubRegex);
    if (githubMatch) {
        links.github = githubMatch[0];
    }

    return links;
}
