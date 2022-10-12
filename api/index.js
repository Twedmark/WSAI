const express = require('express');

const app = express();

const port = 4000;

app.listen(port, (err) => {
  if (err) {
    console.log("error listening on port 4000 ", err);
  }else {
    console.log("listening on port 4000");
  }
})
