# Work Order Integration Script

## Overview
This Node.js script automates the process of retrieving **open work orders** from the **MaintainX API**, calculating due dates based on priority, and updating those work orders with the calculated due dates. The script uses **Node.js**, **Moment.js** for date calculations, and **fetch** for making API requests.

The script performs the following steps:
1. Fetches all open work orders from the MaintainX API.
2. Processes work orders that do not have a due date by calculating the due date based on their priority.
3. Sends an update request to set the newly calculated due date for each work order.

## Features
- **Fetches open work orders** from MaintainX.
- **Calculates due dates** based on the priority (`HIGH`, `MEDIUM`, `LOW`).
- **Updates work orders** with the calculated due dates via a PATCH request.
- Logs information about the processing of each work order, including the work order ID, priority, and calculated due date.

## Prerequisites

- **Node.js**: Make sure that Node.js is installed on your system.
  - [Download Node.js](https://nodejs.org/)
- **API Key**: You need to have a valid **MaintainX API Key** to authenticate the requests.

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/work-order-integration.git
    cd work-order-integration
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables:
   - Create a `.env` file in the root directory of the project and add the following line:
     ```env
     API_KEY=your_maintainx_api_key
     ```

## How the Code Works

### Step 1: Send API Call to Get All Work Orders
The script starts by fetching all open work orders from the MaintainX API using the `GET` request. It includes the `Authorization` header for API key-based authentication.

### Step 2: Process Work Orders Without Due Date by Priority
Each work order is checked for a `dueDate`. If the `dueDate` is not set:
- **High Priority**: Assigns the due date to 3 days from today.
- **Medium Priority**: Assigns the due date to 5 days from today.
- **Low Priority**: Assigns the due date to 10 days from today.

The date is calculated using **Moment.js** and added to the work order's data.

### Step 3: Set the Due Date
Once the due date is calculated, the script sends a **PATCH** request to the MaintainX API to update the work order with the newly assigned due date.

### Logging
During processing, the script logs the following information for each work order:
- **Work Order ID**
- **Priority**
- **Calculated Due Date**

## Running the Script

To execute the script, simply run the following command:

```bash
node setDueDate.js
