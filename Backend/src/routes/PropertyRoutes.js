const router = require("express").Router();
const controller = require("../controllers/PropertyController");
const auth = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");

router.post("/addproperty", auth, role("LANDLORD"), controller.createProperty);
router.get("/allproperties", controller.getAllProperties);
router.get("/myproperties", auth, role("LANDLORD"), controller.getLandlordProperties);
router.get("/:id", controller.getPropertyDetails);
router.put("/:id", auth, role("LANDLORD"), controller.updateProperty);
router.delete("/:id", auth, role("LANDLORD"), controller.deleteProperty);

module.exports = router;
