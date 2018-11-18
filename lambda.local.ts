const lambdaLocal = require('lambda-local');
const path = require('path')
let express = require('express')
let app = express()
let port = process.env.PORT || 3000
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.post('/', (req: any, res: any) => {
    let jsonPayload = req.body || require('./sample.json')
    lambdaLocal.execute({
        event: jsonPayload,
        lambdaPath: path.join(__dirname, 'index.js'),
        callback: function (err: any, data: any) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                res.send(data)
            }
        }
    });
})

app.listen(port, () => console.log(`Server running on port ${port}!`))