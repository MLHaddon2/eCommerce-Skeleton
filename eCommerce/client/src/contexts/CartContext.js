// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useData } from './DataContext';
// import axios from '../api/axios';
// import { getCookie, COOKIE_KEYS } from '../Utils/cookieUtils';

// const CartContext = createContext();

// const normalizeIp = (ip) => ip.replace('::ffff:', '').trim();

// const getPersistedCart = () => {
//   try {
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   } catch (error) {
//     console.warn('Could not parse persisted cart from localStorage:', error);
//     return [];
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState(() => getPersistedCart());
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { updateIpHistory, createIpHistory, getIpHistory, getIpHistories } = useData();

//   // Update localStorage whenever cart changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);
  
//   const addToCart = async (product) => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const newCartItems = [...cartItems];
//         const existingItem = newCartItems.find(item => item.id === product.id);
        
//         if (existingItem) {
//             existingItem.quantity += 1;
//         } else {
//             newCartItems.push({ ...product, quantity: 1 });
//         }
        
//         setCartItems(newCartItems);
        
//         // Sync with database
//         await syncCartWithDatabase(newCartItems);
//       } catch (error) {
//         setError('Failed to add item to cart');
//         console.error('Error adding product to cart:', error);
//       } finally {
//         setIsLoading(false);
//       }
//   };

//   const syncCartWithDatabase = async (cartItemsToSync) => {
//       try {
//           const userId = getCookie(COOKIE_KEYS.USER_ID) || '0000';
//           const ipResponse = await axios.get('proxy');
//           const ipAddress = normalizeIp(ipResponse.data.ip);

//           await axios.post(`/api/cart/update/${userId}/${ipAddress}`, {
//             cartItems: cartItemsToSync,
//           });
//       } catch (error) {
//         console.error('Error syncing cart with database:', error);
//       }
//   };
 
//   const removeFromCart = async (productId) => {
//     try {
//       const newCartItems = cartItems.filter(item => item.id !== productId);
//       setCartItems(newCartItems);
//       await syncCartWithDatabase(newCartItems);
//     } catch (error) {
//       console.error('Error removing product from cart:', error);
//     }
//   };

//   const loadCartFromDatabase = async (userId) => {
//     try {
//         const persistedCart = getPersistedCart();
//         const ipResponse = await axios.get('proxy');
//         const ipAddress = normalizeIp(ipResponse.data.ip);

//         if (userId) {
//           try {
//             const res = await axios.get(`/api/cart/get/${userId}/${ipAddress}`);
//             const remoteCart = res?.data?.cartItems || [];
//             if (remoteCart.length > 0) {
//               setCartItems(remoteCart);
//             } else if (persistedCart.length > 0) {
//               setCartItems(persistedCart);
//               await syncCartWithDatabase(persistedCart);
//             }
//           } catch (error) {
//             if (error.response?.status === 404 && persistedCart.length > 0) {
//               setCartItems(persistedCart);
//               await syncCartWithDatabase(persistedCart);
//             } else {
//               console.error('Error loading user cart:', error);
//             }
//           }
//         } else {
//           try {
//             const res = await axios.get(`/api/cart/get/${ipAddress}`);
//             const remoteCart = res?.data?.cartItems || [];
//             if (remoteCart.length > 0) {
//               setCartItems(remoteCart);
//             } else if (persistedCart.length > 0) {
//               setCartItems(persistedCart);
//               await syncCartWithDatabase(persistedCart);
//             }
//           } catch (error) {
//             if (error.response?.status === 404) {
//               if (persistedCart.length > 0) {
//                 setCartItems(persistedCart);
//                 await syncCartWithDatabase(persistedCart);
//               } else {
//                 await createIpHistory({ ipAddress, lastLogin: null, cartItems: [] });
//               }
//             } else {
//               console.error('Error loading guest cart:', error);
//             }
//           }
//         }
//     } catch (error) {
//         console.error('Error loading cart from database:', error);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return;
//     const newCartItems = cartItems.map(item =>
//       item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
//     );
//     setCartItems(newCartItems);
//     await syncCartWithDatabase(newCartItems);
//   };

//   const clearCart = async () => {
//     setCartItems([]);
//     await syncCartWithDatabase([]);
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartCount = () => {
//     return cartItems.reduce((count, item) => count + item.quantity, 0);
//   };

//   const getCartProductIds = () => {
//     return cartItems.map(item => item.id);
//   };
  
//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getCartTotal,
//       getCartCount,
//       getCartProductIds,
//       loadCartFromDatabase,
//       syncCartWithDatabase,
//       isLoading,
//       error
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useData } from './DataContext';
import axios from '../api/axios';
import { getCookie, COOKIE_KEYS } from '../Utils/cookieUtils';

const CartContext = createContext();

const normalizeIp = (ip) => ip.replace('::ffff:', '').trim();

const getPersistedCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.warn('Could not parse persisted cart from localStorage:', error);
    return [];
  }
};

