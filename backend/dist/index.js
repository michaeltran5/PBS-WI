"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const customApi_1 = __importDefault(require("./routes/customApi"));
const pbsProxy_1 = __importDefault(require("./routes/pbsProxy"));
// create express app
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// api routes
app.use('/api', pbsProxy_1.default);
app.use('/api', customApi_1.default);
// error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: { message: err.message, }, });
});
// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting the server:', err.message);
        process.exit(1);
    }
    console.log(`Server is listening on port ${PORT}`);
});
