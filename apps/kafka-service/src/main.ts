import { kafka } from '@packages/utils/kafka';
import { updateUserAnalytics } from './services/analytics.service';

const consumer = kafka.consumer({ groupId: 'user-events-group' });
const eventQueue: any[] = [];

const processQueue = async () => {
  // console.log(`⏰ PROCESS QUEUE CALLED, queue length: ${eventQueue.length}`);
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  for (const event of events) {
    const validActions = [
      'add_to_wishlist',
      'add_to_cart',
      'product_view',
      "remove_from_cart",
      'remove_from_wishlist',
    ];
    if (!event.action || !validActions.includes(event.action)) {
      console.log('⚠️ Invalid action skipped:', event.action);
      continue;
    }

    try {
      await updateUserAnalytics(event);
      console.log('✅ PROCESSED:', event.action, event.userId);
    } catch (error) {
      console.error('❌ PROCESSING FAILED:', error);
    }
  }
};

// ✅ FIXED: Start queue processing AFTER consumer fully starts
let queueTimer: NodeJS.Timeout;
const startQueueProcessing = () => {
  if (queueTimer) clearInterval(queueTimer);
  queueTimer = setInterval(processQueue, 3000);
  console.log('⏰ Queue processor started (every 3s)');
};

export const consumeKafkaMessages = async () => {
  try {
    await consumer.connect();
    console.log('✅ Kafka consumer connected');

    await consumer.subscribe({
      topic: 'user-events',
      fromBeginning: false,
    });
    console.log('✅ Subscribed to user-events topic');

    // ✅ CORRECT Kafkajs events (no TypeScript errors)
    consumer.on(consumer.events.CONNECT, () => {
      console.log('🔗 Consumer CONNECTED to broker');
    });

    consumer.on(consumer.events.DISCONNECT, () => {
      console.log('🔌 Consumer DISCONNECTED');
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('📨 MESSAGE RECEIVED:', {
          topic,
          partition,
          offset: message.offset.toString(),
        });

        if (!message.value) {
          console.log('⚠️ Empty message skipped');
          return;
        }

        try {
          const event = JSON.parse(message.value.toString());
          console.log('📦 PARSED EVENT:', {
            userId: event.userId,
            productId: event.productId,
            action: event.action,
            country: event.country,
          });

          eventQueue.push(event);
          console.log('✅ ADDED TO QUEUE, NOW:', eventQueue.length);
          console.log(
            '📋 QUEUE SUMMARY:',
            eventQueue.map((e) => `${e.action}:${e.userId?.slice(0, 8)}...`)
          );
        } catch (parseError) {
          console.error('❌ PARSE ERROR:', parseError);
          console.error('RAW MESSAGE:', message.value?.toString());
        }
      },
    });

    // ✅ Start queue processing 2 seconds after consumer runs
    setTimeout(startQueueProcessing, 2000);
  } catch (error) {
    console.error('❌ CONSUMER CRASHED:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down consumer...');
  await consumer.disconnect();
  clearInterval(queueTimer);
  process.exit(0);
});

consumeKafkaMessages().catch((error) => {
  console.error('❌ FATAL ERROR:', error);
  process.exit(1);
});
