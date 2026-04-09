// // import Customer from '../models/customerModel.js';
// // import IpHistories from '../models/ipHistoryModel.js';
// // import IpHistory from '../models/ipHistoryModel.js';

// // const handleError = (res, context, error) => {
// //   console.error(context, error);
// //   return res.status(500).json({
// //     message: `${context} failed`,
// //     error: error?.message || String(error)
// //   });
// // };

// // // Helper function to merge cart items
// // const mergeCartItems = (existingItems, newItems) => {
// //   const merged = [...existingItems];

// //   newItems.forEach((newItem) => {
// //     const existingIndex = merged.findIndex((item) => item.id === newItem.id);
// //     if (existingIndex >= 0) {
// //       merged[existingIndex].quantity += newItem.quantity;
// //     } else {
// //       merged.push(newItem);
// //     }
// //   });

// //   return merged;
// // };

// // export const updateCartItems = async (req, res) => {
// //   try {
// //     const { cartItems } = req.body;
// //     const userId = req.params.id;
// //     const ipAddress = req.params.ipAddress;
// //     let finalCartItems = cartItems;

// //     if (userId !== '0000') {
// //       const customer = await Customer.findOne({ where: { id: userId } });
// //       if (!customer) {
// //         return res.status(404).json({ message: 'Customer not found' });
// //       }

// //       const existingCartItems = customer.cartItems || [];
// //       if (existingCartItems.length > 0) {
// //         finalCartItems = mergeCartItems(existingCartItems, cartItems);
// //       }

// //       await customer.update({ cartItems: finalCartItems });
// //     }

// //     await IpHistory.upsert({
// //       ipAddress,
// //       lastLogin: new Date().toUTCString(),
// //       cartItems: finalCartItems,
// //     });

// //     return res.status(200).json({ cartItems: finalCartItems });
// //   } catch (error) {
// //     return handleError(res, 'Update cart items', error);
// //   }
// // };

// // export const getCartItems = async (req, res) => {
// //   try {
// //     const userId = req.params.id;
// //     const ipAddress = req.params.ipAddress;

// //     let cartItems = null;

// //     if (userId !== '0000') {
// //       const customer = await Customer.findOne({ where: { id: userId } });
// //       if (!customer) {
// //         return res.status(404).json({ message: 'Customer not found' });
// //       }
// //       cartItems = customer.cartItems || [];
// //       return res.status(200).json({ message: 'Cart items retrieved from existing customer', cartItems });
// //     }

// //     const ipHistory = await IpHistories.findOne({ where: { ipAddress } });
// //     if (!ipHistory) {
// //       return res.status(404).json({ message: 'IP history not found' });
// //     }
// //     cartItems = ipHistory.cartItems || [];
// //     return res.status(200).json({ message: 'Cart items retrieved from IP history', cartItems });
// //   } catch (error) {
// //     return handleError(res, 'Get cart items', error);
// //   }
// // };

// // export const deleteCartItem = async (req, res) => {
// //   try {
// //     const userId = req.params.id;
// //     const productId = req.params.productId;
// //     const ipAddress = req.params.ipAddress;
// //     let cartItems = [];

// //     if (userId !== '0000') {
// //       const customer = await Customer.findOne({ where: { id: userId } });
// //       if (!customer) {
// //         return res.status(404).json({ message: 'Customer not found' });
// //       }

// //       cartItems = customer.cartItems || [];
// //     } else {
// //       const ipHistory = await IpHistory.findOne({ where: { ipAddress } });
// //       if (!ipHistory) {
// //         return res.status(404).json({ message: 'IP history not found' });
// //       }
// //       cartItems = ipHistory.cartItems || [];
// //     }

// //     const existingIndex = cartItems.findIndex((item) => String(item.id) === String(productId));
// //     if (existingIndex === -1) {
// //       return res.status(404).json({ message: 'Product not found in cart' });
// //     }

// //     if (cartItems[existingIndex].quantity > 1) {
// //       cartItems[existingIndex].quantity -= 1;
// //     } else {
// //       cartItems = cartItems.filter((item) => String(item.id) !== String(productId));
// //     }

