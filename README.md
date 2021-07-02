# e-trading

Basic E-trading project using Express.JS and Sequelize

## Project Setup

    npm install

## Run Server

    npm start

## Run Server (Auto restart mode)

    npm run dev

## Client Home URL

    hostname:port/home

## Force Synchronize Sequelize Models

Change Environment Configuration Flag to ```true``` inside ```config/main.config.js``` before running the server

```js
{
    FORCE_SYNC_FLAG: true,
}
```

Otherwise, Configure the flag to ```false```

```js
{
    FORCE_SYNC_FLAG: false,
}
```

## Creation of User Roles and Super Admin Profile

While running the server at first time, synchronize sequelize models with force
