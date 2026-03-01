import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseMarkdownToCurriculum, getCurriculum } from '../parser'
import fs from 'fs'

vi.mock('fs')

describe('parser', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('parseMarkdownToCurriculum', () => {
    it('should parse headers and nested topics', () => {
      const md = '# Topic 1\n## Subtopic 1.1\n# Topic 2'
      const curriculum = parseMarkdownToCurriculum(md)
      expect(curriculum).toHaveLength(2)
      expect(curriculum[0].title).toBe('Topic 1')
      expect(curriculum[0].subtopics).toHaveLength(1)
      expect(curriculum[0].subtopics[0].title).toBe('Subtopic 1.1')
      expect(curriculum[1].title).toBe('Topic 2')
    })

    it('should extract links', () => {
      const md = '# Topic\n[Link](http://example.com)'
      const curriculum = parseMarkdownToCurriculum(md)
      expect(curriculum[0].links).toContainEqual({ title: 'Link', url: 'http://example.com' })
    })

    it('should extract checkboxes', () => {
      const md = '# Topic\n- [ ] Todo 1\n- [x] Done 1'
      const curriculum = parseMarkdownToCurriculum(md)
      expect(curriculum[0].checkboxes).toHaveLength(2)
      expect(curriculum[0].checkboxes![0]).toEqual({ text: 'Todo 1', completed: false })
      expect(curriculum[0].checkboxes![1]).toEqual({ text: 'Done 1', completed: true })
    })
  })

  describe('getCurriculum', () => {
    it('should read from README.md for default en lang', () => {
      // Ensure we are in a non-window environment for the test
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      vi.spyOn(fs, 'readFileSync').mockReturnValue('# Mocked README')
      const curriculum = getCurriculum()
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('README.md'), 'utf-8')
      expect(curriculum[0].title).toBe('Mocked README')

      global.window = originalWindow;
    })

    it('should handle missing files gracefully', () => {
       const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('File not found') })
      const curriculum = getCurriculum('nonexistent')
      expect(curriculum).toEqual([])

      global.window = originalWindow;
    })
  })
})