// //     if (userId !== '0000') {
// //       const customer = await Customer.findOne({ where: { id: userId } });
// //       await customer.update({ cartItems });
// //       return res.status(200).json({ message: 'Item removed from customer cart', cartItems });
// //     }

// //     const ipHistory = await IpHistory.findOne({ where: { ipAddress } });
// //     await ipHistory.update({ cartItems });
// //     return res.status(200).json({ message: 'Item removed from IP history cart', cartItems });
// //   } catch (error) {
// //     return handleError(res, 'Delete cart item', error);
// //   }
// // };

// import Customer from '../models/customerModel.js';
// import IpHistory from '../models/ipHistoryModel.js';

// const handleError = (res, context, error) => {
//   console.error(context, error);
//   return res.status(500).json({
//     message: `${context} failed`,
//     error: error?.message || String(error)
//   });
// };

// const mergeCartItems = (existingItems = [], newItems = []) => {
//   const merged = [...existingItems];

//   newItems.forEach((newItem) => {
//     const index = merged.findIndex((item) => String(item.id) === String(newItem.id));
//     if (index >= 0) {
//       merged[index].quantity = (merged[index].quantity || 0) + (newItem.quantity || 1);
//     } else {
//       merged.push({ ...newItem, quantity: newItem.quantity || 1 });
//     }
//   });

//   return merged;
// };

// export const updateCartItems = async (req, res) => {
//   try {
//     const { cartItems } = req.body;
//     const userId = req.params.id && req.params.id !== '0000' ? req.params.id : '0000';
//     const ipAddress = req.params.ipAddress;

//     let finalCartItems = cartItems;

//     if (userId !== '0000') {
//       const customer = await Customer.findOne({ where: { id: userId } });
//       if (!customer) return res.status(404).json({ message: 'Customer not found' });

//       finalCartItems = mergeCartItems(customer.cartItems || [], cartItems);
//       await customer.update({ cartItems: finalCartItems });
//     } else {
//       const ipRecord = await IpHistory.findOne({ where: { ipAddress } });
//       if (ipRecord) {
//         finalCartItems = mergeCartItems(ipRecord.cartItems || [], cartItems);
//       }
//     }

//     // await IpHistory.upsert({
//     //   ipAddress,
//     //   lastLogin: new Date().toUTCString(),
//     //   cartItems: finalCartItems
//     // });

//     // Always try to find an existing record for this IP
//     let ipRecord = await IpHistory.findOne({ where: { ipAddress } });

//     // If none found, try to find a record tied to this user (if logged in)
//     if (!ipRecord && userId !== '0000') {
//       ipRecord = await IpHistory.findOne({ where: { userId } });
//     }

//     // If a record exists, update it to the new IP and cart
//     if (ipRecord) {
//       await ipRecord.update({
//         ipAddress,
//         lastLogin: new Date().toUTCString(),
//         cartItems: finalCartItems
//       });
//     } else {
//       // Create only if absolutely necessary
//       await IpHistory.create({
//         ipAddress,
//         userId: userId !== '0000' ? userId : null,
//         lastLogin: new Date().toUTCString(),
//         cartItems: finalCartItems
//       });
//     }


//     return res.status(200).json({ cartItems: finalCartItems });

//   } catch (error) {
//     return handleError(res, 'Update cart items', error);
//   }
// };

// export const getCartItems = async (req, res) => {
//   try {
//     const userId = req.params.id && req.params.id !== '0000' ? req.params.id : '0000';
//     const ipAddress = req.params.ipAddress || req.params.id;

//     if (!ipAddress) {
//       return res.status(400).json({ message: 'IP address is required' });
//     }

//     if (userId !== '0000') {
//       const customer = await Customer.findOne({ where: { id: userId } });
//       if (!customer) return res.status(404).json({ message: 'Customer not found' });

//       return res.status(200).json({
//         message: 'Cart items retrieved from existing customer',
//         cartItems: customer.cartItems || []
//       });
//     }

//     const ipHistory = await IpHistory.findOne({ where: { ipAddress } });
//     if (!ipHistory) return res.status(404).json({ message: 'IP history not found' });

