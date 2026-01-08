'use server';
import { getProducer } from 'packages/utils/kafka';

export async function sendKafkaEvent(eventData: {
  userId?: string;
  productId?: string;
  shopId?: string;
  action?: string;
  device?: string;
  country?: string;
  city?: string;
}) {
  console.log('🚀 Attempting to send Kafka event:', eventData); // ADD THIS
  try {
    const producer = await getProducer();
    await producer.send({
      topic: 'user-events',
      messages: [{ value: JSON.stringify(eventData) }],
    });
    console.log('✅ SUCCESS: Event sent to Kafka'); // ADD THIS
  } catch (error) {
    console.error('❌ PRODUCER FAILED:', error); // ADD THIS
  }
}
