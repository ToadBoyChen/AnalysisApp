import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'bg-blue-500')
      expect(result).toBe('px-2 py-1 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toBe('base-class conditional-class')
    })

    it('should handle Tailwind conflicts correctly', () => {
      const result = cn('px-2 px-4', 'py-1 py-2')
      expect(result).toBe('px-4 py-2')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle objects with boolean values', () => {
      const result = cn({
        'active': true,
        'inactive': false,
        'visible': true
      })
      expect(result).toBe('active visible')
    })
  })
})