//     return res.status(200).json({
//       message: 'Cart items retrieved from IP history',
//       cartItems: ipHistory.cartItems || []
//     });

//   } catch (error) {
//     return handleError(res, 'Get cart items', error);
//   }
// };

// export const deleteCartItem = async (req, res) => {
//   try {
//     const userId = req.params.id && req.params.id !== '0000' ? req.params.id : '0000';
//     const productId = req.params.productId;
//     const ipAddress = req.params.ipAddress;

//     let cartItems = [];

//     if (userId !== '0000') {
//       const customer = await Customer.findOne({ where: { id: userId } });
//       if (!customer) return res.status(404).json({ message: 'Customer not found' });

//       cartItems = customer.cartItems || [];
//       const index = cartItems.findIndex((item) => String(item.id) === String(productId));
//       if (index === -1) return res.status(404).json({ message: 'Product not found in cart' });

//       if (cartItems[index].quantity > 1) {
//         cartItems[index].quantity -= 1;
//       } else {
//         cartItems = cartItems.filter((item) => String(item.id) !== String(productId));
//       }

//       await customer.update({ cartItems });
//       await IpHistory.upsert({ ipAddress, lastLogin: new Date().toUTCString(), cartItems });

//       return res.status(200).json({ message: 'Item removed from customer cart', cartItems });
//     }

//     const ipHistory = await IpHistory.findOne({ where: { ipAddress } });
//     if (!ipHistory) return res.status(404).json({ message: 'IP history not found' });

//     cartItems = ipHistory.cartItems || [];
//     const index = cartItems.findIndex((item) => String(item.id) === String(productId));
//     if (index === -1) return res.status(404).json({ message: 'Product not found in cart' });

//     if (cartItems[index].quantity > 1) {
//       cartItems[index].quantity -= 1;
//     } else {
//       cartItems = cartItems.filter((item) => String(item.id) !== String(productId));
//     }

//     await ipHistory.update({ cartItems });

//     return res.status(200).json({ message: 'Item removed from IP history cart', cartItems });

//   } catch (error) {
//     return handleError(res, 'Delete cart item', error);
//   }
// };


import { where } from 'sequelize';
import Customer from '../models/customerModel.js';
import IpHistory from '../models/ipHistoryModel.js';

const handleError = (res, context, error) => {
  console.error(context, error);
  return res.status(500).json({
    message: `${context} failed`,
    error: error?.message || String(error)
  });
};

const mergeCartItems = (existingItems = [], newItems = []) => {
  const merged = [...existingItems];

  newItems.forEach((newItem) => {
    const index = merged.findIndex((item) => String(item.id) === String(newItem.id));
    if (index >= 0) {
      merged[index].quantity = (merged[index].quantity || 0) + (newItem.quantity || 1);
    } else {
      merged.push({ ...newItem, quantity: newItem.quantity || 1 });
    }
  });

  return merged;
};

// const persistIpHistory = async (userId, ipAddress, finalCartItems) => {
//   let ipRecord = await IpHistory.findOne({ where: { ipAddress } });

//   if (!ipRecord && userId !== '0000') {
//     ipRecord = await IpHistory.findOne({ where: { userId } });
//   }

//   if (ipRecord) {
//     await ipRecord.update({
//       ipAddress,
//       userId: userId !== '0000' ? userId : '0000',
//       lastLogin: new Date().toUTCString(),
//       cartItems: finalCartItems
//     });
//   } else {
//     await IpHistory.create({
//       ipAddress,
//       userId: userId !== '0000' ? userId : '0000',
//       lastLogin: new Date().toUTCString(),
//       cartItems: finalCartItems
//     });
//   }
// };

