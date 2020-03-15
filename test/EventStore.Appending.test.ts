import { GenericContainer } from 'testcontainers'
import { v4 as newGuid } from 'uuid'

import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { StartedTestContainer } from 'testcontainers/dist/test-container'
import { EventStore, EventData } from '@make-stuff-work/event-sauced'
import { OrderCreated } from './Events/OrderCreated'
import { getSingleEventById } from './helpers'

const databaseConnectionDetails = {
  user: 'integration_testing',
  database: 'integration_testing',
  password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
  port: 5432
}

describe('Given a initialised PostgreSQLStorageEngine', () => {
  let establishedContainer: StartedTestContainer
  let engine: PostgreSQLStorageEngine
  let store: EventStore
  let getEventByEventId: (query: string) => Promise<any>

  beforeAll(async () => {
    establishedContainer = await new GenericContainer('postgres', '12-alpine')
      .withEnv('POSTGRES_USER', databaseConnectionDetails.user)
      .withEnv('POSTGRES_PASSWORD', databaseConnectionDetails.password)
      .withExposedPorts(databaseConnectionDetails.port)
      .start()

    const updatedConnectionDetails = {
      ...databaseConnectionDetails,
      port: establishedContainer.getMappedPort(databaseConnectionDetails.port)
    }

    engine = new PostgreSQLStorageEngine(updatedConnectionDetails)

    getEventByEventId = getSingleEventById(updatedConnectionDetails)

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
    if (establishedContainer) await establishedContainer.stop()
  })
})
