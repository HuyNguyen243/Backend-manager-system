const NotificationRules = {
    STATUS: {
        ADD_JOB: 'ADD_JOB',
        CREATE_JOB: 'CREATE_JOB',
        COMPLETE_JOB: 'COMPLETE_JOB',
        CANCEL_JOB: 'CANCEL_JOB',
        DELETE_JOB: 'DELETE_JOB',
        EDIT_JOB: 'EDIT_JOB',
        FIXED: 'FIXED',
        PAYMENT_JOB_PAID: 'PAYMENT_JOB_PAID',
        PAYMENT_JOB_UNPAY: 'PAYMENT_JOB_UNPAY',
    },
    MESSAGE: {
        CREATE_JOB: 'Một công việc đã được tạo bởi',
        EDIT_JOB: 'Một công việc đã thay đổi bởi',
        DELETE_JOB: 'Một công việc đã bị xóa bởi',
        FIXED: 'Một công việc được yêu cầu chỉnh sửa bởi ',
        COMPLETE_JOB: 'Một công việc đã hoàn thành bởi ',
        CANCEL_JOB: 'Một công việc bị từ chối bởi ',
        USER_ACCESS_JOB_COMPLETE: 'Một công việc đã được chấp nhận hoàn thành bởi ',
        ADD_JOB: 'Một công việc đã được thêm bởi ',
        PAYMENT_JOB_PAID: 'Một công việc đã được thanh toán bởi ',
        PAYMENT_JOB_UNPAY: 'Một công việc đã không được thanh toán bởi ',
        CHANGE_STATUS: 'Một công việc đã cập nhật trạng thái bởi ',
    },
    PAGE: {
        LIMIT: 10,
        SKIP: 0,
    },
};

module.exports = NotificationRules;
