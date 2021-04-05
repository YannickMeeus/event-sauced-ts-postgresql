import { Client } from 'pg'
import { PostgreSQLStorageEngineOptions } from '../src/PostgreSQLStorageEngine'

const getSingleEventById = (databaseConfiguration: PostgreSQLStorageEngineOptions) => async (
  query: string
): Promise<any> => {
  const client = new Client(databaseConfiguration)
  await client.connect()
  const result = await client.query(query)
  return result.rows.pop()
}

const databaseConnectionDetails: PostgreSQLStorageEngineOptions = {
  user: 'integration_testing',
  database: 'postgres',
  password: 'admin',
  port: 5432,
  host: 'localhost',
}

export { getSingleEventById, databaseConnectionDetails }
