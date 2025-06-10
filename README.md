-----

# My List Service

This service implements core "My List" functionalities for a user to manage their favorite movies and TV shows. It provides API endpoints to add items, remove items, and retrieve a paginated list of items associated with a user.

-----

## Functional Requirements Covered

  * *Add to My List*: Allows a user to add a movie or TV show to their personal list using a unique contentId. The service ensures that duplicate items can't be added.
  * *Remove from My List*: Enables a user to remove an item from their list using its contentId.
  * *List My Items*: Retrieves all items (by contentId) currently in a user's list. The response is paginated to handle potentially large lists efficiently, returning content IDs, total items, current page, and total pages.

-----

## Non-Functional Requirements Addressed

  * *Performance of “List My Items”*: This endpoint is designed for high performance (targeting under 10 milliseconds). It achieves this by:
      * Utilizing *MongoDB* with an *indexed userId* on the UserList collection, ensuring extremely fast document lookups.
      * Storing contentId`s as an array directly within the `UserList document, minimizing database queries for list retrieval.
      * Implementing *in-memory pagination* (Array.prototype.slice) after fetching the single user list document, which is highly efficient for typical user list sizes.
  * *Integration Tests: Comprehensive integration tests are provided using **Jest* and *Supertest*. These tests cover each API endpoint, including various success cases (e.g., item added, item removed, list retrieved) and error cases (e.g., duplicate item, item not found, missing contentId).

-----

## Technical Stack

  * *Backend*: TypeScript, Express.js
  * *Database*: MongoDB (via Mongoose ODM)
  * *Testing*: Jest, Supertest
  * *Environment Management*: dotenv
  * *Development Utility*: nodemon, ts-node

-----

## Assumptions Made During Implementation

  * *User Authentication*: Basic user authentication is assumed to be in place. For this assignment, a mock user ID (mockUser123) is hardcoded in the controllers for demonstration and testing purposes. In a production environment, this userId would come from the authenticated user's session or token.
  * *Content ID Representation*: contentId (for movies or TV shows) is treated as a simple, unique string identifier. The service focuses solely on managing the list of these IDs; it doesn't store, retrieve, or validate actual movie/TV show details (e.g., title, genre, director) as per the assignment's scope on the "My List" feature itself.
  * *No Frontend*: This project is a backend API only. There is no graphical user interface (UI) provided or required. API responses are in JSON format.

-----

## Design Choices & Optimization

  * *MongoDB Schema for UserList*: A single UserList document per user is used, containing an array of `contentId`s. This denormalized approach is highly performant for fetching a user's entire list because it's a single document lookup.
  * *Indexing*: An index on userId in the UserList collection ensures extremely fast lookups for List My Items and other operations by user.
  * *In-memory Pagination*: For List My Items, the entire contentId`s array for a given user is fetched, and then pagination (`slice) is applied in memory. This is highly efficient given that fetching a single document by its indexed ID is very fast in MongoDB. For extremely large lists (millions of items per user), a different pagination strategy (e.g., using $slice in a projection within MongoDB or a more complex schema) might be considered, but for typical user lists, this approach easily meets the \<10ms requirement.
  * *Error Handling*: Basic error handling is implemented for API endpoints, returning appropriate HTTP status codes and messages.

-----

## Local Setup and Running Instructions

Follow these steps to set up and run the "My List Service" on your local machine.

