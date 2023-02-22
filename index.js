const app = require('./src/app');

const APP_PORT = 4000;

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on port ${APP_PORT}`);
});
