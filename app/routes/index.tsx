import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const getCount = createServerFn({
  method: 'GET',
}).handler(async () => {
  const current = await redis.get<number>('counter')
  return current ?? 0
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((formData: FormData) => {
    const addBy = formData.get('addBy')
    if (!addBy) throw new Error('Missing addBy in form data')
    return Number(addBy)
  })
  .handler(async ({ data: increment }) => {
    await redis.incrby('counter', increment)
    return new Response(null, { status: 204 })
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()

  return (
    <button
      type="button"
      onClick={() => {
        const formData = new FormData()
        formData.append('addBy', '1')
        updateCount({ data: formData }).then(() => {
          router.invalidate()
        })
      }}
    >
      Add 1 to {state}?
    </button>
  )
}