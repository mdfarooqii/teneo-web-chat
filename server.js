const express = require('express');

const app = express();
const port = process.env.PORT || 9000;
const { TENEO_ENGINE_URL } = process.env;

if (!TENEO_ENGINE_URL) {
  throw new Error('Missing environment variable TENEO_ENGINE_URL!');
}

app.set('view engine', 'ejs');

app.use(express.static('./dist/'));

app.get('/', (req, res) =>
  res.render('index', {
    TENEO_ENGINE_URL,
  })
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
