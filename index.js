const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yn4st.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskManagementCollection = client.db('task_management').collection('daily_task');

        //add task to db
        app.post('/user', async (req, res) => {
            const newTask = req.body;
            console.log(newTask);
            const result = await taskManagementCollection.insertOne(newTask)
            res.send('post method success')
        })

        //read all task
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = taskManagementCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        //read task by id
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskManagementCollection.findOne(query);
            res.send(result);
        })

        //update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const editTask = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: editTask
            }
            const result = await taskManagementCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        })
    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Your  Task !')
})

app.listen(port, () => {
    console.log(`Task app listening on port ${port}`)
})