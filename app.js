const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//routes
app.use('/', require('./routes/index'));

app.listen(port, console.log(`server started on port ${port}`));
