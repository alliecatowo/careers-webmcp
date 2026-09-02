const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function validateResume(file: File): { valid: boolean; reason?: string } {
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, reason: 'File is too large. Maximum size is 5MB.' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, reason: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.' };
    }

    // Mock virus scan placeholder
    const hasVirus = false; 
    if (hasVirus) {
        return { valid: false, reason: 'A virus was detected in the file.' };
    }

    return { valid: true };
}
