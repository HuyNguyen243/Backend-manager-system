const sortRoomMessagesByDate = async (messages) => {
    return messages.sort(function (a, b) {
        let date1 = a._id.date.split('/');
        let date2 = b._id.date.split('/');

        date1 = date1[2] + date1[1] + date1[0];
        date2 = date2[2] + date2[1] + date2[0];

        return date1 < date2 ? -1 : 1;
    });
};

const orderIds = (id_from, id_to, type) => {
    if (id_from && id_to) {
        if (id_from > id_to) {
            return type + '-' + id_from + '-' + id_to;
        } else {
            return type + '-' + id_to + '-' + id_from;
        }
    }
};

module.exports = {
    sortRoomMessagesByDate,
    orderIds,
};
