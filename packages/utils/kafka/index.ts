import { config } from 'dotenv';
import { Kafka } from 'kafkajs';
import path from 'path';

config({ path: path.resolve(__dirname, '../../../.env') });

const KAFKA_API_KEY = process.env.KAFKA_API_KEY;
const KAFKA_API_SECRET = process.env.KAFKA_API_SECRET;

if (!KAFKA_API_KEY || !KAFKA_API_SECRET) {
  throw new Error('Kafka api key and Kafka api secret is required!');
}

export const kafka = new Kafka({
  clientId: 'kafka-service',
  brokers: ['pkc-l7pr2.ap-south-1.aws.confluent.cloud:9092'],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: KAFKA_API_KEY,
    password: KAFKA_API_SECRET,
  },
  connectionTimeout: 30000,
  authenticationTimeout: 30000,
  requestTimeout: 60000,
  retry: { initialRetryTime: 300, retries: 10 },
});

let producerInstance: any = null;

export const getProducer = async () => {
  if (!producerInstance) {
    // ✅ CRITICAL FIX: Legacy partitioner matches consumer
    const { Partitioners } = await import('kafkajs');
    producerInstance = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner, // ← THIS FIXES IT
    });
    await producerInstance.connect();
    console.log('✅ Producer connected with LegacyPartitioner');
  }
  return producerInstance;
};
