const BaseController = require('./BaseController');
const path = require('path');
class StaticController extends BaseController {
    constructor() {
        super();
    }

    getUI = async (req, res) => {
        return res.sendFile(path.resolve('public/static/index.html'));
    };
}

const staticController = new StaticController();

module.exports = staticController;
