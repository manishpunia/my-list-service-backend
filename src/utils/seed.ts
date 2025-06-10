import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserList from '../models/UserList';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await UserList.deleteMany({});
    console.log('Existing UserList data cleared.');

    // Create a mock user list
    const mockUserList = new UserList({
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

    await mockUserList.save();
    console.log('Mock user list seeded successfully.');

    mongoose.connection.close();
  } catch (err: any) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDB();