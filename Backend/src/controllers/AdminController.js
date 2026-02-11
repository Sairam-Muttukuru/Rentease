const service = require("../services/adminervice");

exports.overview = async (req, res) =>
  res.json(await service.getOverview());

exports.getUsers = async (req, res) =>
  res.json(await service.getUsers());

exports.toggleUserStatus = async (req, res) =>
  res.json(await service.toggleUserStatus(req.params.id));

exports.getProperties = async (req, res) =>
  res.json(await service.getProperties());

exports.togglePropertyStatus = async (req, res) =>
  res.json(await service.togglePropertyStatus(req.params.id));

exports.getComplaints = async (req, res) =>
  res.json(await service.getComplaints());

exports.resolveComplaint = async (req, res) =>
  res.json(await service.resolveComplaint(req.params.id));

exports.convertComplaint = async (req, res) =>
  res.json(await service.convertComplaint(req.params.id, req.body.priority));

exports.getProviders = async (req, res) =>
  res.json(await service.getProviders());

exports.addProvider = async (req, res) =>
  res.json(await service.addProvider(req.body));

exports.toggleProviderStatus = async (req, res) =>
  res.json(await service.toggleProviderStatus(req.params.id));

exports.getPayments = async (req, res) =>
  res.json(await service.getPayments());

exports.getLogs = async (req, res) =>
  res.json(await service.getLogs());
