const routes = (app) => {
    app.use('/auth', require('./auth.route'));
    app.use('/users', require('./user.route'));
    app.use('/subscription', require('./subscription.route'));
    app.use('/customers', require('./customer.route'));
    app.use('/pays', require('./pay.route'));
    app.use('/setting', require('./setting.route'));
    app.use('/jobs', require('./jobs.route'));
    app.use('/group', require('./message.route'));
    app.use('/notification', require('./notification.route'));
    app.use('/performance', require('./employee_performace.route'));
    app.use('/', require('./static.route'));
    app.use('/step/image', require('./stepsImage.route'));
};

module.exports = routes;
