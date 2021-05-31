# complex from udemy
## Run and Build
```aidl
docker-compose up --build
```
## Components
- nginx
- api
- client
- worker
- postgres

## NGINX
Work as router, proxy to route the input to client and api

## CLIENT
React JS front end application

## API
Node backend application to accept restful and call other dependence

## WORKER
Node backend applicaiton listen redis process

## REDIS
Store values and Publish, Subscrib the message like JMS



