const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
        host: keys.redisHost,
        port: keys.redisPort,
        retry_strategy: () => 1000
    }
);

const redisClient2 = redisClient.duplicate();

function fib(index) {
    if (index < 2) {
        return 1;
    }
    return fib(index - 2) + fib(index - 1);
}

redisClient2.on('message',(channel,message)=>{
    console.log("Worker got message "+message);
    let answer = fib(parseInt(message));
    console.log("Redis update "+message+" answer:"+answer);
    redisClient.hset('values',message,answer);

});
redisClient2.subscribe('insert');