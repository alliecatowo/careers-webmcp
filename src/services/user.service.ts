
import { adapter } from './adapter';
import { SystemUser } from '@/features/users/domain/user.entity';

export const userService = {
    getUsers: () => adapter.getUsers(),
    getUserById: (id: string) => adapter.getUserById(id),
    create: (user: Omit<SystemUser, 'id' | 'createdAt'>) => adapter.create(user),
    update: (id: string, user: Partial<SystemUser>) => adapter.update(id, user),
    delete: (id: string) => adapter.deleteUser(id),
};
