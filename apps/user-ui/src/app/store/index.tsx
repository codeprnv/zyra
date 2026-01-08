'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendKafkaEvent } from '../actions/track-user';

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity?: number;
  shopId: string;
};

type Store = {
  cart: Product[];
  wishlist: Product[];
  addToCart: (
    product: Product,
    userId?: string,
    location?: any,
    deviceInfo?: string
  ) => Promise<void>;
  removeFromCart: (
    id: string,
    userId?: string,
    location?: any,
    deviceInfo?: string
  ) => Promise<void>;
  addToWishlist: (
    product: Product,
    userId?: string,
    location?: any,
    deviceInfo?: string
  ) => Promise<void>;
  removeFromWishlist: (
    id: string,
    userId?: string,
    location?: any,
    deviceInfo?: string
  ) => Promise<void>;
  getCartCount: () => number;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: async (product, userId, location, deviceInfo) => {
        // console.log('🛒 addToCart CALLED:', { productId: product.id, userId });

        // Update cart state
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: product?.quantity }] };
        });

        // Send Kafka event
        if (userId) {
          // console.log('✅ CONDITIONS PASS - sending Kafka');
          try {
            await sendKafkaEvent({
              userId,
              productId: product.id,
              shopId: product.shopId,
              action: 'add_to_cart',
              country: location?.country || 'IN',
              city: location?.city || 'Narnaund',
              device: deviceInfo || 'browser',
            });
            // console.log('✅ Kafka event sent from Zustand!');
          } catch (error) {
            console.error('❌ Kafka failed in Zustand:', error);
          }
        } else {
          console.log('🚫 No userId - skipping Kafka');
        }
      },

      removeFromCart: async (id, userId, location, deviceInfo) => {
        const removedProduct = get().cart.find((item) => item.id === id);
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));

        if (userId && removedProduct) {
          await sendKafkaEvent({
            userId,
            productId: removedProduct.id,
            shopId: removedProduct.shopId,
            action: 'remove_from_cart',
            country: location?.country || 'IN',
            city: location?.city || 'Narnaund',
            device: deviceInfo || 'browser',
          });
        }
      },

      addToWishlist: async (product, userId, location, deviceInfo) => {
        set((state) => {
          if (state.wishlist.find((item) => item.id === product.id)) {
            return state;
          }
          return { wishlist: [...state.wishlist, product] };
        });

        if (userId) {
          await sendKafkaEvent({
            userId,
            productId: product.id,
            shopId: product.shopId,
            action: 'add_to_wishlist',
            country: location?.country || 'IN',
            city: location?.city || 'Narnaund',
            device: deviceInfo || 'browser',
          });
        }
      },

      removeFromWishlist: async (id, userId, location, deviceInfo) => {
        const removedProduct = get().wishlist.find((item) => item.id === id);
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== id),
        }));

        if (userId && removedProduct) {
          await sendKafkaEvent({
            userId,
            productId: removedProduct.id,
            shopId: removedProduct.shopId,
            action: 'remove_from_wishlist',
            country: location?.country || 'IN',
            city: location?.city || 'Narnaund',
            device: deviceInfo || 'browser',
          });
        }
      },

      getCartCount: () =>
        get().cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    }),
    { name: 'cart-storage' }
  )
);