export const updateCartItems = async (req, res) => {
  try {
    const cartItems = req.body;
    const userId = req.params.id !== '0000' ? req.params.id : '0000';
    const ipAddress = req.params.ipAddress;

    let finalCartItems = cartItems;

    if (userId !== '0000') {
      const customer = await Customer.findOne({ where: { id: userId } });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      await Customer.update({ cartItems: finalCartItems }, { where: { id: userId } });
    } else {
      const ipRecord = await IpHistory.findOne({ where: { ipAddress } });
      if (ipRecord) {
        await IpHistory.update({
          ipAddress,
          lastLogin: new Date().toUTCString(),
          cartItems: finalCartItems
        }, { where: { ipAddress } });
      }
    }

    return res.status(200).json({ cartItems: finalCartItems });

  } catch (error) {
    return handleError(res, 'Update cart items', error);
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.params.id && req.params.id !== '0000' ? req.params.id : '0000';
    const ipAddress = req.params.ipAddress || req.params.id;

    // Validate IP address presence
    if (!ipAddress) {
      return res.status(400).json({ message: 'IP address is required' });
    }
    // If user is authenticated, try to get cart from customer record
    const ipHistory = await IpHistory.findOne({ where: { ipAddress } });
    // If no IP history exists, create one for this IP (for guests)
    if (!ipHistory && userId === '0000') {
      await IpHistory.create({
        ipAddress,
        userId,
        lastLogin: null,
        cartItems: []
      });
      const newIpHistory = await IpHistory.findOne({ where: { ipAddress } });
      return res.status(204).json({ message: 'IP history not found, created new record', newIpHistory});
      // If user is authenticated but no IP history exists, try to find a record tied to this user
    } else if (userId !== '0000' || ipHistory) {
        // If user is authenticated and IP history exists, or if user is authenticated and no IP history exists but we find one tied to the user, return cart items from customer record
        if (userId !== '0000') {
          const customer = await Customer.findOne({ where: { id: userId } });
          if (!customer) return res.status(404).json({ message: 'Customer not found' });

          const newIpReturn = await IpHistory.update(
            { ipAddress, userId, lastLogin: new Date().toUTCString(), cartItems: customer.cartItems || [] },
            { where: { ipAddress } }
          );

          return res.status(200).json({
            message: 'Cart items retrieved from existing customer',
            message2: 'IP history updated with new IP',
            newIpHistory: newIpReturn.dataValues.ipAddress,
            cartItems: customer.cartItems || []
          });
      };
      // If user is not authenticated and IP history exists, return cart items from IP history
      await IpHistory.update(
        { ipAddress, userId, lastLogin: new Date().toUTCString(), cartItems: ipHistory.cartItems || [] },
        { where: { ipAddress } }
      );
      const newIpHistory = await IpHistory.findOne({ where: { ipAddress } });
      return res.status(200).json({ message: 'IP history updated with new IP', newIpHistory});
    };

  } catch (error) {
    return handleError(res, 'Get cart items', error);
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.params.id && req.params.id !== '0000' ? req.params.id : '0000';
    const productId = req.params.productId;
    const ipAddress = req.params.ipAddress;

    if (userId !== '0000') {
      const customer = await Customer.findOne({ where: { id: userId } });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      let cartReturn = customer.cartItems || [];
      const index = cartReturn.findIndex((item) => String(item.id) === String(productId));
      if (index === -1) return res.status(404).json({ message: 'Product not found in cart' });

      if (cartReturn[index].quantity > 1) {
        cartReturn[index].quantity -= 1;
      } else {
        cartReturn = cartReturn.filter((item) => String(item.id) !== String(productId));
      }

      await customer.update({ cartItems: cartReturn });
      await persistIpHistory(userId, ipAddress, cartReturn);

      return res.status(200).json({ message: 'Item removed from customer cart', cartReturn });
    }

    if (userId === '0000') {
      const ipHistory = await IpHistory.findOne({ where: { ipAddress } });
      if (!ipHistory) return res.status(404).json({ message: 'IP history not found' });

      let cartReturn = ipHistory.cartItems || [];
      const index = cartItems.findIndex((item) => String(item.id) === String(productId));
      if (index === -1) return res.status(404).json({ message: 'Product not found in cart' });

      if (cartReturn[index].quantity > 1) {
        cartReturn[index].quantity -= 1;
      } else {
        cartReturn = cartReturn.filter((item) => String(item.id) !== String(productId));
      }

      await ipHistory.update({ cartItems: cartReturn });

      return res.status(200).json({ message: 'Item removed from IP history cart', cartReturn });
    }

  } catch (error) {
    return handleError(res, 'Delete cart item', error);
  }
};
