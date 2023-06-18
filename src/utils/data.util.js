const data_response = (data, url) => {
    return {
        username: data.username,
        fullname: data.fullname,
        status: data.status,
        email: data.email,
        births: data.births,
        start_day: data.start_day,
        address: data.address ? data.address : null,
        id_system: data.id_system,
        phone: data.phone,
        role: data.role,
        payment_method: data.payment_method,
        notification_count: data.notification_count,
        nameBank: data.nameBank || null,
        number_account_payment: data.number_account_payment || null,
        name_account_payment: data.name_account_payment || null,
        avatar: data.avatar ? url + data.avatar : null,
        infor_reminder: data.infor_reminder,
        kpi_saler: data.kpi_saler,
        _create_at: data._create_at,
        _modified_at: data._modified_at,
    };
};
const token_response = (data) => {
    return {
        _id: data._id,
        role: data.role,
        id_system: data.id_system,
    };
};

const data_customer_response = (data) => {
    return {
        fullname: data?.fullname,
        information: {
            email: data?.email,
            address: {
                country: data?.country,
                city: data?.city,
            },
        },
        status: data?.status,
        id_system: data?.id_system,
        create_by: data?.create_by,
        list_jobs: data?.list_jobs,
        infor_reminder: data?.infor_reminder,
        link: data?.link,
        _create_at: data?._create_at,
    };
};

const data_pay_response = (data) => {
    return {
        _id: data?._id,
        id_job: data?.id_job,
        id_system: data?.id_system,
        information: {
            create_by: data?.create_by,
            staff_is_pay: data?.staff_is_pay,
            pay_employees: data?.pay_employees,
        },
        status: data?.status,
    };
};

const data_job_response = (data) => {
    return {
        infor_reminder: {
            reminder_saler: data?.reminder_saler,
            reminder_editor: data?.reminder_editor,
            reminder_customer: data?.reminder_customer,
            customer_group_job: [data?.reminder_customer, data?.group_name_job],
        },
        infor_id: {
            id_system: data?.id_system,
            id_customer: data?.id_customer,
            id_saler: data?.id_saler,
            id_admin: data?.id_admin,
            id_editor: data?.id_editor,
        },
        infor: {
            start_day: data?.start_day,
            end_day: data?.end_day,
            org_link: data?.org_link,
            request_content: data?.request_content,
            work_notes: data?.work_notes,
            type_pay: data?.type_pay,
            type_models: data?.type_models,
            photo_types: data?.photo_types,
            status_jobs: data?.status_jobs,
            status_jobs_update: data?.status_jobs_update,
            status_editor_fix: data?.status_editor_fix,
            count_fixed: data?.count_fixed,
            fixed_link: data?.fixed_link,
            status_editor: data?.status_editor,
            quality_img: data?.quality_img,
            group_name_job: data?.group_name_job,
            finished_link: data?.finished_link ? data?.finished_link : null,
            is_approved_by_editor: data?.is_approved_by_editor,
        },
        cost: {
            total_cost: data?.total_cost,
            editor_cost: data?.editor_cost ? data?.editor_cost : null,
            saler_cost: data?.saler_cost ? data?.saler_cost : null,
            admin_cost: data?.admin_cost ? data?.admin_cost : null,
            rate_saler_in_created: data?.rate_saler_in_created,
            exchange_rate_in_created: data?.exchange_rate_in_created,
        },
    };
};

const data_cost_response = (data) => {
    return {
        total_cost: data?.total_cost,
        editor_cost: data?.editor_cost,
        saler_cost: data?.editor_cost,
        admin_cost: data?.admin_cost,
    };
};

const data_setting_response = (data) => {
    return {
        exchange_rate: data?.exchange_rate,
        rate_sale: data?.rate_sale,
        type_img: data?.type_img,
        type_fixed: data?.type_fixed,
        type_pay: data?.type_pay,
        type_define_image: data?.type_define_image,
        group_name_job: data?.group_name_job,
    };
};
module.exports = {
    data_response,
    token_response,
    data_customer_response,
    data_pay_response,
    data_job_response,
    data_cost_response,
    data_setting_response,
};
