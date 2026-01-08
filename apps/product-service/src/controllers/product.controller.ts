import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@packages/error-handler';
import { imagekit } from '@packages/libs/imagekit';
import prisma from '@packages/libs/prisma';
import type { NextFunction, Request, Response } from 'express';
import { Prisma } from 'generated/prisma/client';

// Get product categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.site_config.findFirst();

    if (!config) {
      return res.status(404).json({
        message: 'Categories not found!',
      });
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    next(error);
    return;
  }
};

// Create discount codes
export const createDiscountCodes = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: { discountCode },
    });

    if (isDiscountCodeExist) {
      throw new ValidationError(
        'Discount code already exists please use a different code!'
      );
    }

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });

    res.status(200).json({
      success: true,
      discount_codes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCode) {
      throw new NotFoundError('Discount code not found!');
    }

    if (discountCode.sellerId !== sellerId) {
      throw new ValidationError('Unauthorized access!');
    }

    await prisma.discount_codes.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Discount code successfully deleted!',
    });
  } catch (error) {
    next(error);
  }
};

// Upload product image
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.body;

    const response = await imagekit.files.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: '/products',
    });

    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;
    // console.log('File Id: ', fileId)
    const response = await imagekit.delete(`/v1/files/${fileId}`);
    res.status(201).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specifications,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subCategory,
      customProperties = {},
      images = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !images ||
      !tags ||
      !stock ||
      !regular_price
    ) {
      throw new ValidationError('Missing required fields!');
    }

    if (!req.seller.id) {
      throw new AuthError('Only seller can create products!');
    }

    const slugChecking = await prisma.products.findUnique({
      where: {
        slug,
      },
    });

    if (slugChecking) {
      throw new ValidationError(
        'Slug already exists! Please use a different slug'
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        shopId: req.seller?.shop?.id,
        tags: Array.isArray(tags) ? tags : tags.split(','),
        brand,
        video_url,
        category,
        subCategory,
        colors: colors || [],
        discount_codes: discountCodes?.map((codeId: string) => codeId) || '',
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specifications: custom_specifications || {},
        images: {
          create: images
            .filter((image: any) => image && image.fileId && image.file_url)
            .map((image: any) => ({
              file_id: image.fileId,
              url: image.file_url,
            })),
        },
      },
      include: { images: true },
    });

    res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });
    return res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      throw new ValidationError('Product not found!');
    }

    if (product.shopId !== sellerId) {
      throw new ValidationError('Unauthorized action!');
    }

    if (product.isDeleted) {
      throw new ValidationError('Product is already deleted!');
    }

    const deletedProduct = await prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      message:
        'Product is scheduled for deletion in 24 hours. You can restore it within this time.',
      deletedAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      throw new ValidationError('Product not found!');
    }

    if (product.shopId !== sellerId) {
      throw new ValidationError('Unauthorized action!');
    }

    if (!product.isDeleted) {
      return res
        .status(400)
        .json({ message: 'Product is not in deleted state!' });
    }

    await prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: 'Product successfully restored!',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error restoring product', error });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    // const baseFilter = {
    //   AND: [{ starting_date: null }, { ending_date: null }],
    // };

    const orderBy: Prisma.productsOrderByWithRelationInput =
      type === 'latest'
        ? { createdAt: 'desc' as Prisma.SortOrder }
        : { totalSales: 'desc' as Prisma.SortOrder };

    const products = await prisma.products.findMany({
      skip,
      take: limit,
      include: {
        images: true,
        shop: true,
      },
      // where: baseFilter,
      orderBy: {
        totalSales: 'desc',
      },
    });

    const total = await prisma.products.count();
    const top10Products = await prisma.products.findMany({
      take: 10,
      // where: baseFilter,
      orderBy: {
        totalSales: 'desc',
      },
    });

    // const [products, total, top10Products] = await Promise.all([]);

    // console.log(
    //   'Products: ',
    //   products,
    //   'Total: ',
    //   total,
    //   'top10products: ',
    //   top10Products
    // );

    res.status(200).json({
      products,
      top10By: type === 'latest' ? 'latest' : 'topSales',
      top10Products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        slug: req.params.slug
      },
      include: {
        images: true,
        shop: true
      }
    });

    res.status(201).json({
      success: true,
      product
    })
  } catch (error) {
    next(error);
  }
};
