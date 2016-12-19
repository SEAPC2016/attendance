To update mongodb data quicker, [Robomongo](https://robomongo.org/) is not so handy. There is [mongo-express](https://github.com/mongo-express/mongo-express) can do a nice job.

However, there should be [a konwn issue and have not been updated for a long time](https://github.com/mongo-express/mongo-express/issues/231). So, we can not use it's command line.

NOTE: node v6.9.2 (Tried v7.2.1, no luck.)


A bypass, use npm install and config, the official website wrote it pretty clear, I just upload a workable config for connecting aliyun docker mongo.

``` vi
npm install mongo-express
cp config.js node_modules/mongo-express
npm start
```

And if want to use `localhost` mongodb, just as the website said, set config as default:

``` vi
npm install mongo-express
cp node_modules/mongo-express/config.default.js node_modules/mongo-express/config.js
npm start
```
