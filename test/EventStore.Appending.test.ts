import { EventData, EventStore } from '@silly-goose-software/event-sauced-ts'
import { v4 as newGuid } from 'uuid'

import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { OrderCreated } from './Events/OrderCreated'
import { databaseConnectionDetails, getSingleEventById } from './helpers'

describe('Given a initialised PostgreSQLStorageEngine', () => {
  let engine: PostgreSQLStorageEngine
  let store: EventStore
  let getEventByEventId: (query: string) => Promise<any>

  beforeAll(async () => {
    engine = new PostgreSQLStorageEngine(databaseConnectionDetails)
    getEventByEventId = getSingleEventById(databaseConnectionDetails)

    await engine.initialise()
    store = new EventStore(engine)
  })
  describe('When appending to a new stream', () => {
    it('It should save the event', async (done) => {
      const streamId = newGuid()
      const eventBody = new OrderCreated(streamId)
      const event = new EventData(newGuid(), eventBody)

      await store.appendToStream(streamId, 0, event)

      const savedEvent = await getEventByEventId(
        `SELECT * FROM eventstore.commits where event_id='${event.eventId}' LIMIT 1;`
      )
      expect(savedEvent.stream_id).toBeDefined()
      expect(savedEvent.stream_id).toBe(streamId)
      expect(savedEvent.event_id).toBeDefined()
      expect(savedEvent.event_id).toBe(event.eventId)
      expect(savedEvent.event_body).toEqual(eventBody)

      done()
    })
    it.todo('It should save the metadata for the event')
    describe('And we have multiple events to save', () => {
      it.todo('It should save both events')
      it.todo('It should save the events in the right order')
    })
    describe('And we try to persist the new event with an unexpected version', () => {
      it.todo('It should throw a concurrency error with revision number: blah')
    })
  })

  describe('When appending to an existing stream', () => {
    it.todo('It should save the new event')
    describe('And we try to persist the new event with an unexpected version', () => {
      it.todo('It should throw a concurrency error with revision number: blah')
    })
  })

  afterAll(async () => {
    if (engine) await engine.terminate()
  })
})
