// DONE: Cart persistence implemented using localStorage and remote sync via /api/cart/update/:id/:ipAddress.
//       Guest carts are preserved across refreshes and merged with authenticated carts when available.

// DONE: Browse page now fetches products on mount when they are not already loaded and renders a loading state.


// TODO: Fix the issue with the cart loading forms twice. Its seems to be related to the UseEffect running twice. This issue has been resolved for square payments, though the credit card form still needs fixing

// TODO: Implement all the missing JPGs for the items. OR wait to have actual items after deployment.

// TODO: There may be some TODO's in the adminPanel. Make sure to recreate the admin account and check it out. For example there may still be a bug with the other users being able to access it.

// TODO: IP History management doesn't populate dom with an iphistory if there isnt one present in the database. Fixed...
// DONE: IP History management now creates a new IP history record if one doesn't exist for the incoming IP address, and returns the new record in the response. This ensures that even first-time visitors have an IP history created for them, allowing for cart persistence and tracking from their very first interaction. Additionally, the update logic has been adjusted to return the updated IP history record after an update operation, providing immediate feedback on the changes made.

