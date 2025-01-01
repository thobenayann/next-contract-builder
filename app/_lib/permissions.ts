import {
    createAccessControl,
    defaultStatements,
} from 'better-auth/plugins/access';

const statement = {
    ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
    organization: ['update', 'delete'],
    member: ['create', 'update', 'delete'],
    invitation: ['create', 'cancel'],
});

export const admin = ac.newRole({
    organization: ['update'],
    member: ['create', 'update', 'delete'],
    invitation: ['create', 'cancel'],
});

export const member = ac.newRole({});
