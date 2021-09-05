# COVID stats API

## Requirements

Testing with:

- node v14.17.5
- npm 6.14.14
- yarn 1.22.11

```bash
npm install -g yarn
```

## Dev/Debug time

### To build

```bash
yarn
```

### To run

```bash
npm start
```

### Debug mode

```bash
DEBUG=covid-stats-parser:* npm start
```

## Docker

### Create Docker image

```bash
docker build . -t covid-stats-parser
```

### Run docker

```bash
docker run -p 3000:3000 -d covid-stats-parser
```

## Zipdrop

You can upload and run this project on zipdrop.xyz

```bash
zip -FS -r covid-stats-parser-v0.0.1.zip . \
  -x ./node_modules/\* \
  -x ./.git\* \
  -x ./\*.zip
```

Then upload your package

```bash
curl -F data=@covid-stats-parser-v0.0.1.zip https://zipdrop.xyz/upload\?token\=anytoken
```
