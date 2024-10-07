const router = require("express").Router();

const userController = require("../controllers/userController");
router.post("/user", userController.createUser);
router.get("/user", userController.getAllUsers);
router.put("/user", userController.updateUser);
router.delete("/user/:cpf", userController.deleteUser);

const orgController = require("../controllers/orgController")
router.post('/organizador', orgController.createOrg);
router.get('/organizador', orgController.getAllOrgs);
router.put('/organizador', orgController.updateOrg);
router.delete('/organizador/:id', orgController.deleteOrg);
module.exports = router;
