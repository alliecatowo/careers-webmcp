
'use client';

import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { College } from '@/mocks/colleges.mock';
import { DataColumn } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/system/Toast/useToast';
import { collegeService } from '@/services/college.service';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CollegeDashboardPage = () => {
    const { showToast } = useToast();
    const { data, isLoading, error, query, setQuery, refresh } = useDataTable<College & {id: string}>({
        fetchData: collegeService.getColleges,
    });

    const handleAdd = async () => {
        const name = prompt('Enter College Name:');
        if (!name) return;
        try {
            await collegeService.createCollege({ name, city: 'City', state: 'State', accreditation: 'A', isActive: true });
            refresh();
            showToast({ type: 'success', title: 'College Added', description: `${name} has been added.` });
        } catch (e) {
            showToast({ type: 'error', title: 'Error', description: 'Failed to add college.' });
        }
    };

    const handleEdit = async (college: College) => {
        const name = prompt('Update College Name:', college.name);
        if (!name || name === college.name) return;
        try {
            await collegeService.updateCollege({ ...college, name });
            refresh();
            showToast({ type: 'success', title: 'College Updated', description: `${college.name} has been updated.` });
        } catch(e) {
            showToast({ type: 'error', title: 'Error', description: 'Failed to update college.' });
        }
    };

    const handleDelete = async (college: College) => {
        if (!confirm(`Are you sure you want to delete ${college.name}?`)) return;
        try {
            await collegeService.deleteCollege(college.collegeId);
            refresh();
            showToast({ type: 'success', title: 'College Deleted', description: `${college.name} has been removed.` });
        } catch (e) {
            showToast({ type: 'error', title: 'Error', description: 'Failed to delete college.' });
        }
    };
    
    const columns: DataColumn<College>[] = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'city', header: 'City', sortable: true },
        { key: 'state', header: 'State', sortable: true },
        { key: 'accreditation', header: 'Accreditation', align: 'center' },
        { 
            key: 'isActive', 
            header: 'Status', 
            render: (row) => (
                <Badge variant={row.isActive ? 'default' : 'destructive'} className={row.isActive ? 'bg-green-100 text-green-800' : ''}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
          key: 'actions',
          header: 'Actions',
          align: 'right',
          render: (row) => (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(row)}>Delete</Button>
            </div>
          )
        }
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">College Dashboard</h1>
                    <p className="text-muted-foreground">Manage campus recruitment partner colleges.</p>
                </div>
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add College
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                error={error}
                query={query}
                setQuery={setQuery}
                totalCount={data?.total || 0}
                totalPages={data?.totalPages || 1}
                selectable={false}
                selectedRows={{}}
                onSelectionChange={() => {}}
            />
        </div>
    );
};

export default CollegeDashboardPage;
