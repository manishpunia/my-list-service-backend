import { Request, Response } from 'express';
import UserList, { IUserList } from '../models/UserList';

// Mock User ID for demonstration (replace with actual authentication in a real app)
// Assume basic user authentication is in place; you can use a mock user ID for testing.
const MOCK_USER_ID = 'mockUser123';

/**
 * Adds a movie or TV show to the user's list.
 * Each item can be identified by a unique ID, and the user's list should not contain duplicates.
 * @param req Express Request object
 * @param res Express Response object
 */
export const addToList = async (req: Request, res: Response): Promise<void> => {
  const { contentId } = req.body;

  if (!contentId) {
    res.status(400).json({ message: 'Content ID is required.' });
    return; // Early exit after sending response
  }

  try {
    let userList = await UserList.findOne({ userId: MOCK_USER_ID });

    if (!userList) {
      // Create new list if not exists for the mock user
      userList = new UserList({
        userId: MOCK_USER_ID,
        contentIds: [contentId],
      });
      await userList.save();
      res.status(201).json({ message: 'Item added to new list successfully.', userList });
      return; // Early exit after sending response
    }

    // Check for duplicates
    if (userList.contentIds.includes(contentId)) {
      res.status(409).json({ message: 'Item already in your list.' });
      return; // Early exit after sending response
    }

    // Add item to the existing list
    userList.contentIds.push(contentId);
    await userList.save(); // Save the updated list
    res.status(200).json({ message: 'Item added to list successfully.', userList });
    return; // Early exit after sending response
  } catch (error: any) {
    console.error('Error adding to list:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
    return; // Early exit after sending response
  }
};

/**
 * Removes an item from the user's list using the item's unique ID.
 * @param req Express Request object
 * @param res Express Response object
 */
export const removeFromList = async (req: Request, res: Response): Promise<void> => {
  const { contentId } = req.params; // Item ID comes from URL parameters

  if (!contentId) {
    res.status(400).json({ message: 'Content ID is required in path.' });
    return; // Early exit
  }

  try {
    const userList = await UserList.findOne({ userId: MOCK_USER_ID });

    if (!userList) {
      res.status(404).json({ message: 'User list not found for this user.' });
      return; // Early exit
    }

    const initialLength = userList.contentIds.length;
    // Filter out the item to be removed
    userList.contentIds = userList.contentIds.filter(id => id !== contentId);

    // Check if the length changed, meaning an item was actually removed
    if (userList.contentIds.length === initialLength) {
      res.status(404).json({ message: 'Item not found in your list.' });
      return; // Early exit
    }

    await userList.save(); // Save the updated list
    res.status(200).json({ message: 'Item removed from list successfully.', userList });
    return; // Early exit
  } catch (error: any) {
    console.error('Error removing from list:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
    return; // Early exit
  }
};

/**
 * Retrieves all items in the user's list.
 * The response is paginated to handle potentially large lists efficiently.
 * @param req Express Request object
 * @param res Express Response object
 */
export const listMyItems = async (req: Request, res: Response): Promise<void> => {
  // Parse pagination parameters from query string, defaulting to page 1, limit 10
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit; // Calculate how many items to skip

  try {
    // Find the user's list by their mock ID
    const userList = await UserList.findOne({ userId: MOCK_USER_ID });

    // If the list doesn't exist or is empty
    if (!userList || userList.contentIds.length === 0) {
      res.status(200).json({
        message: 'Your list is empty.',
        items: [], // Return an empty array
        totalItems: 0,
        currentPage: page,
        totalPages: 0,
      });
      return; // Early exit
    }

    const totalItems = userList.contentIds.length;
    // Apply pagination by slicing the contentIds array
    const paginatedItems = userList.contentIds.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalItems / limit);

    // In a real scenario, you would typically use these paginatedItems (content IDs)
    // to query another collection (e.g., Movies or TVShows) to get the full details
    // of each item. For this assignment, we're returning the IDs directly as per
    // the focus on the "My List" functionality itself.
    res.status(200).json({
      message: 'My list retrieved successfully.',
      items: paginatedItems,
      totalItems,
      currentPage: page,
      totalPages,
    });
    return; // Early exit
  } catch (error: any) {
    console.error('Error listing items:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
    return; // Early exit
  }
};