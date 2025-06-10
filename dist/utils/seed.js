"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserList_1 = __importDefault(require("../models/UserList"));
dotenv_1.default.config();
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB Connected for seeding...');
        // Clear existing data
        yield UserList_1.default.deleteMany({});
        console.log('Existing UserList data cleared.');
        // Create a mock user list
        const mockUserList = new UserList_1.default({
            userId: 'mockUser123',
            contentIds: [
                'movie_abc_1',
                'tvshow_xyz_1',
                'movie_def_2',
                'tvshow_pqr_2',
                'movie_ghi_3',
                'tvshow_uvw_3',
                'movie_jkl_4',
                'tvshow_mno_4',
                'movie_stu_5',
                'tvshow_fgh_5',
                'movie_ijk_6',
                'tvshow_lmn_6',
            ],
        });
        yield mockUserList.save();
        console.log('Mock user list seeded successfully.');
        mongoose_1.default.connection.close();
    }
    catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }
});
seedDB();
