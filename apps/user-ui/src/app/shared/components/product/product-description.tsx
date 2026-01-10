'use client';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';

const ProductDescription = ({ productDetails }: { productDetails: any }) => {
  const sanitizedHtml = useMemo(() => {
    const cleanText = (productDetails?.detailed_description || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');

    return DOMPurify.sanitize(cleanText, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
      FORBID_ATTR: ['style', 'class'],
      FORBID_TAGS: ['span', 'div', 'a'],
    });
  }, [productDetails?.detailed_description]);

  return (
    <div className='w-full px-4'>
      {/* ✅ LEFT ALIGN + PERFECT WRAPPING */}
      <style jsx global>{`
        .final-description {
          width: 100% !important;
          max-width: 100% !important;
          text-align: left !important;
          word-break: break-word !important;
          overflow-wrap: anywhere !important;
          white-space: normal !important;
          line-height: 1.7 !important;
          margin: 0 !important;
        }
        .final-description * {
          text-align: left !important;
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
          white-space: normal !important;
          word-break: break-word !important;
          line-height: 1.7 !important;
          margin: 0 0 1rem 0 !important;
          color: #242323 !important;
        }
        .final-description strong {
          font-weight: 700 !important;
          display: inline !important;
        }
      `}</style>

      <div
        className='final-description text-base leading-relaxed text-slate-200'
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};

export default ProductDescription;
