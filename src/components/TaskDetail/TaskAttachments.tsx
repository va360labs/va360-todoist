import { useEffect, useRef, useState } from 'react'
import { File as FileIcon, Trash2, Upload } from 'lucide-react'
import { useTodoStore } from '../../store'
import type { Task } from '../../types'
import { uid } from '../../lib/id'
import { deleteAttachmentBlob, getAttachmentBlob, saveAttachmentBlob } from '../../lib/attachmentStore'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPT = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentThumbnail({ id, name }: { id: string; name: string }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false

    getAttachmentBlob(id).then((blob) => {
      if (cancelled || !blob) return
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id])

  if (!url) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
        <FileIcon className="h-5 w-5 text-slate-400" />
      </div>
    )
  }

  return <img src={url} alt={name} className="h-12 w-12 shrink-0 rounded object-cover" />
}

export function TaskAttachments({ task }: { task: Task }) {
  const addAttachment = useTodoStore((s) => s.addAttachment)
  const deleteAttachment = useTodoStore((s) => s.deleteAttachment)

  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" supera el tamaño máximo de 10MB.`)
        continue
      }
      try {
        const id = uid()
        await saveAttachmentBlob(id, file)
        addAttachment(task.id, {
          id,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          createdAt: Date.now(),
        })
      } catch {
        setError(`No se pudo subir "${file.name}". Inténtalo de nuevo.`)
      }
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(attachmentId: string) {
    await deleteAttachmentBlob(attachmentId)
    deleteAttachment(task.id, attachmentId)
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Archivos adjuntos</h2>

      {task.attachments.length === 0 ? (
        <p className="text-xs text-slate-400">Sin archivos adjuntos.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {task.attachments.map((a) => (
            <li
              key={a.id}
              className="group flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800"
            >
              {a.mimeType.startsWith('image/') ? (
                <AttachmentThumbnail id={a.id} name={a.name} />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
                  <FileIcon className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700 dark:text-slate-200">{a.name}</p>
                <p className="text-xs text-slate-400">{formatSize(a.size)}</p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="hidden shrink-0 rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-950/50"
                aria-label="Eliminar adjunto"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400">
        <Upload className="h-3.5 w-3.5" />
        Subir archivo
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          onChange={(e) => {
            void handleFiles(e.target.files)
          }}
          className="hidden"
        />
      </label>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </section>
  )
}
