import { EventData } from '@make-stuff-work/event-sauced'
import { Client } from 'pg'
import { PostgreSQLStorageEngineOptions } from '../src/PostgreSQLStorageEngine'

const getSingleEventById = (databaseConfiguration: any) => async (
  query: string
): Promise<EventData> => {
  const client = new Client(databaseConfiguration)
  await client.connect()
  const result = await client.query(query)
  return result.rows.pop() as EventData
}

const databaseConnectionDetails: PostgreSQLStorageEngineOptions = {
  user: 'integration_testing',
  database: 'postgres',
  password: '2fe62e24-fb14-41d4-be56-afbce0cd3f04',
  port: 5432,
  host: 'localhost'
}

export { getSingleEventById, databaseConnectionDetails }
