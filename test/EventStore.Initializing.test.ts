import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { databaseConnectionDetails } from './helpers'

let engine: PostgreSQLStorageEngine

describe('Given a configured PostgreSQLStorageEngine', () => {
  beforeAll(async () => {
    engine = new PostgreSQLStorageEngine(databaseConnectionDetails)
  })

  describe('When a new database needs to be prepared', () => {
    it('It should initialize without any issues', async () => {
      const initializedEngine = await engine.initialise()
      expect(initializedEngine).toBeDefined()
    })
  })
  afterAll(async () => {
    if (engine) await engine.terminate()
  })
})
