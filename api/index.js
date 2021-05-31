const keys = require("./keys");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase
});

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS INPUT_VALUE (number INT)")
        .catch((err) => console.error(err));
});

//redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
        host: keys.redisHost,
        port: keys.redisPort,
        retry_strategy: () => 1000
    }
);
const redisPublisher = redisClient.duplicate();

// Express Route handlers
app.get('/',(req,res)=>{
    res.send('Hi');
});

app.get('/values/all', async (req,res)=>{
    const values = await pgClient.query('SELECT * from INPUT_VALUE');
    res.send(values.rows);
});

app.get('/values/current', async (req,res)=>{
    redisClient.hgetall('values',(err,values)=>{
        res.send(values);
    });
});

app.post('/values',async (req,res)=>{
    const index = req.body.index;
    if (parseInt(index)>100){
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values',index,'Nothing yet!');
    redisPublisher.publish('insert',index);
    pgClient.query('INSERT INTO INPUT_VALUE (number) values ($1)', [index]);
    res.send({working:true});
});

app.listen(5000, err => {
    console.log('Listening port 5000');
})

