const model = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendCredentialsMail");

exports.getOverview = async () => {
  const users = await model.countUsers();
  const properties = await model.countProperties();
  const occupied = await model.countOccupied();
  const complaints = await model.countOpenComplaints();
  const revenue = await model.getMonthlyRevenue();

  return {
    users,
    properties,
    occupied_properties: occupied,
    open_complaints: complaints,
    monthly_revenue: revenue,
    occupancy_rate: Math.round((occupied / properties) * 100),
    occupancy_chart: [
      { name: "Occupied", value: occupied },
      { name: "Vacant", value: properties - occupied }
    ],
    revenue_chart: await model.revenueChart(),
    complaint_chart: await model.complaintChart(),
    user_growth_chart: await model.userGrowthChart(),
    recent_activity: await model.recentActivity()
  };
};

exports.getUsers = (adminId) => model.getUsers(adminId);
exports.toggleUserStatus = async (id, adminId) => {
  const res = await model.toggleUserStatus(id);
  await model.logAction(adminId, `Updated User status (ID: ${id})`);
  return res;
};

exports.getProperties = () => model.getProperties();
exports.togglePropertyStatus = async (id, adminId) => {
  const res = await model.togglePropertyStatus(id);
  await model.logAction(adminId, `Updated Property status (ID: ${id})`);
  return res;
};

exports.getComplaints = () => model.getComplaints();
exports.resolveComplaint = async (id, adminId) => {
  const res = await model.resolveComplaint(id);
  await model.logAction(adminId, `Resolved Complaint (ID: ${id})`);
  return res;
};
exports.convertComplaint = async (id, priority, adminId) => {
  const res = await model.convertComplaint(id, priority);
  await model.logAction(adminId, `Converted Complaint (ID: ${id}) to Service Request`);
  return res;
};

exports.getProviders = () => model.getProviders();

exports.addProvider = async (data, adminId) => {
  try {
    const normalizedData = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      company_name: data.company_name,
      service_type: data.service_type,
      service_area: data.service_area,
      phone: data.phone
    };

    const tempPass = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(tempPass, 10);

    const user = await model.createUser(normalizedData.email, hash, normalizedData.first_name, normalizedData.last_name);
    const provider = await model.createProvider(user.id, normalizedData);

    sendMail(normalizedData.email, tempPass).catch(e => console.error("Background Email Error:", e));

    await model.logAction(adminId, `Added Service Provider: ${normalizedData.company_name}`);

    return provider;
  } catch (err) {
    console.error("❌ addProvider failed:", err.message);
    throw err;
  }
};


exports.toggleProviderStatus = async (id, adminId) => {
  const res = await model.toggleProviderStatus(id);
  await model.logAction(adminId, `Updated Provider status (ID: ${id})`);
  return res;
};

exports.getPayments = () => model.getPayments();
exports.getLogs = () => model.getLogs();
