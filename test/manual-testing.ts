import { EventStore, EventData } from '@make-stuff-work/event-sauced'
import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { OrderCreated } from './Events/OrderCreated'
import { v4 } from 'uuid'

import main from 'async-main'

const databaseConnectionDetails = {
  user: 'integration_testing',
  database: 'integration_testing',
  password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
  port: 5432
}

const engine = new PostgreSQLStorageEngine({
  database: databaseConnectionDetails.database,
  user: databaseConnectionDetails.user,
  password: databaseConnectionDetails.password,
  port: databaseConnectionDetails.port,
  schema: 'manual_testing'
})

const store = new EventStore(engine)
const streamId = v4()
const eventToSave = new OrderCreated(streamId)
const eventData = new EventData(v4(), eventToSave)

// tslint:disable-next-line: no-floating-promises
main(async () => {
  await engine.initialise()
  await store.AppendToStream(streamId, 0, eventData)
})
