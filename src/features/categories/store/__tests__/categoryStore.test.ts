import { describe, it, expect, beforeEach } from 'vitest'
import { useCategoryStore } from '../categoryStore'

describe('categoryStore', () => {
  beforeEach(() => {
    // Reset ke initial dummy data tiap test (store in-memory, tidak persist)
    useCategoryStore.setState({
      categories: [
        { id: '1', name: 'Electronics', slug: 'electronics', status: 'active', productCount: 128, createdAt: '2026-01-12' },
        { id: '2', name: 'Fashion', slug: 'fashion', status: 'active', productCount: 342, createdAt: '2026-02-03' },
      ],
    })
  })

  it('adds a new category with auto-generated slug', () => {
    useCategoryStore.getState().addCategory('Sports & Outdoor')

    const { categories } = useCategoryStore.getState()
    expect(categories).toHaveLength(3)
    expect(categories[0].name).toBe('Sports & Outdoor')
    expect(categories[0].slug).toBe('sports-outdoor')
    expect(categories[0].status).toBe('active')
    expect(categories[0].productCount).toBe(0)
  })

  it('updates category name and regenerates slug', () => {
    useCategoryStore.getState().updateCategory('1', 'Electronics & Gadgets')

    const updated = useCategoryStore.getState().categories.find((c) => c.id === '1')
    expect(updated?.name).toBe('Electronics & Gadgets')
    expect(updated?.slug).toBe('electronics-gadgets')
  })

  it('deletes a category by id', () => {
    useCategoryStore.getState().deleteCategory('1')

    const { categories } = useCategoryStore.getState()
    expect(categories).toHaveLength(1)
    expect(categories.find((c) => c.id === '1')).toBeUndefined()
  })

  it('toggles status between active and inactive', () => {
    useCategoryStore.getState().toggleStatus('1')
    expect(useCategoryStore.getState().categories.find((c) => c.id === '1')?.status).toBe('inactive')

    useCategoryStore.getState().toggleStatus('1')
    expect(useCategoryStore.getState().categories.find((c) => c.id === '1')?.status).toBe('active')
  })

  it('slugify handles special characters and edge cases', () => {
    useCategoryStore.getState().addCategory('  --Weird!!  Name??  --  ')
    const added = useCategoryStore.getState().categories[0]
    expect(added.slug).toBe('weird-name')
  })
})
