import { PostgreSQLStorageEngine } from '../src/PostgreSQLStorageEngine'
import { GenericContainer } from 'testcontainers'
import { StartedTestContainer } from 'testcontainers/dist/test-container'

const databaseConnectionDetails = {
  user: 'integration_testing',
  database: 'postgres',
  password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
  port: 5432
}

let establishedContainer: StartedTestContainer
let engine: PostgreSQLStorageEngine

describe('Given a configured PostgreSQLStorageEngine', () => {
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
  })

  describe('When a new database needs to be prepared', () => {
    it('It should initialize without any issues', async () => {
      await expect(engine.initialise()).resolves.not.toBeUndefined()
    })
  })
  afterAll(async () => {
    if (engine) await engine.terminate()
    if (establishedContainer) await establishedContainer.stop()
  })
})
