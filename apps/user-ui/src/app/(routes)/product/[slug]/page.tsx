import type { Metadata } from 'next';
import React from 'react';
import ProductDetails from '../../../shared/modules/product/product-details';
import axiosInstance from '../../../utils/axiosInstance';

async function fetchProductDetails(slug: string) {
  try {
    const response = await axiosInstance.get(
      `/product/api/get-product/${slug}`
    );
    if (!response.data || !response.data.product) {
      throw new Error('Invalid product details data!');
    }
    return response.data.product;
  } catch (error) {
    console.error('Error fetching product details: ', error);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductDetails(slug);
  return {
    title: `${product?.title} | Zyra Marketplace`,
    description:
      product?.short_description ||
      'Discover high-quality products on Zyra Marketplace',
    openGraph: {
      title: product?.title,
      description: product?.short_description || '',
      images: [
        product?.images?.[0]?.url ||
          'https://ik.imagekit.io/codeprnv/products/Boult_Drift__2__1200x768.png_VersionId=RSQt26dQKOCH0fdD4dz7gxZ2_uBCQIpm&size=690:388?updatedAt=1767423514203',
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product?.title,
      description: product?.short_description || '',
      images: [
        product?.images?.[0]?.url ||
          'https://ik.imagekit.io/codeprnv/products/Boult_Drift__2__1200x768.png_VersionId=RSQt26dQKOCH0fdD4dz7gxZ2_uBCQIpm&size=690:388?updatedAt=1767423514203',
      ],
    },
  };
}

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const productDetails = await fetchProductDetails(slug);
  console.log('Product Details: ', productDetails);
  return <ProductDetails productDetails={productDetails}/>;
};

export default ProductDetailsPage;
