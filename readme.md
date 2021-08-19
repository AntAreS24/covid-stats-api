# COVID stats API
## Requirements
Testing with:
- node v14.17.5
- npm 6.14.14
- yarn 1.22.11

```
npm install -g yarn
```

## Dev/Debug time
### To build

```
yarn
```

### To run

```
npm start
```

### Debug mode

```
DEBUG=covid-stats-parser:* npm start
```

## Docker
### Create Docker image

```
docker build . -t covid-stats-parser
```

### Run docker

```
docker run -p 3000:3000 -d covid-stats-parser
```