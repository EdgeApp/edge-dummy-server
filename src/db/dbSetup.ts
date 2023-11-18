import { setupDatabase, SetupDatabaseOptions } from 'edge-server-tools'
import { ServerScope } from 'nano'

import { dbDummyRegularSetup } from './dbDummyRegular'
import { dbDummyRolling } from './dbDummyRolling'
import { appReplicators, settingsSetup } from './dbSettings'

export async function setupDatabases(
  connection: ServerScope,
  disableWatching: boolean = false
): Promise<void> {
  const options: SetupDatabaseOptions = {
    disableWatching,
    replicatorSetup: appReplicators
  }

  await setupDatabase(connection, settingsSetup, options)
  await Promise.all([
    dbDummyRolling.setup(connection, options),
    setupDatabase(connection, dbDummyRegularSetup, options)
  ])
}
