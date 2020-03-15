import { EventData } from '@make-stuff-work/event-sauced'
import { Client } from 'pg'

const getSingleEventById = (databaseConfiguration: any) => async (
  query: string
): Promise<EventData> => {
  const client = new Client(databaseConfiguration)
  await client.connect()
  const result = await client.query(query)
  return result.rows.pop() as EventData
}

export { getSingleEventById }
