const BaseController = require('./BaseController');
const crypto = require('crypto');
const webpush = require('web-push');
const { STMP_EMAIL_USER } = require('../config/constain.config');

const vapidKeys = {
    privateKey: 'ik72f8IBtmU9Lq3e4yCewc1XJMZw0dpcIRShALqUeoc',
    publicKey: 'BFr_RcyaxRbBd19LBK8rWe6lfb6MmLH2dGB2G3fHlZGDFtg5Io-hJ0JyrEa3cA8IqDA-k9h71Q3gt-G89qdnJz4',
};
// IF HAVEN'T PRIVATE KEY AND PUBLICKEY , RUN THIS COMMAND ./node_modules/.bin/web-push generate-vapid-keys

webpush.setVapidDetails(`mailto:${STMP_EMAIL_USER}`, vapidKeys.publicKey, vapidKeys.privateKey);

class SubscriptionController extends BaseController {
    subscriptions = {};

    createHash(input) {
        const md5sum = crypto.createHash('md5');
        md5sum.update(Buffer.from(input));
        return md5sum.digest('hex');
    }

    pushNotificationSubscription = (req, res) => {
        try {
            const subscriptionRequest = req.body.data;
            const susbscriptionId = this.createHash(JSON.stringify(subscriptionRequest));
            this.subscriptions[susbscriptionId] = subscriptionRequest;
            return this.response_success(res, { id: susbscriptionId }, 'Get ID successfully');
        } catch (error) {
            return this.response_error(res, [], 'Get ID failed');
        }
    };

    sendPushNotification = (req, res) => {
        try {
            const subscriptionId = req.params.id;
            const { url } = req.body;
            const pushSubscription = this.subscriptions[subscriptionId];

            webpush
                .sendNotification(
                    pushSubscription,
                    JSON.stringify({
                        title: 'Thông báo',
                        text: `Bạn có một thông báo đến từ hệ thống !`,
                        image: '../../public/static/logo_email.png',
                        tag: 'new-notify',
                        url: url,
                    })
                )
                .catch((err) => {
                    console.log(err);
                });

            return this.response_success(res, [], 'Send notification successfully');
        } catch (error) {
            return this.response_error(res, [], 'Send notification failed');
        }
    };
}

const subscriptionController = new SubscriptionController();

module.exports = subscriptionController;
