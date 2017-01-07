### Install

- `git clone`
- `npm install`
- `npm run build`
- `npm run browserify`


### Database

There is a docker-compose.yaml and table.sql which are used to setup postgress db.
```
docker-compose up
```
If you want to use some other local DB, just put connection info into `src/db.js`


### Load data
```npm run loadData```


### Start server
```
npm start
```
Server will be accessible from localhost:3000


