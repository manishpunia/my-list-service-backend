# My List Service

This service implements the "Add to My List", "Remove from My List", and "List My Items" features for a user's movie/TV show watch list.

## Functional Requirements Covered:
- *Add to My List*: Adds a unique content ID to a user's list. Prevents duplicates.
- *Remove from My List*: Removes a content ID from a user's list.
- *List My Items*: Retrieves a paginated list of content IDs for a user.

## Non-Functional Requirements Covered:
- *Performance of “List My Items”*: Optimized for speed by using MongoDB with an index on userId. Direct fetching of the UserList document by userId is extremely fast. Pagination is handled in-memory from the retrieved array.
- *Integration Tests*: Comprehensive integration tests using Jest and Supertest cover all API endpoints, including success and error scenarios.

## Technical Requirements:
- *Backend*: TypeScript with Express.js.
- *Database*: MongoDB (via Mongoose).
- *Testing Framework*: Jest with Supertest.

## Assumptions:
- *User Authentication*: Assumed to be in place. A MOCK_USER_ID (mockUser123) is hardcoded in the controller for demonstration and testing purposes. In a production environment, this would be derived from an authenticated user's session or token.
- *Content ID Representation*: The contentId (for movies or TV shows) is treated as a simple string unique identifier. The service does not attempt to fetch or validate the actual movie/TV show details, as per the assignment's focus on the "My List" functionality.
- *Data Model Simplicity*: The UserList schema stores only userId and contentIds. The Movie and TVShow interfaces provided in the assignment context are acknowledged but not directly translated into MongoDB schemas for this specific "My List" feature, as the assignment primarily asks to implement the list functionality.

## Design Choices & Optimization:
- *MongoDB Schema for UserList*: A single UserList document per user is used, containing an array of contentIds. This denormalized approach is highly performant for fetching a user's entire list because it's a single document lookup.
- *Indexing*: An index on userId in the UserList collection ensures extremely fast lookups for List My Items and other operations by user.
- *In-memory Pagination*: For List My Items, the entire contentIds array for a given user is fetched, and then pagination (slice) is applied in memory. This is highly efficient given that fetching a single document by its indexed ID is very fast in MongoDB. For extremely large lists (millions of items per user), a different pagination strategy (e.g., using $slice in a projection within MongoDB or a more complex schema) might be considered, but for typical user lists, this approach easily meets the <10ms requirement.
- *Error Handling*: Basic error handling is implemented for API endpoints, returning appropriate HTTP status codes and messages.

## Data Scripts:
A seeding script (src/utils/seed.ts) is provided to populate the UserList collection with a mock user and some initial items. This is useful for local development and testing.

## Instructions for Setting Up and Running the Application:

### Prerequisites:
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- MongoDB (running locally or accessible via a connection string)

### 1. Clone the Repository:
```bash
git clone <your-repo-url>
cd my-list-service