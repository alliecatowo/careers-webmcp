
export interface JobSummary {
    id: string;
    title: string;
    department: string;
    applicants: number;
}

export interface JobsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    department?: string;
}