### Prerequisites

  * *Node.js*: (v18 or higher recommended) - [Download & Install Node.js](https://nodejs.org/en/download/)
  * *npm*: (Node Package Manager, comes with Node.js)
  * *MongoDB*: (running locally or accessible via a connection string) - [Download & Install MongoDB Community Server](https://www.mongodb.com/try/download/community)

### Installation

1.  *Clone the repository:*

    bash
    git clone https://github.com/manishpunia/my-list-service-backend
    cd my-list-service-backend
    

2.  *Install project dependencies:*

    bash
    npm install
    

### Environment Variables Setup

1.  Create a file named .env in the *root directory* of your project.
2.  Add the following lines to your .env file:
    dotenv
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/mylistdb
    
      * *PORT*: The port your Express application will listen on.
      * *MONGO_URI*: Your MongoDB connection string. If your local MongoDB instance runs on the default port, the provided URI should work. Otherwise, adjust it accordingly.

### Running MongoDB Locally

Ensure your local MongoDB instance is running before starting the application or tests.

  * *On Windows*: Search for "Services," find "MongoDB Server" (or similar), and start it if it's not running.
  * *On macOS (with Homebrew)*: brew services start mongodb-community
  * *On Linux (with systemd)*: sudo systemctl start mongod

### Data Seeding (Optional)

A seeding script (src/utils/seed.ts) is provided to populate the UserList collection with a mock user and some initial items. This is useful for local development and testing.

1.  Run the seed script:
    bash
    npm run seed
    
    This script connects to your MONGO_URI, deletes any existing UserList data, and then adds a mock user with a few sample `contentId`s.

### Running the Application

  * *Development Mode (with Hot Reload)*:

    bash
    npm run dev
    

    The server will start on http://localhost:5000 (or your specified PORT) and automatically restart when you make changes to your TypeScript files. You should see "MongoDB Connected..." in the console.

  * *Production Mode (Build and Start)*:

    1.  *Build the TypeScript code (compiles to JavaScript in dist folder):*
        bash
        npm run build
        
    2.  *Start the compiled application:*
        bash
        npm start
        

    The server will start on http://localhost:5000. This command runs the optimized JavaScript code.

### Running Integration Tests

All integration tests are located in src/tests/userList.test.ts.

  * *Execute the test suite:*
    bash
    npm test
    
    Jest will run all tests, connecting to a separate test_mylistdb database (as configured in userList.test.ts) to ensure test isolation. All tests should pass.

-----

## API Endpoints Documentation

The service exposes the following RESTful API endpoints. All responses are in *JSON* format.

*Base URL (Local Development)*: http://localhost:5000/api/my-list
*Base URL (Deployed)*: https://my-list-service-backend.onrender.com/api/my-list

-----

### 1\. Add to My List (Create Operation)

  * *Endpoint*: /add

  * *Method*: POST

  * *Description*: Adds a new movie or TV show ID to the user's list. Prevents duplicate entries.

  * *Request Body*:

    json
    {
      "contentId": "string" // e.g., "movie_titanic", "tvshow_friends_s01e01"
    }
    

  * *Success Responses*:

      * *200 OK* (Item added to existing list)
        json
        {
          "message": "Item added to list successfully.",
          "userList": {
            "userId": "mockUser123",
            "contentIds": ["item1", "item2", "new_item"],
            "_id": "60c72b2f9b1d8f001c8a1b00",
            "__v": 0
          }
        }
        
      * *201 Created* (Item added to a newly created list for the user)
        json
        {
          "message": "Item added to new list successfully.",
          "userList": {
            "userId": "mockUser123",
            "contentIds": ["new_item"],
            "_id": "60c72b2f9b1d8f001c8a1b01",
            "__v": 0
          }
        }
        

  * *Error Responses*:

      * *400 Bad Request*: If contentId is missing in the request body.
        json
        {
          "message": "Content ID is required."
        }
        
      * *409 Conflict*: If the contentId is already present in the user's list.
        json
        {
          "message": "Item already in your list."
        }
        
      * *500 Internal Server Error*: For other unexpected server-side issues.

  * *Example curl Command (for Git Bash/WSL/Linux/macOS)*:

    bash
    curl -X POST https://my-list-service-backend.onrender.com/api/my-list/add \
    -H "Content-Type: application/json" \
    -d '{"contentId": "movie_interstellar"}'
    

    (Run this command in your terminal. You can add the same item again to test the 409 Conflict error.)

  * *Example PowerShell Command (for Windows PowerShell)*:

    powershell
    $headers = @{ "Content-Type" = "application/json" }
    $body = @{ contentId = "movie_interstellar" } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://my-list-service-backend.onrender.com/api/my-list/add" -Method Post -Headers $headers -Body $body
    

    (Run this command in your PowerShell terminal. You can add the same item again to test the 409 Conflict error.)

-----

### 2\. Remove from My List (Delete Operation)

  * *Endpoint*: /remove/:contentId

  * *Method*: DELETE

  * *Description*: Removes an item from the user's list using its unique contentId.

  * *URL Parameters*:

      * :contentId (string, required): The unique ID of the item to remove.

  * *Success Response*:

      * *200 OK*
        json
        {
          "message": "Item removed from list successfully.",
          "userList": {
            "userId": "mockUser123",
            "contentIds": ["remaining_item_1", "remaining_item_2"],
            "_id": "60c72b2f9b1d8f001c8a1b00",
            "__v": 1
          }
        }
        

  * *Error Responses*:

      * *404 Not Found*: If the user's list is not found, or if the specified contentId is not in the list.
        json
        {
          "message": "User list not found for this user."
        }
        # OR
        {
          "message": "Item not found in your list."
        }
        
      * *500 Internal Server Error*: For other unexpected server-side issues.

  * *Example curl Command*:

    bash
    curl -X DELETE https://my-list-service-backend.onrender.com/api/my-list/remove/movie_interstellar
    

  * *Example PowerShell Command*:

    powershell
    Invoke-RestMethod -Uri "https://my-list-service-backend.onrender.com/api/my-list/remove/movie_interstellar" -Method Delete
    

-----

### 3\. List My Items (Read Operation)

  * *Endpoint*: /

  * *Method*: GET

  * *Description: Retrieves all items in the user's list, with pagination support. **Note: This API returns JSON data. To view it formatted in a web browser, install a JSON formatter extension (e.g., "JSON Viewer Pro" for Chrome/Edge or "JSONView" for Firefox).*

  * *Query Parameters (Optional)*:

      * page (number, default: 1): The page number to retrieve.
      * limit (number, default: 10): The maximum number of items per page.

  * *Success Response*:

      * *200 OK* (If list contains items)
        json
        {
          "message": "My list retrieved successfully.",
          "items": ["item_on_page_1", "item_on_page_2", "item_on_page_3"],
          "totalItems": 25,
          "currentPage": 1,
          "totalPages": 3
        }
        
      * *200 OK* (If list is empty)
        json
        {
          "message": "Your list is empty.",
          "items": [],
          "totalItems": 0,
          "currentPage": 1,
          "totalPages": 0
        }
        

  * *Error Responses*:

      * *500 Internal Server Error*: For other unexpected server-side issues.

  * *Example curl Command (without pagination)*:

    bash
    curl https://my-list-service-backend.onrender.com/api/my-list
    

  * *Example curl Command (with pagination)*:

    bash
    curl https://my-list-service-backend.onrender.com/api/my-list?page=1&limit=5
    

  * *Example PowerShell Command (without pagination)*:

    powershell
    Invoke-RestMethod -Uri "https://my-list-service-backend.onrender.com/api/my-list" -Method Get
    

  * *Example PowerShell Command (with pagination)*:

    powershell
    Invoke-RestMethod -Uri "https://my-list-service-backend.onrender.com/api/my-list?page=1&limit=5" -Method Get
    

-----

## Deployment and CI/CD

This service is designed for deployment on platforms like Render.com.

  * *Hosting: The service is deployed on **Render.com*.
  * *CI/CD Pipeline*: A basic CI/CD pipeline is integrated via Render's connection to the GitHub repository. Any push to the main branch automatically triggers a new build and deployment on Render, ensuring continuous integration and delivery.

-----
