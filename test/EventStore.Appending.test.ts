import { GenericContainer } from 'testcontainers'
import { v4 as newGuid } from 'uuid'

import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { StartedTestContainer } from 'testcontainers/dist/test-container'
import { EventStorage, EventStore, EventData } from '@make-stuff-work/event-sauced'
import { OrderCreated } from './Events/OrderCreated'

const databaseConnectionDetails = {
  user: 'integration_testing',
  database: 'postgres',
  password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
  port: 5432
}

describe('Given a initalized PostgreSQLStorageEngine', () => {
  let establishedContainer: StartedTestContainer
  let engine: PostgreSQLStorageEngine
  let store: EventStore

  beforeAll(async () => {
    // create container
    establishedContainer = await new GenericContainer('postgres', '11-alpine')
      .withEnv('POSTGRES_USER', databaseConnectionDetails.user)
      .withEnv('POSTGRES_PASSWORD', databaseConnectionDetails.password)
      .withExposedPorts(databaseConnectionDetails.port)
      .start()

    engine = new PostgreSQLStorageEngine({
      ...databaseConnectionDetails,
      port: establishedContainer.getMappedPort(databaseConnectionDetails.port)
    })

    await engine.initialise()
    store = new EventStore(engine)
  })
  describe('When appending to a new stream', () => {
    it.skip('It should save the event', async () => {
      const streamId = newGuid()
      const event = new EventData(newGuid(), new OrderCreated(streamId))

      await store.AppendToStream(streamId, 0, event)

      const stream = await store.readStreamForwards(streamId)
      expect(stream.length).toEqual(1)
      const savedEvent = stream[0]
      expect(savedEvent.streamId).toEqual(streamId)
      expect(savedEvent.eventId).toEqual(event.eventId)
      expect(savedEvent.eventNumber).toEqual(1)
    })
  })

  afterAll(async () => {
    if (engine) await engine.terminate()
    if (establishedContainer) await establishedContainer.stop()
  })
})
