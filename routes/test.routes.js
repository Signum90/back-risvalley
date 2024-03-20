const { Router } = require('express');

const router = Router();

router.get("/", async (req, res) => {
    res.status(200).json({ data: true, msg: 'test' });
});
  
module.exports = router;