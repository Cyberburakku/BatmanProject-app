// Supabase is loaded on demand. Nobody should download 120kB of database client
// to open a task list that saves to their own browser.
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True when both keys are present, so the UI can hide sign-in entirely otherwise. */
export const supabaseReady = Boolean(url && anon)

const TABLE = 'boards'
let clientPromise = null

export const getClient = () => {
  if (!supabaseReady) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js')
      .then(({ createClient }) =>
        createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } }),
      )
      .catch((err) => {
        console.warn('Could not load Supabase', err)
        clientPromise = null
        return null
      })
  }
  return clientPromise
}

/** Read this user's saved board. Returns null when they have never synced. */
export const pullBoard = async (userId) => {
  const sb = await getClient()
  if (!sb) return null
  const { data, error } = await sb.from(TABLE).select('data').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data?.data ?? null
}

export const pushBoard = async (userId, state) => {
  const sb = await getClient()
  if (!sb) return
  const { error } = await sb
    .from(TABLE)
    .upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  if (error) throw error
}

/** Live updates from this user's other devices. Returns an unsubscribe function. */
export const watchBoard = (userId, onRemote) => {
  let channel = null
  let stopped = false
  getClient().then((sb) => {
    if (!sb || stopped) return
    channel = sb
      .channel(`board-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE, filter: `user_id=eq.${userId}` },
        (payload) => { if (payload.new?.data) onRemote(payload.new.data) },
      )
      .subscribe()
  })
  return () => {
    stopped = true
    if (channel) getClient().then((sb) => sb?.removeChannel(channel))
  }
}

/** Watch the signed-in user. Returns an unsubscribe function. */
export const watchAuth = (onUser) => {
  let stopped = false
  let unsub = () => {}
  getClient().then((sb) => {
    if (!sb || stopped) return
    sb.auth.getSession().then(({ data }) => { if (!stopped) onUser(data.session?.user ?? null) })
    const { data } = sb.auth.onAuthStateChange((_event, session) => onUser(session?.user ?? null))
    unsub = () => data.subscription.unsubscribe()
  })
  return () => { stopped = true; unsub() }
}

export const signIn = async ({ email, password }) => {
  const sb = await getClient()
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export const signUp = async ({ email, password }) => {
  const sb = await getClient()
  const { error } = await sb.auth.signUp({ email, password })
  if (error) throw error
}

export const signOut = async () => {
  const sb = await getClient()
  await sb?.auth.signOut()
}
