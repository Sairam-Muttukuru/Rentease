const router = require("express").Router();
const auth = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");
const controller = require("../controllers/TenantMemberController");

router.post("/:tenantId", auth, role("LANDLORD"), controller.addMember);

router.get("/tenant/:tenantId",auth,role("LANDLORD"),controller.getAllMembers);

router.put("/:memberId", auth, role("LANDLORD"), controller.updateMember);

router.delete("/:memberId", auth, role("LANDLORD"), controller.deleteMember);

module.exports = router;
