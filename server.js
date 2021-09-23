const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = process.env.PORT || 4000;
// const IP_ADDRESS = process.env.IP_ADDRESS;

let Todo = require('./todo.model');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/todos', { useNewUrlParser: true });
mongoose.connect(
  'mongodb+srv://terraform-admin-user:0drMACUQKGWvGcky@cluster0.zxy59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todo-app',
  { useNewUrlParser: true }
);
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

todoRoutes.route('/').get((req, res) => {
  Todo.find((err, todos) => {
    if (err) console.log(err);
    else {
      res.json(todos);
    }
  });
});

todoRoutes
  .route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    Todo.findById(id, (err, todo) => {
      res.json(todo);
    });
  })
  .delete((req, res) => {
    const id = req.params.id;
    console.log(id);
    Todo.findByIdAndDelete(id, (err, todo) => {
      console.log;
      if (!err) res.status(404).send('Deleteion not possible', err);
      else res.json('Todo delete');
    });
  });

todoRoutes.route('/add').post((req, res) => {
  const todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: 'todo added successfully' });
    })
    .catch((err) => {
      res.status(400).send('adding new todo failed');
    });
});

todoRoutes.route('/update/:id').post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send('Data is not found');
    else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;
      todo
        .save()
        .then((todo) => {
          res.json('Todo updated');
        })
        .catch((err) => {
          res.status(400).send('Update not possible');
        });
    }
  });
});

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
  // app.listen(PORT, IP_ADDRESS, () => {
  console.log('Server is running on port ' + PORT);
});
