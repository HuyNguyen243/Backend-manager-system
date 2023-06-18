const express = require('express');
// const rateLimit = require('express-rate-limit');
// const response = require('./src/utils/constain.util');
const path = require('path');
const { APP_PORT, APP_URL, MODE_DEPLOY } = require('./src/config/app.config');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser');
const PORT = APP_PORT || 8001;
const webSockets = require('./src/services/socket.service');
let server;
//HTTP SSL
if (MODE_DEPLOY === 'development') {
    const https = require('https');
    const fs = require('fs');
    server = https.createServer(
        {
            key: fs.readFileSync(path.join(__dirname, 'key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
        },
        app
    );
} else {
    // HTTP NO SSL
    const http = require('http');
    server = http.createServer(app);
}
// Rate limit
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 2000, // Limit each IP to many requests per `window` (here, per 15 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//     message: response.MAX_QUERY_LIMIT,
// });

// app.use(limiter);
app.use((req, res, next) => {
    // res.removeHeader('Cross-Origin-Resource-Policy');
    // res.removeHeader('Cross-Origin-Embedder-Policy');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization ');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    }

    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Mongo connection
require('./src/services/db.service');

//Logging
app.use(morgan('combined'));

// Cors config
const cors = require('cors');
app.use(cors({ credentials: true, origin: '*' }));

//Routes
const routes = require('./src/routes/app.route');
routes(app);

app.use(express.static(path.join(__dirname, 'public')));

// Helmet
const helmet = require('helmet');
app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));

// Compression
const compression = require('compression');
app.use(compression());

global.io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
    },
    maxHttpBufferSize: 1024 * 1024 * 1024,
});

global.io.on('connection', webSockets.connection);

// server.requestTimeout = 60 * 1000;
// server.setTimeout(120 * 1000);
server.listen(PORT, () => {
    console.log(`Server started at ${APP_URL}:${PORT}`);
});
