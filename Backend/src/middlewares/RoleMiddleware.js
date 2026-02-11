const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userRole = req.user.role?.toUpperCase();

    if (Array.isArray(requiredRole)) {
      const requiredRolesUpper = requiredRole.map(r => r.toUpperCase());
      if (!requiredRolesUpper.includes(userRole)) {
        return res
          .status(403)
          .json({ error: "Access denied. Insufficient permissions" });
      }
    } else if (userRole !== requiredRole.toUpperCase()) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions" });
    }

    next();
  };
};
module.exports = roleMiddleware;
