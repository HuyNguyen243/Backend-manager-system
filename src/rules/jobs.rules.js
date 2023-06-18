const JobRules = {
    ROLE: {
        SALER: 'SALER',
        ADMIN: 'ADMIN',
        EDITOR: 'EDITOR',
        LEADER_EDITOR: 'LEADER_EDITOR',
    },
    STATUS_JOBS: {
        COMPLETE: 'COMPLETE',
        INCOMPLETE: 'INCOMPLETE',
        PENDING: 'PENDING',
    },
    STATUS_EDITOR: {
        COMPLETE: 'COMPLETE',
        INCOMPLETE: 'INCOMPLETE',
        PENDING: 'PENDING',
        FIXED: 'FIXED',
    },
    JOBS_TYPES: {
        FEE: 'FEE',
        FREE: 'FREE',
        EDIT: 'EDIT',
    },
    DEFAULT_VALUE: 'NOT_SET_BY_ADMIN',
    DEFAULT_COUNT_FIXED: 0,
    DEFAULT_QUANTITY: 1,
};

module.exports = JobRules;
