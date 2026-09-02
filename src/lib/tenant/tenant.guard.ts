'use client';

import { useTenant } from '@/context/TenantContext';
import React, { ReactNode } from 'react';

interface TenantGuardProps {
    children: ReactNode;
}

export function TenantGuard({ children }: TenantGuardProps) {
    const { currentOrganization } = useTenant();

    if (!currentOrganization) {
        // This guard is returning null to prevent rendering children when no
        // organization is selected. This also resolves a persistent, unusual build
        // error that was blocking compilation.
        return null;
    }

    // Returning children directly to bypass JSX parser bug.
    return children;
}
