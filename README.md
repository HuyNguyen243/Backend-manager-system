# Dashboard Systems' DevDaNang Services

This is the backend systems of 1Touch Team.

## Introduction

Using NodeJs and MongoDB ( Mongoose )

## Install and follow step

```bash

# Genarate key JWT in systems

cd keystore
./generator.sh
cd ../

# Install package

npm install
```

## Create .env file

```
APP_PORT="8001"
APP_ENV="devServer" # devHome - MongoDB Atlas Server, devServer - MongoDB Server in Server Dev Google Cloud

######Account MongoDB Atlas Server
#MONGO_HOST="oneteamcluster.xuogg9v.mongodb.net"
#MONGO_PORT=""
#MONGO_DB="1touchDB"
#MONGO_USER="admin"
#MONGO_PASSWORD="admin123"
#######Account  MongoDB Server Local
MONGO_HOST="103.149.86.35"
MONGO_PORT="8082"
MONGO_DB="1touchDB_dev"
MONGO_USER="1touchadmin"
MONGO_PASSWORD="tY6pX4jXGv6UwVsX"

SALT_KEY='lF7~E+GJF;XOs;.BcYGj-gI}F5SP)uE0l~0GOEDxPli+Zrca{+cAN[():mj`y&;'
SALT_KEY_BCRYPT="10"

STMP_EMAIL_HOST="smtp.gmail.com"
STMP_EMAIL_PORT="587"
STMP_EMAIL_USER="qtv.1touchpage@gmail.com"
STMP_EMAIL_PASSWORD="iplfzrjuhdzdmoxx"

APP_WEBSITE_URL="https://1touchteam.com"
APP_WEBSITE_API="https://api.1touchteam.com"

# Server is running port 8001
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## License

Author by [DevDaNang](https://github.com/qlongdevdn)
