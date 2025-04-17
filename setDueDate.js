const fetch = require('node-fetch');
const moment = require('moment');  // or you can use day.js if you prefer
const dotenv = require('dotenv').config();

const API_KEY = process.env.API_KEY;  // Make sure to set your API_KEY as environment variable

// Step 1: Send API call to get all work orders with status OPEN
const getWorkOrders = async () => {
  try {
    const response = await fetch('https://api.getmaintainx.com/v1/workorders?statuses=OPEN', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching work orders: ${response.statusText}`);
    }

    const data = await response.json();
    return data.workOrders; // Assuming the API returns an array of work orders
  } catch (error) {
    console.error(error);
  }
};

// Step 2: Process the work orders to set the dueDate based on priority
const processWorkOrders = (workOrders) => {
  return workOrders.map(workOrder => {
    if (!workOrder.dueDate) {  // Only process work orders that don't have a dueDate
      let priority = workOrder.priority || 'LOW';  // Default to 'LOW' if no priority is set
      let dueDate;

      // Calculate dueDate based on priority
      switch (priority) {
        case 'HIGH':
          dueDate = moment().add(3, 'days').toISOString(); // 3 days from now
          break;
        case 'MEDIUM':
          dueDate = moment().add(5, 'days').toISOString(); // 5 days from now
          break;
        case 'LOW':
          dueDate = moment().add(10, 'days').toISOString(); // 10 days from now
          break;
        default:
          dueDate = moment().add(15, 'days').toISOString(); // Default to 15 days if priority is unrecognized
      }

      // Log the work order ID, priority, and the calculated dueDate
      console.log(`Processing work order ${workOrder.id}: Priority - ${priority}, Calculated dueDate - ${dueDate}`);

      // Add the calculated dueDate to the work order
      workOrder.dueDate = dueDate;
    }
    return workOrder;
  });
};

// Step 3: Send PATCH request to update work order with the calculated dueDate
const updateWorkOrder = async (workOrderId, dueDate) => {
  try {
    const response = await fetch(`https://api.getmaintainx.com/v1/workorders/${workOrderId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dueDate })
    });

    if (!response.ok) {
      throw new Error(`Error updating work order ${workOrderId}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Work order ${workOrderId} updated with due date: ${dueDate}`);
  } catch (error) {
    console.error(error);
  }
};

// Main function to execute the workflow
const main = async () => {
  const workOrders = await getWorkOrders();
    //console.log(workOrders)
  if (workOrders && workOrders.length > 0) {
    console.log(`Found ${workOrders.length} open work orders.`);
    const processedWorkOrders = processWorkOrders(workOrders);

    for (const workOrder of processedWorkOrders) {
      if (!workOrder.dueDate) continue;  // Skip work orders that still have no dueDate
      await updateWorkOrder(workOrder.id, workOrder.dueDate);  // Update work order with new dueDate
    }
  } else {
    console.log('No open work orders found.');
  }
};

// Run the main function
main();
