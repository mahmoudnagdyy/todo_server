const cors = require('cors')
const mysql = require('mysql2')
const express = require('express');
const app = express();
const port = 5000

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
})

app.use(express.json());

app.use(cors())


app.post('/addTask', (req, res, next) => {
    
    const {name} = req.body
    
    const query = `SELECT * FROM tasks WHERE name = '${name}'`
    
    connection.execute(query, (err, result, fields) => {
        if (err) {
            return res.send({message: 'Query Error', err})
        }
        
        if (result.length > 0) {
            return res.send('Task Already Exists')
        }
        
        const query = `INSERT INTO tasks(name) VALUES ('${name}')`
        
        connection.execute(query, (err, result, fields) => {
            
            if(err){
                return res.send({message: 'Query Error', err})
            }
            
            return res.send('Done')
            
        })
        
        
    })
    
})


app.get('/getTasks', (req, res, next) => {
    
    const query = `SELECT * FROM tasks`
    
    connection.execute(query, (err, result, fields) => {
        
        if(err){
            return res.send({message: 'Query Error', err})
        }
        
        return res.send(result)
        
    })
    
})


app.delete('/deleteTask/:id', (req, res, next) => {
    
    const {id} = req.params
    
    console.log(req.params);
    
    
    const query = `Delete FROM tasks WHERE id = '${id}'`
    
    connection.execute(query, (err, result, fields) => {
        
        if (err) {
            return res.send({message: 'Query Error', err})
        }
        
        return res.send('Done')
    })
    
    
})


app.get('/getTask/:id', (req, res, next) => {
    
    const {id} = req.params
    
    const query = `Select name FROM tasks WHERE id = '${id}'`
    
    connection.execute(query, (err, result, fields) => {
        
        if (err) {
            return res.send({message: 'Query Error', err})
        }
        
        return res.send(result[0].name)
        
    })
    
    
})


app.patch('/updateTask/:id', (req, res, next) => {
    
    const {id} = req.params
    const {name} = req.body
    
    
    const query = `UPDATE tasks SET name = '${name}' WHERE id = ${id}`
    
    connection.execute(query, (err, result, fields) => {
        
        if (err) {
            return res.send({message: 'Query Error', err})
        }
        
        return res.send('Done')
    })
    
})


app.patch('/completedTask/:id', (req, res, next) => {
    
    const {id} = req.params
    const {completedTask} =  req.body
    
    const query = `UPDATE tasks SET completed = ${completedTask} WHERE id = ${id}`
    
    connection.execute(query, (err, result, fields) => {
        if (err) {
            return res.send({message: 'Query Error', err})
        }
        
        const query = `SELECT completed FROM tasks WHERE id = ${id}`
        
        connection.execute(query, (err, result, fields) => {
            
            if (err) {
                return res.send({message: 'Query Error', err})
            }
            return res.send({completed: result[0].completed});
            
        })
        
    })
    
    
})



app.listen(port, () => {
    console.log('listening on port ........ ' + port);
});