import express from 'express';
const app = express();

app.use(express.json());

app.get('/Hello', async(req, res)=>{
    res.send('Hello');
})

app.listen(5000, ()=>{
    console.log("Application has started!");
})