import { privateApiClient } from "@/api/private.axios";

export type AdminLogQuery = {
    startDate: string;
    endDate: string;
    author?: string;
    resource?: string;
    action?: string;
}

export type AdminLogResponseItem = {
    id: string;
    author: string;
    resource: string;
    action: string;
    diff?: {
        new?: Record<string, unknown>;
        old?: Record<string, unknown>;
    };
    timestamp: string;
}

export const getAdminLogs = async (query: AdminLogQuery) => {
    return privateApiClient.get('/adminLog', { params: query })
}