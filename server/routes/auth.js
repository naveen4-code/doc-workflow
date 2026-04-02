const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await db.query(
    "INSERT INTO users(email,password,role) VALUES($1,$2,'user') RETURNING *",
    [email, hash]
  );
  res.json(result.rows[0]);
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign(user, "secret");
  res.json({ token, role: user.role });
});
module.exports = router;