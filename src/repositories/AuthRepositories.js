const BaseRepositories = require('./BaseRepositories');
const UserRepositories = require('./UserRepositories');
const TokenModel = require('../models/Token');

const messager = require('../utils/constain.util');
const { hash_string_decode } = require('../utils/support.util');
const { token_response } = require('../utils/app.util');

const { execSync } = require('child_process');
const { jwt_create_token } = require('../services/jwt.service');

const TokenRules = require('../rules/token.rules');

class AuthRepositories extends BaseRepositories {
    userrepositories;
    constructor() {
        super();
        this.model = TokenModel;
        this.userrepositories = new UserRepositories();
    }

    auth = async (query) => {
        const get_user = await this.userrepositories.find_obj({
            $or: [{ username: query.username }, { email: query.username }],
        });
        // Check username or email
        if (!get_user) {
            return { error: messager.USERNAME_OR_EMAIL_INVAILD };
        }
        // Check password
        if (!hash_string_decode(query.password, get_user.password)) {
            return { error: messager.PASSWORD_INCORECT };
        } else {
            //  Check ACCOUNT_IS_LOGGED
            get_user.ip = this.get_ip();

            const new_token = await this.create_new_token(get_user);
            return {
                _id: get_user._id,
                access_token: new_token,
            };
        }
    };

    remove_token = async (_id_activity) => {
        return await this.delete({ _id_activity: _id_activity });
    };

    new_auth_token = async (data) => {
        const get_user = await this.userrepositories.find_obj({
            _id: data._id_activity,
        });

        const new_token_refresh = await this.re_create_new_token(get_user);
        return {
            _id: data._id_activity,
            access_token: new_token_refresh,
        };
    };

    create_new_token = async (data) => {
        let date = new Date();
        let date_ft = new Date();
        date.setHours(date.getHours() + 7);
        date_ft.setHours(date_ft.getHours() + 7);
        const tokenData = token_response({
            _id: data._id,
            id_system: data.id_system,
            role: data.role,
        });
        const access_token = jwt_create_token(tokenData);
        const exp_rf = date_ft.setHours(date_ft.getHours() + TokenRules.REFRESH_TOKEN_EXPRIED_DAYS);
        const refresh_token = jwt_create_token({
            access_token: access_token,
            exp_rf: exp_rf,
        });
        const exp_ac = date.setHours(date.getHours() + TokenRules.DEFAULT_EXPRIED_HOURS);
        const token_obj = {
            _id_activity: data._id,
            ip: data.ip,
            access_token: access_token,
            refresh_token: refresh_token,
            exp_ac: exp_ac,
            exp_rt: exp_rf,
        };
        const auth_access_token = await new TokenModel(token_obj);
        await auth_access_token.save();
        return access_token;
    };

    re_create_new_token = async (data) => {
        let date = new Date();
        let date_ft = new Date();
        date.setHours(date.getHours() + 7);
        date_ft.setHours(date_ft.getHours() + 7);
        const tokenData = token_response({
            _id: data._id,
            role: data.role,
            id_system: data.id_system,
        });

        const access_token_new = jwt_create_token(tokenData);
        const exp_ac_new = date.setHours(date.getHours() + TokenRules.DEFAULT_EXPRIED_HOURS);
        const refresh_token_new = jwt_create_token({
            access_token: access_token_new,
            exp_rf: exp_ac_new,
        });
        const exp_rf_new = date_ft.setHours(date_ft.getHours() + TokenRules.REFRESH_TOKEN_EXPRIED_DAYS);
        await this.update(
            {
                _id_activity: data._id,
            },
            {
                access_token: access_token_new,
                refresh_token: refresh_token_new,
                exp_ac: exp_ac_new,
                exp_rt: exp_rf_new,
                last_activity: date,
            }
        );
        return access_token_new;
    };

    get_ip = () => {
        const cmd = `curl -s http://checkip.amazonaws.com || printf "0.0.0.0"`;
        const pubIp = execSync(cmd).toString().trim();
        return pubIp;
    };
}

module.exports = AuthRepositories;
