export class Snowflake {
  private static readonly EPOCH = 1704067200000; // 2024-01-01T00:00:00.000Z
  private static readonly WORKER_ID_BITS = 5;
  private static readonly SEQUENCE_BITS = 7;

  private static readonly MAX_WORKER_ID = -1 ^ (-1 << Snowflake.WORKER_ID_BITS);
  private static readonly MAX_SEQUENCE = -1 ^ (-1 << Snowflake.SEQUENCE_BITS);

  private static readonly WORKER_ID_SHIFT = Snowflake.SEQUENCE_BITS;
  private static readonly TIMESTAMP_SHIFT = Snowflake.SEQUENCE_BITS + Snowflake.WORKER_ID_BITS;

  private static workerId = 1; // Default worker ID
  private static sequence = 0;
  private static lastTimestamp = -1;

  public static setWorkerId(id: number) {
    if (id < 0 || id > Snowflake.MAX_WORKER_ID) {
      throw new Error(`Worker ID must be between 0 and ${Snowflake.MAX_WORKER_ID}`);
    }
    Snowflake.workerId = id;
  }

  public static generate(): number {
    let timestamp = Date.now();

    if (timestamp < Snowflake.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate id.');
    }

    if (timestamp === Snowflake.lastTimestamp) {
      Snowflake.sequence = (Snowflake.sequence + 1) & Snowflake.MAX_SEQUENCE;
      if (Snowflake.sequence === 0) {
        // Sequence overflow, wait for next millisecond
        while (timestamp <= Snowflake.lastTimestamp) {
          timestamp = Date.now();
        }
      }
    } else {
      Snowflake.sequence = 0;
    }

    Snowflake.lastTimestamp = timestamp;

    const timeDiff = timestamp - Snowflake.EPOCH;

    // 53-bit Snowflake: (timestamp << 12) | (workerId << 7) | sequence
    const id = (timeDiff * Math.pow(2, Snowflake.TIMESTAMP_SHIFT)) +
               (Snowflake.workerId << Snowflake.WORKER_ID_SHIFT) +
               Snowflake.sequence;

    return id;
  }
}
