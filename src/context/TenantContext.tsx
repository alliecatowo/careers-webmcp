'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Organization } from '@/features/organization/types';
import { organizationService } from '@/services/organization.service';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const TENANT_STORAGE_KEY = 'talent-os-tenant-id';

interface TenantContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  switchOrganization: (orgId: string) => void;
  isTenantLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

function TenantLoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading organizations...</p>
            </div>
        </div>
    );
}

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isTenantLoading, setIsTenantLoading] = useState(true);
  const router = useRouter();

  // Fetch all organizations for the user
  useEffect(() => {
    if (user && !isAuthLoading) {
      setIsTenantLoading(true);
      organizationService.getUserOrganizations(user.id).then(orgs => {
        setOrganizations(orgs);
        
        const storedOrgId = localStorage.getItem(TENANT_STORAGE_KEY);
        const lastOrg = orgs.find(o => o.id === storedOrgId);
        const firstOrg = orgs.length > 0 ? orgs[0] : null;
        
        const orgToSet = lastOrg || firstOrg;

        if (orgToSet) {
          setCurrentOrganization(orgToSet);
          localStorage.setItem(TENANT_STORAGE_KEY, orgToSet.id);
        }
      }).catch(err => {
          console.error("Failed to load organizations", err);
          // Handle error state if needed, e.g. show a global error message.
      }).finally(() => {
          setIsTenantLoading(false);
      });
    } else if (!isAuthLoading) {
      // No user, stop loading.
      setIsTenantLoading(false);
    }
  }, [user, isAuthLoading]);

  const switchOrganization = useCallback((orgId: string) => {
    const newOrg = organizations.find(o => o.id === orgId);
    if (newOrg) {
      setCurrentOrganization(newOrg);
      localStorage.setItem(TENANT_STORAGE_KEY, orgId);
      // Soft refresh to re-trigger SWR fetches with new tenant context
      router.refresh(); 
    }
  }, [organizations, router]);

  const value = {
    currentOrganization,
    organizations,
    switchOrganization,
    isTenantLoading: isTenantLoading || isAuthLoading,
  };

  if (value.isTenantLoading) {
      return <TenantLoadingScreen />;
  }

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
