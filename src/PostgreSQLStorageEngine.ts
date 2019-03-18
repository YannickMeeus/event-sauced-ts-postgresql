import { IStorageEngine, EventStorage } from '@make-stuff-work/event-sauced'

class PostgreSQLStorageEngine implements IStorageEngine {
  public initialise(): Promise<IStorageEngine> {
    // This is where the tables, indexes, etc are created
    throw new Error('Method not implemented.')
  }

  public appendToStream(streamId: string, events: EventStorage[]): Promise<void> {
    throw new Error('Method not implemented.')
  }
  public readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]> {
    throw new Error('Method not implemented.')
  }
}

export { PostgreSQLStorageEngine }
