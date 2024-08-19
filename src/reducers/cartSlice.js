import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
    totalAmount: parseFloat(localStorage.getItem("totalAmount")) || 0,
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;

      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.name === newItem.name &&
          JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes)
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      state.totalAmount = Math.max(0, state.totalAmount + newItem.price);
      console.log("Item added. New totalAmount:", state.totalAmount);

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", state.totalAmount.toString());
    },
    removeItem: (state, action) => {
      const itemIndex = action.payload;
      const item = state.items[itemIndex];
      state.totalAmount = Math.max(
        0,
        state.totalAmount - item.price * item.quantity
      );
      console.log("Item removed. New totalAmount:", state.totalAmount);

      state.items.splice(itemIndex, 1);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", state.totalAmount.toString());
    },
    increaseQuantity: (state, action) => {
      const item = state.items[action.payload];
      item.quantity += 1;
      state.totalAmount = Math.max(0, state.totalAmount + item.price);
      console.log("Quantity increased. New totalAmount:", state.totalAmount);

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", state.totalAmount.toString());
    },
    decreaseQuantity: (state, action) => {
      const item = state.items[action.payload];
      if (item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount = Math.max(0, state.totalAmount - item.price);
      } else {
        state.totalAmount = Math.max(
          0,
          state.totalAmount - item.price * item.quantity
        );
        state.items.splice(action.payload, 1);
      }
      console.log("Quantity decreased. New totalAmount:", state.totalAmount);

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", state.totalAmount.toString());
    },
    updateItemAttributes: (state, action) => {
      const { index, attributes } = action.payload;
      state.items[index].attributes = attributes;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", state.totalAmount.toString());
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemAttributes,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
