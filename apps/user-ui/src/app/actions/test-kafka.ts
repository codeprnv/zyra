import { getProducer } from 'packages/utils/kafka';

async function test() {
  console.log('✅ Testing getProducer()');
  const producer = await getProducer(); // Now actually a Producer instance
  console.log('✅ Producer ready:', typeof producer.send === 'function');

  await producer.send({
    topic: 'user-events',
    messages: [
      {
        value: JSON.stringify({
          userId: '507f1f77bcf86cd799439011', // ✅ Valid user ObjectId
          productId: '507f191e810c19729de860ea', // ✅ Valid product ObjectId
          shopId: '507f191e810c19729de860eb', // ✅ Valid shop ObjectId
          action: 'product_view',
          country: 'India',
          city: 'Narnaund',
          device: 'Chrome Mobile',
        }),
      },
    ],
  });

  console.log('🎉 SUCCESS! Full pipeline working');
}

test().catch(console.error);
