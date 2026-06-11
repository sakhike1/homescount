const DEFAULT_MS = 5_000

/** Fail fast when Postgres (e.g. Neon cold start) is unreachable. */
export function withDbTimeout<T>(promise: Promise<T>, ms = DEFAULT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`database query timeout after ${ms}ms`))
    }, ms)

    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}
