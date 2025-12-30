import { PrismaClient } from 'generated/prisma/client.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({});

const initializeConfig = async () => {
  try {
    const existingConfig = await prisma.site_config.findFirst();

    if (!existingConfig) {
      await prisma.site_config.create({
        data: {
          categories: [
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Sports & Fitness',
          ],
          subCategories: {
            Electronics: ['Mobiles', 'Laptops', 'Accessories', 'Gaming'],
            Fashion: ['Men', 'Women', 'Kids', 'Footwear'],
            'Home & Kitchen': ['Furniture', 'Appliances', 'Decor'],
            'Sports & Fitness': [
              'Gym Equipment',
              'Outdoor Sports',
              'Wearables',
            ],
          },
        },
      });
    }
  } catch (error) {
    console.error('Error initializing site config: ', error);
  }
};

export default initializeConfig;
