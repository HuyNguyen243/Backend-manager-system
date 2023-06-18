define('PHONE_REGEX', /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
// eslint-disable-next-line no-useless-escape
define('LINK_REGEX', /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
define('DATE_TIMESTAMP', /(\d{2})-(\d{2})-(\d{4})/);

// eslint-disable-next-line no-useless-escape
define('SPECIAL_CHARACTER', /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g);

define('SUCCESS_CODE', 200);
define('ERROR_CODE', 400);
define('UNAUTHORIZED_CODE', 401);
define('FORBIDDEN_CODE', 403);
define('NOT_FOUND_CODE', 404);

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true,
    });
}
