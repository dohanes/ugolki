const express = require("express");

const PORT = process.env.DEV === 'true' ? 3001 : 3000;

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});