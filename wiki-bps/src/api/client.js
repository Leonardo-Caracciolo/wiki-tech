const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  return res.json()
}

export const api = {
  /** Lista todas las secciones con conteo de docs */
  getSections: () => request('/sections'),

  /** Lista docs de una sección */
  getSectionDocs: (sectionId) => request(`/sections/${sectionId}`),

  /** Renderiza un doc — devuelve { tipo, html? url? } */
  renderDoc: (sectionId, nombre) =>
    request(`/render/${sectionId}/${encodeURIComponent(nombre)}`),

  /** Búsqueda global o por sección */
  search: (q, sectionId = null) => {
    const params = new URLSearchParams({ q })
    if (sectionId) params.set('section', sectionId)
    return request(`/search?${params}`)
  },

  /** URL de descarga directa de un archivo */
  downloadUrl: (sectionId, nombre) =>
    `${BASE}/file/${sectionId}/${encodeURIComponent(nombre)}`,
}
