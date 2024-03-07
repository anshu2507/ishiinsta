const { Console } = require('console');
const express = require ('express');
const app = express();
const port = 5000;
const mongoose = require ('mongoose');
const {MONGOURI} = require('./Keys');




mongoose.connect(MONGOURI);

mongoose.connection.on('connected',()=>{
    console.log("Connected to mongo");
})
mongoose.connection.on('error',(err)=>{
    console.log("Error Connecting",err);
})

require('./models/user');
require('./models/post')
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

// 7k9NQplNoZUlzWhf
// 0NK4iWON02iu47rC

// const customMiddleware = (req,res,next)=>{
//     console.log("Middleware is excecuted");
//     next();
// }
// // app.use(customMiddleware);

// app.get('/',(req,res)=>{
//     console.log("Hello");
//     res.send("Hello World");
// })
// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("About");
//     res.send("About me");
// })

app.listen(port,()=>{
    console.log('Server is running on port ',port);
});