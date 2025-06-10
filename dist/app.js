"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userListRoutes_1 = __importDefault(require("./routes/userListRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect Database
(0, db_1.default)();
// Init Middleware
app.use(express_1.default.json()); // Allows us to get data in req.body
// Define Routes
app.use('/api/my-list', userListRoutes_1.default);
app.get('/', (req, res) => {
    res.send('My List Service API');
});
exports.default = app; // Export app for testing
