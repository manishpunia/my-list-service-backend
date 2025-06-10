"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userListController_1 = require("../controllers/userListController");
const router = (0, express_1.Router)();
router.post('/add', userListController_1.addToList);
router.delete('/remove/:contentId', userListController_1.removeFromList);
router.get('/', userListController_1.listMyItems);
exports.default = router;
