import { v4 as newGuid } from 'uuid'

import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { EventStore, EventData } from '@make-stuff-work/event-sauced'
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
    it('It should save the event', async done => {
      const streamId = newGuid()
      const eventBody = new OrderCreated(streamId)
      const event = new EventData(newGuid(), eventBody)

      await store.AppendToStream(streamId, 0, event)

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
  })

  afterAll(async () => {
    if (engine) await engine.terminate()
  })
})
