# Crown Coins Casino Automation Tests

This repository contains an automated test for the Crown Coins Casino web application. The test focuses on validating core user functionalities, including login, profile update, and coin balance verification.

## Table of Contents
1. Installation.
2. Environment Setup.
3. Running Tests.
4. Test Purpose and Details.
5. Contributing.
6. License.

## Installation

### Prerequisites:
- Node.js (v14 or later).
- pnpm package manager (if you don't have pnpm installed, you can install it by running: npm install -g pnpm).

### Steps to Install:
1. Clone the repository: git clone https://github.com/Saviel-A/crowncoinscasino-automation.git.
2. Navigate to the project directory: cd crown-coins-casino.
3. Install dependencies using pnpm: pnpm install.

## Environment Setup

Before running the tests, you will need to configure the environment variables for different environments (development, staging, and production). These are defined in .env files that correspond to each environment.

Create a .env file for the required environment (.env.development, .env.staging, or .env.production).

Add the following required variables in the appropriate .env file:

- BASE_URL - The base URL of the application.
- USER_EMAIL - The user email for login.
- USER_PASSWORD - The user password.
- BRAND - The brand name of the application.
- REPORT_PATH - The directory where test reports will be saved.

## Running Tests

### Available Scripts:
You can run the tests for different environments by using the following commands:

- Development Environment: pnpm test:development
- Staging Environment: pnpm test:staging
- Production Environment: pnpm test:production

Each script will set the corresponding `NODE_ENV` variable (development, staging, or production) and execute the tests accordingly. Playwright will look for the `.env.NODE_ENV` file and load the required environment variables. Make sure the `.env` files are properly set up before running these commands.

## Test Purpose and Details

### Test Case: User Profile Update and Coin Balance Verification

#### Test Purpose:
The purpose of this test is to ensure the following:

- The user is able to log in successfully.
- The user can update their profile (username and avatar).
- The profile updates are correctly reflected in the "My Profile" section.
- The coin balances are accurate for both coin types (Social and Sweep).

#### Preconditions:
- Email: `watchdogstest02+11@sunfltd.com`
- Password: `123456`
- The test environment is configured with the correct `.env` file (`.env.development`, `.env.staging`, or `.env.production`).
- Playwright is installed and set up correctly.

#### Steps to Execute:
1. Open the URL: [https://app.dev.crowncoinscasino.com/](https://app.dev.crowncoinscasino.com/)
2. Log in with the following credentials:
 - Email: `watchdogstest02+11@sunfltd.com`
 - Password: `123456`
3. Click on the Menu button.
4. Click on My Account.
5. In the profile dialog, click the Edit (pencil) button to update the profile.
6. Update the username with a random string.
7. Choose a random avatar.
8. Click Apply.

#### Validation:
- Open My Profile and verify that the username has been updated.
- Print the user's coin amount for both coin types (use the coin switcher to view each type).

#### Post-Conditions:
No cleanup is needed since this is a functional test. The test does not change any server-side data.

#### Validation Criteria:
- The username should be updated successfully.
- The correct coin balances should be displayed for both coin types.
