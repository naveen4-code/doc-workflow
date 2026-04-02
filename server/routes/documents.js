const router = require("express").Router();
const db = require("../db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("file"), async (req, res) => {
  const { title, user_id, type_id, sector_id } = req.body;
  const result = await db.query(
    "INSERT INTO document(title,file_url,user_id,type_id,sector_id,template_id) VALUES($1,$2,$3,$4,$5,1) RETURNING *",
    [title, req.file.path, user_id, type_id, sector_id]
  );
  res.json(result.rows[0]);
});
module.exports = router;