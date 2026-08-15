/**
 * Minimal, dependency-free wrapper around the browser's native IndexedDB API.
 * Stores raw attachment blobs (never persisted in the Zustand/localStorage store,
 * which only keeps `Attachment` metadata — see src/types.ts).
 */

interface AttachmentRecord {
  id: string
  blob: Blob
}

const DB_NAME = 'todo-app-attachments'
const DB_VERSION = 1
const STORE_NAME = 'attachments'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    }).catch((err) => {
      // Don't cache a failed connection attempt — let the next call retry
      // from scratch instead of permanently replaying the same rejection.
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}

export async function saveAttachmentBlob(id: string, blob: Blob): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const record: AttachmentRecord = { id, blob }
    tx.objectStore(STORE_NAME).put(record)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function getAttachmentBlob(id: string): Promise<Blob | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).get(id)
    request.onsuccess = () => {
      const record = request.result as AttachmentRecord | undefined
      resolve(record?.blob)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function deleteAttachmentBlob(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}
