import { v4 as newGuid } from 'uuid'
import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { IStorageEngine, EventStore, EventData, EventStorage } from '@make-stuff-work/event-sauced'
import { OrderCreated } from './Events/OrderCreated'

describe('Given a set of engines to test against', () => {
  const engine = new PostgreSQLStorageEngine({
    user: 'integration_testing',
    database: 'postgres',
    password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
    port: 5432
  })

  describe('When a new database needs to be prepared', () => {
    it('It should initialize without any issues', async () => {
      await expect(engine.initialise()).resolves.not.toBeUndefined()
      await engine.dispose()
    })
  })
})
