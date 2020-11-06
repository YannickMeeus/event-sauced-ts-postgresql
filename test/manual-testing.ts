import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { OrderCreated } from './Events/OrderCreated'
import { v4 } from 'uuid'

import main from 'async-main'
import { EventStore, EventData } from '@silly-goose-software/event-sauced-ts'

const databaseConnectionDetails = {
  user: 'integration_testing',
  database: 'integration_testing',
  password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
  port: 5432,
}

const engine = new PostgreSQLStorageEngine({
  database: databaseConnectionDetails.database,
  user: databaseConnectionDetails.user,
  password: databaseConnectionDetails.password,
  port: databaseConnectionDetails.port,
  schema: 'manual_testing',
})

const store = new EventStore(engine)
const streamId = v4()
const eventToSave = new OrderCreated(streamId)
const eventData = new EventData(v4(), eventToSave)

main(async () => {
  await engine.initialise()
  await store.appendToStream(streamId, 0, eventData)
})
