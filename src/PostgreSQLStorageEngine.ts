import { IStorageEngine, EventStorage } from '@make-stuff-work/event-sauced'
import { Pool, PoolConfig } from 'pg'

// Masking this so users do not need to take an import dependency on 'pg'
interface PostgreSQLStorageEngineOptions extends PoolConfig {
  schema?: string
}

class PostgreSQLStorageEngine implements IStorageEngine {
  private readonly pool: Pool
  constructor(private readonly options: PostgreSQLStorageEngineOptions) {
    this.pool = new Pool(this.options)
  }
  public async initialise(): Promise<IStorageEngine> {
    let schemaQuery = ''
    if (this.options.schema) {
      schemaQuery = `CREATE SCHEMA IF NOT EXISTS ${this.options.schema};`
    }
    const schema = this.options.schema ? `${this.options.schema}.` : ''
    const fullQuery = `
BEGIN TRANSACTION;
  ${schemaQuery}
  CREATE TABLE IF NOT EXISTS ${schema}commits (
    id SERIAL PRIMARY KEY,
    streamId VARCHAR NOT NULL,
    eventId VARCHAR NOT NULL,
    eventNumber INTEGER NOT NULL,
    metaData jsonb,
    eventBody jsonb NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS IX_UQ_commits_streamId_eventNumber ON ${schema}commits (streamId, eventNumber);
  CREATE UNIQUE INDEX IF NOT EXISTS IX_UQ_commits_eventId ON ${schema}commits (eventId);
COMMIT;
`
    await this.pool.query(fullQuery)
    return this
  }

  public async terminate(): Promise<void> {
    await this.pool.end()
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
