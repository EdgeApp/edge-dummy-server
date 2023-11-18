import {
  asDate,
  asNumber,
  asObject,
  asString,
  Cleaner,
  uncleaner
} from 'cleaners'
import { randomBytes } from 'crypto'
import { asCouchDoc, CouchDoc, DatabaseSetup } from 'edge-server-tools'
import { ServerScope } from 'nano'

interface DummyRegularDoc {
  id: string
  created: Date
  firstName: string
  lastName: string
}

/**
 * Example regular (non-rolling) db used to store a person
 */
export const asDbDummyRegularDoc: Cleaner<
  CouchDoc<DummyRegularDoc>
> = asCouchDoc(
  asObject({
    id: asString,
    firstName: asString,
    lastName: asString,
    created: asDate,
    something: asNumber
  })
)
type DbDummyDocRegular = ReturnType<typeof asDbDummyRegularDoc>
const wasDbDummyRegularDoc = uncleaner(asDbDummyRegularDoc)

/**
 * The API keys database stores keys that can access our service.
 * The document key is the username.
 */
export const dbDummyRegularSetup: DatabaseSetup = {
  name: 'dummy_regular'
}

export async function dummyInsert(
  connection: ServerScope,
  doc: DummyRegularDoc
): Promise<void> {
  const db = connection.db.use(dbDummyRegularSetup.name)
  const id = randomBytes(16).toString('hex')
  await db.insert(wasDbDummyRegularDoc({ doc, id }))
}

/**
 * Looks up an API key.
 */
export async function getDummyDocRegular(
  connection: ServerScope,
  id: string
): Promise<DummyRegularDoc | undefined> {
  const db = connection.db.use(dbDummyRegularSetup.name)
  const reply = await db.list({
    include_docs: true,
    key: id
  })
  const [clean] = reply.rows.map(row =>
    unpackDummyRegularDoc(asDbDummyRegularDoc(row.doc))
  )
  return clean
}

function unpackDummyRegularDoc(doc: DbDummyDocRegular): DummyRegularDoc {
  return {
    id: doc.id,
    created: doc.doc.created,
    firstName: doc.doc.firstName,
    lastName: doc.doc.lastName
  }
}
