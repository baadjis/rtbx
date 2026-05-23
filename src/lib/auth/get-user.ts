import { createClient }
from '@/utils/supabase/server'

export async function requireUser() {

  const supabase =
    await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {

    return {
      user: null,
      error: 'Unauthorized'
    }

  }

  return {
    user,
    error: null
  }

}