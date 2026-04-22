const Service = require("../../services/complaint/ComplaintService");
const AuditService = require("../../services/common/AuditService");

exports.create = async (req, res) => {
    try {
        console.log("Complaint create request body:", req.body);
        console.log("Complaint create user:", req.user);
        const complaint = await Service.createComplaint(req.user.id, req.body);
        await AuditService.logComplaintAction(req.user.id, complaint.id, "Created", `Issue: ${complaint.issue_type}`);
        res.status(201).json(complaint);
    } catch (err) {
        console.error("Error creating complaint:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getTenantComplaints = async (req, res) => {
    try {
        const complaints = await Service.getTenantComplaints(req.user.id);
        res.json(complaints);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getLandlordComplaints = async (req, res) => {
    try {
        const complaints = await Service.getLandlordComplaints(req.user.id);
        res.json(complaints);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const updated = await Service.updateComplaintStatus(
            req.params.id,
            req.body.status
        );
        await AuditService.logComplaintAction(req.user.id, req.params.id, "Updated Status", `New Status: ${req.body.status}`);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
