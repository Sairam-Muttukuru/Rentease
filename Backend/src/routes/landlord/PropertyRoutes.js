const router = require("express").Router();
const controller = require("../../controllers/landlord/PropertyController");
const amenityController = require("../../controllers/landlord/AmenityController");
const auth = require("../../middlewares/AuthMiddleware");
const role = require("../../middlewares/RoleMiddleware");

router.get("/amenities/list", auth, role("LANDLORD"), amenityController.getAmenities);
router.post("/amenities/add", auth, role("LANDLORD"), amenityController.addCustomAmenity);

router.post("/addproperty", auth, role("LANDLORD"), controller.createProperty);
router.get("/allproperties", controller.getAllProperties);
router.get("/myproperties", auth, role("LANDLORD"), controller.getLandlordProperties);
router.get("/:id", controller.getPropertyDetails);
router.put("/:id", auth, role("LANDLORD"), controller.updateProperty);
router.delete("/:id", auth, role("LANDLORD"), controller.deleteProperty);

module.exports = router;
