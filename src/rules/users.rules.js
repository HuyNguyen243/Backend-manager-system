const UserRules = {
    ROLE: {
        SALER: 'SALER',
        ADMIN: 'ADMIN',
        EDITOR: 'EDITOR',
        CUSTOMER: 'CUSTOMER',
        LEADER_EDITOR: 'LEADER_EDITOR',
        JOB: 'JOB',
        PAY: 'PAY',
        SETTING: 'SETTING',
    },
    _ROLE: {
        SALER: 'S',
        ADMIN: 'A',
        EDITOR: 'E',
        CUSTOMER: 'C',
        LEADER_EDITOR: 'LE',
        JOB: 'J',
        PAY: 'P',
        SETTING: 'SET',
    },
    STATUS: {
        ONLINE: 'ONLINE',
        OFFLINE: 'OFFLINE',
        LEAVE: 'LEAVING',
    },
    MESSAGE: {
        USER: 'USER',
        GROUP: 'GROUP',
        EDIT: 'EDIT',
        CREATE: 'CREATE',
    },
};

module.exports = UserRules;
