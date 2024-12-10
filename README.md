# Point-Reward-Backend

This project is a Backend for a Point Reward System using Node.js and Express, connecting to the MongoDB database and using JWT for Authenication.

## feature

-Login, Register users
-Retrieve a list of products/special privileges (Products, Advertised Products)
-Redeem rights (Redemption)
-Use JWT for Authentication.
-Use MongoDB to store user, product, and redemption information.

## Installation and use

npm install
node app.js

### 1. Prepare the environment

-Install [Node.js](https://nodejs.org/en/download/) at least version 14 or higher.
-Access to [MongoDB](https://www.mongodb.com/) if installed on the machine itself or using MongoDB Atlas (Cloud).
-Create `.env` file in project (located in folder `POINT-REWARD-BACKEND`) and set the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
