import { EventStorage, IStorageEngine } from '@make-stuff-work/event-sauced'
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
    // TODO: Log line here to indicate initialisation started
    const schemaName = this.currentSchema()
    const schemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`
    const schema = schemaName + '.'

    const fullQuery = `
BEGIN TRANSACTION;
  ${schemaQuery}
  CREATE TABLE IF NOT EXISTS ${schema}commits (
    id SERIAL PRIMARY KEY,
    stream_id VARCHAR NOT NULL,
    event_id VARCHAR NOT NULL,
    event_number INTEGER NOT NULL,
    meta_data jsonb,
    event_body jsonb NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS IX_UQ_commits_stream_id_event_number ON ${schema}commits (stream_id, event_number);
  CREATE UNIQUE INDEX IF NOT EXISTS IX_UQ_commits_event_id ON ${schema}commits (event_id);
COMMIT;
`
    await this.pool.query(fullQuery)
    // TODO: Log line here to indicate initialisation Finished
    return this
  }

  public async terminate(): Promise<void> {
    await this.pool.end()
  }

  public async appendToStream(streamId: string, events: EventStorage[]): Promise<void> {
    const schemaName = this.currentSchema() // This is a bit dirty...
    const schema = schemaName + '.'
    const event = events.pop()!
    const templateQuery = `
      INSERT INTO ${schema}commits (
        stream_id,
        event_id,
        event_number,
        meta_data,
        event_body
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )
    `

    const parameters = [streamId, event.eventId, event.eventNumber, event.metaData, event.eventBody]
    // TODO: Log line to say event with id foo and stream id blah has been written successfully.
    await this.pool.query(templateQuery, parameters)
  }
  public readStreamForwards(
    streamId: string,
    startPosition: number,
    numberOfEvents: number
  ): Promise<EventStorage[]> {
    throw new Error('Method not implemented.')
  }

  private currentSchema(): string {
    return this.options.schema ? `${this.options.schema}` : 'eventstore'
  }
}

export { PostgreSQLStorageEngine }
