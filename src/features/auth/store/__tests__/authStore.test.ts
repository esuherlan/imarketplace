import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      failedAttempts: 0,
      lockedUntil: null,
    })
  })

  it('logs in successfully with correct dummy credentials', async () => {
    await useAuthStore.getState().login('admin@imago.us', 'password123')
    const state = useAuthStore.getState()
    expect(state.user).not.toBeNull()
    expect(state.user?.email).toBe('admin@imago.us')
    expect(state.token).toBe('dummy-jwt-token')
    expect(state.failedAttempts).toBe(0)
  })

  it('rejects invalid credentials and increments failedAttempts', async () => {
    await expect(
      useAuthStore.getState().login('admin@imago.us', 'wrongpass')
    ).rejects.toThrow('Invalid email or password')

    expect(useAuthStore.getState().failedAttempts).toBe(1)
  })

  it('locks account after 5 failed attempts', async () => {
    for (let i = 0; i < 4; i++) {
      await expect(
        useAuthStore.getState().login('admin@imago.us', 'wrongpass')
      ).rejects.toThrow('Invalid email or password')
    }

    // 5th attempt triggers lockout
    await expect(
      useAuthStore.getState().login('admin@imago.us', 'wrongpass')
    ).rejects.toThrow('Too many failed attempts. Account locked for 30s.')

    const state = useAuthStore.getState()
    expect(state.failedAttempts).toBe(0) // reset after lockout triggers
    expect(state.lockedUntil).not.toBeNull()
    expect(state.lockedUntil).toBeGreaterThan(Date.now())
  })

  it('blocks login attempts while locked, even with correct credentials', async () => {
    useAuthStore.setState({ lockedUntil: Date.now() + 30_000 })

    await expect(
      useAuthStore.getState().login('admin@imago.us', 'password123')
    ).rejects.toThrow(/Too many attempts/)
  })

  it('allows login again after lockout expires', async () => {
    // Simulasi lockout yang sudah lewat waktunya (langsung set ke masa lalu,
    // hindari fake timers karena Date.now() ikut ter-mock dan konflik dgn setTimeout di login())
    useAuthStore.setState({ lockedUntil: Date.now() - 1 })

    await useAuthStore.getState().login('admin@imago.us', 'password123')
    expect(useAuthStore.getState().user).not.toBeNull()
  })

  it('logs out and clears state', async () => {
    await useAuthStore.getState().login('admin@imago.us', 'password123')
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.failedAttempts).toBe(0)
  })
})
