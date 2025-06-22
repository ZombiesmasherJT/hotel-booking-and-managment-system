const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({ error: "Authorization required, no token provided" });
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Store the decoded user details in req.user  which is used in the token verification

            console.log("Decoded Token:", decoded); // Debugging

            // If roles are defined, check if the user's role is allowed
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                console.log("Access denied for role:", decoded.role); // Debugging
                return res.status(403).json({ msg: "You are not authorized to access this user role" });
            }

            next();
        } catch (error) {
            return res.status(401).json({ msg: "Token is not valid", error: error.message });
        }
    };
};
module.exports = authMiddleware;