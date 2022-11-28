import { createConnection, getConnectionOptions } from 'typeorm';

// (async () => await createConnection())();

export default async () => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === "test" ? "fin_api_test" : defaultOptions.database
    })
  )
}


// Authentication failed for postgres