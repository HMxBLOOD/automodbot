const app = require('express')();

app.get('/', (req, res) => {
	res.send('sent ping');
	console.log('ping recieved');
});
app.listen(3000);
