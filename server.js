const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Node.js & MySQL API is running");
});

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apb_api_db",
  port: 4306,
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

// CRUD User routes
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    res.json({ message: "User added successfully", id: result.insertId });
  });
});

app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE users SET name=?, email=? WHERE id=?",
    [name, email, id],
    (err) => {
      if (err) throw err;
      res.json({ message: "User updated successfully" });
    },
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "User deleted successfully" });
  });
});

// CRUD post routes
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/posts", (req, res) => {
  const { title, content, user_id } = req.body;
  const sql = "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)";
  db.query(sql, [title, content, user_id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Post added successfully", id: result.insertId });
  });
});

app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE posts SET title=?, content=? WHERE id=?",
    [title, content, id],
    (err) => {
      if (err) throw err;
      res.json({ message: "Post updated successfully" });
    },
  );
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM posts WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "Post deleted successfully" });
  });
});

app.get("/userposts/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM posts WHERE user_id=?", [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Likes routes
app.post("/likes", (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
  db.query(sql, [user_id, post_id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Like added successfully", id: result.insertId });
  });
});

app.delete("/likes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM likes WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "Like deleted successfully" });
  });
});

// Comments routes
app.post("/comments", (req, res) => {
  const { user_id, post_id, content } = req.body;
  const sql = "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)";
  db.query(sql, [user_id, post_id, content], (err, result) => {
    if (err) throw err;
    res.json({ message: "Comment added successfully", id: result.insertId });
  });
});

app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM comments WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "Comment deleted successfully" });
  });
});

app.get("/postcomments/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM comments WHERE post_id=?", [id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
