const Service = require("../services/TenantMemberService");

exports.addMember = async (req, res) => {
  try {
    await Service.addMember(req.user.id, req.params.tenantId, req.body);
    res.status(201).json({ message: "Family member added" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Service.getAllMembers(
      req.user.id,
      req.params.tenantId
    );
    res.json(members);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await Service.updateMember(
      req.user.id,
      req.params.memberId,
      req.body
    );
    res.json(member);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await Service.deleteMember(req.user.id, req.params.memberId);
    res.json({ message: "Family member deleted" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