const getOrCreateIpHistory = async () => {
  try {
    const ipResponse = await axios.get('proxy');
    const ipAddress = normalizeIp(ipResponse.data.ip);
    const IpResponse = await axios.get(`/api/ip-history/${ipAddress}`);
    if (IpResponse.status === 200) {
      return IpResponse.data;
    } else if (IpResponse.status === 404) {
      const newIpHistory = await axios.post('/api/ip-history/create', {
        ipAddress,
        lastLogin: null,
        cartItems: []
      });
      return newIpHistory.data;
    }
  } catch (error) {
    console.error('Error fetching or creating IP history:', error);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getPersistedCart());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { createIpHistory } = useData();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const loadCartFromDatabase = async () => {
    try {
      // const persistedCart = getPersistedCart();
      const ipResponse = await axios.get('proxy');
      const ipAddress = normalizeIp(ipResponse.data.ip);

      const userId = getCookie(COOKIE_KEYS.USER_ID) || '0000';

      let remoteCart = [];

      // USER CART
      if (userId !== '0000') {
        try {
          const res = await axios.get(`/api/cart/get/${userId}/${ipAddress}`);
          remoteCart = res?.data?.cartItems || [];
        } catch (err) {
          remoteCart = [];
        }
      }

      // GUEST CART
      else {
        try {
          const res = await axios.get(`/api/cart/get/${ipAddress}`);
          remoteCart = res?.data?.cartItems;
        } catch (err) {
          remoteCart = [];
        }
      }

      // PRIORITY:
      // 1. Remote cart (if exists)
      // 2. Persisted local cart (if remote empty)
      // 3. Empty cart
      if (remoteCart.length > 0) {
        setCartItems(remoteCart);
      } else {
        setCartItems([]);
      }

    } catch (error) {
      console.error('Error loading cart from database:', error);
    }
  };

  const syncCartWithDatabase = async (cartItemsToSync) => {
    const userId = getCookie(COOKIE_KEYS.USER_ID) || '0000';
    const ipResponse = await axios.get('proxy');
    const ipAddress = normalizeIp(ipResponse.data.ip);

    try {
      console.log('Syncing cart with database:', { userId, ipAddress, cartItemsToSync });
      if (userId !== '0000') {
        await axios.post(`/api/cart/update/${userId}/${ipAddress}`, {
          id: userId,
          cartItems: cartItemsToSync,
        });
      }
      if (userId === '0000') {
        await axios.post(`/api/cart/update/${ipAddress}`, {
          cartItems: cartItemsToSync,
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        await createIpHistory({ ipAddress, lastLogin: null, cartItems: cartItemsToSync });
      } else {
        console.error('Error syncing guest cart with database:', error);
      }
    }
  };

  const addToCart = async (product) => {
    setIsLoading(true);
    setError(null);

    try {
      const newCartItems = [...cartItems];
      const existingItem = newCartItems.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        newCartItems.push({ ...product, quantity: 1 });
      }

      setCartItems(newCartItems);
      await syncCartWithDatabase(newCartItems);

    } catch (error) {
      setError('Failed to add item to cart');
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const newCartItems = cartItems.filter(item => item.id !== productId);
      setCartItems(newCartItems);
      await syncCartWithDatabase(newCartItems);
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    const newCartItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
    );

    setCartItems(newCartItems);
    await syncCartWithDatabase(newCartItems);
  };

  const clearCart = async () => {
    setCartItems([]);
    await syncCartWithDatabase([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartProductIds = () => {
    return cartItems.map(item => item.id);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      getCartProductIds,
      getOrCreateIpHistory,
      syncCartWithDatabase,
      loadCartFromDatabase,
      isLoading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
