const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/state-definition', (req, res) => {
  const stateDefinition = {
    id: 'lightSwitch',
    initial: 'off',
    states: {
      off: {
        on: { SWITCH: 'on' }
      },
      on: {
        on: { SWITCH: 'off' }
      }
    }
  };

  res.json(stateDefinition);
});

app.get('/state-definition/:filename', (req, res) => {
  const filename = req.params.filename;
  
  fs.readFile(path.join(__dirname, 'public', filename), 'utf8', (err, data) => {
    if (err) {
        res.status(500).send("Error reading state definition");
    } else {
        res.json(JSON.parse(data));
    }
  });
});

app.listen(port, () => {
  console.log(`State server listening at http://localhost:${port}`);
});
