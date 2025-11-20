const role =
  (requiredRoles = []) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

export default role;
