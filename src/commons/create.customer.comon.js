const customerResponse = [
    {
        $group: {
            _id: '$_id',
            fullname: {
                $push: '$fullname',
            },
            information: {
                $push: {
                    phone: '$phone',
                    birth: '$birth',
                    email: '$email',
                    address: {
                        country: '$country',
                        city: '$city',
                        detail: '$address',
                    },
                },
            },
            status: { $push: '$status' },
            id_system: { $push: '$id_system' },
            create_by: { $push: '$create_by' },
            list_jobs: { $push: '$listjobs' },
            _create_at: { $push: '$_create_at' },
            _modified_at: { $push: '$_modified_at' },
        },
    },
];

module.exports = {
    customerResponse,
};
