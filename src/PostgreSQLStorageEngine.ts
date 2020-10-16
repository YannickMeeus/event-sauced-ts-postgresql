import { EventStorage, IStorageEngine } from '@silly-goose-software/event-sauced-ts'
import { Pool, PoolConfig } from 'pg'
import { ConcurrencyError } from './exceptions/ConcurrencyError'

// Masking this so users do not need to take an import dependency on 'pg'
export interface PostgreSQLStorageEngineOptions extends PoolConfig {
  schema?: string
}

class PostgreSQLStorageEngine implements IStorageEngine {
  private readonly pool: Pool

  constructor(private readonly options: PostgreSQLStorageEngineOptions) {
    this.pool = new Pool(this.options)
  }
  deleteStream(_streamId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public async initialise(): Promise<IStorageEngine> {
    // TODO: Log line here to indicate initialization started
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
    const templateQuery = `
      INSERT INTO ${schema}commits (
        stream_id,
        event_id,
        event_number,
        meta_data,
        event_body
      ) VALUES
        ${this.expand(events.length, 5)}

    `

    const parameters = events
      .map((event) => [streamId, event.eventId, event.eventNumber, event.metaData, event.eventBody])
      .flat()

    // TODO: Log line to say event with id foo and stream id blah has been written successfully.
    try {
      await this.pool.query(templateQuery, parameters)
    } catch (e) {
      const CONCURRENCY_ERROR_CODE = '23505'
      if (e.code === CONCURRENCY_ERROR_CODE) {
        const parsedDetails = e.detail.match(/=\((.*)\)/)
        if (parsedDetails) {
          const [streamId, offendingEventNumber] = parsedDetails[1]
            .split(',')
            .map((s: string) => s.trim())
          throw new ConcurrencyError(
            streamId,
            events.map((s) => s.eventId).join(', '),
            offendingEventNumber
          )
        } else {
          // Could not extract specifics for some reason, so going to just throw a more generic version of the concurrency error.
          throw new ConcurrencyError(
            streamId,
            events.map((s) => s.eventId).join(', '),
            events.map((s) => s.eventNumber).join(', ')
          )
        }
      } else {
        // Unknown Error
        // This needs a test as well
        throw e
      }
    }
  }
  public readStreamForwards(
    _streamId: string,
    _startPosition: number,
    _numberOfEvents: number
  ): Promise<EventStorage[]> {
    throw new Error('Method not implemented.')
  }

  private currentSchema(): string {
    return this.options.schema ? `${this.options.schema}` : 'eventstore'
  }

  private expand(rowCount: number, columnCount: number, startAt = 1) {
    let index = startAt
    return Array(rowCount)
      .fill(0)
      .map(
        () =>
          `(${Array(columnCount)
            .fill(0)
            .map(() => `$${index++}`)
            .join(', ')})`
      )
      .join(', ')
  }
}

export { PostgreSQLStorageEngine }
