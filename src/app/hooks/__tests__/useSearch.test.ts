import { act,render, renderHook, RenderHookResult } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, jest } from 'bun:test'

import { sampleSearchResults, sampleSearchResults2 } from '@/testData/searchData'

import { useSearch } from '../useSearch'

type HookReturnType = ReturnType<typeof useSearch>

/* Test Initial Values */
describe('Testing useSearch hook initial properties', () => {
  it("Search results should be empty", () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.searchResults).toEqual([])
  })

  it("Search query should be empty", () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.searchQuery).toEqual("")
  })

  it("Search field shouldn't be disabled", () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.searchFieldDisabled).toBeFalse
  })

  it("Offset should be set to 0 initially", () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.offset).toEqual(0)
  })
})

describe('Testing setSearchQuery', () => {
  let renderedHook: RenderHookResult<HookReturnType, HookReturnType>;
  beforeAll(() => {
    renderedHook = renderHook(() => useSearch())
  })  

  it(`Search query should update as expected when it's initially empty`, () => {
    expect(renderedHook.result.current.searchResults).toEqual([])

    act(() => {
      renderedHook.result.current.setSearchResults(sampleSearchResults)
    })
    expect(renderedHook.result.current.searchResults).toEqual(sampleSearchResults)
  })

  it(`Search query should properly even when it's not empty`, () => {
    expect(renderedHook.result.current.searchResults).toEqual(sampleSearchResults)

    act(() => {
      renderedHook.result.current.setSearchResults(sampleSearchResults2)
    })

    expect(renderedHook.result.current.searchResults).toEqual(sampleSearchResults2)

  })
})

/* Test Increment Function */
describe('Testing search results increment', () => {
   let renderedHook: RenderHookResult<HookReturnType, HookReturnType>;

  beforeAll(() => {
    renderedHook = renderHook(() => useSearch())
    
    renderedHook.result.current.setSearchResults(sampleSearchResults)
  })  

  it('Offset should start at increment by 5 on incrementOffset()', () => {
    
    expect(renderedHook.result.current.offset).toBe(0)

    act(() => {
      renderedHook.result.current.incrementOffset()
    })
    
    expect(renderedHook.result.current.offset).toBe(5)
  })

  it('Offset should start at increment by 5 on incrementOffset()', () => {
    expect(renderedHook.result.current.offset).toBe(5)
    
    act(() => {
      renderedHook.result.current.incrementOffset()
    })

    expect(renderedHook.result.current.offset).toBe(10)
  })

  it('Offset should stop incrementing when it is within the limit amount of the search results', () => {
    
    act(() => {
      renderedHook.result.current.incrementOffset()
    })
    
    act(() => {
      renderedHook.result.current.incrementOffset()
    })
    
    act(() => {
      renderedHook.result.current.incrementOffset()
    })

    let current = renderedHook.result.current

    expect(current.offset).
      toBeWithin(
        current.searchResults.length - current.offset, 
        current.searchResults.length
      )
  })
})

/* Test decrement function */
describe('Testing search results decrement', () => {
   let renderedHook: RenderHookResult<HookReturnType, HookReturnType>;

  beforeAll(() => {
    renderedHook = renderHook(() => useSearch())
    
    // Increment to the max
    act(() => { 
      renderedHook.result.current.setSearchResults(sampleSearchResults) 
    })
    act(() => { 
      renderedHook.result.current.incrementOffset()
    })
    act(() => { 
      renderedHook.result.current.incrementOffset()
    })
    act(() => { 
      renderedHook.result.current.incrementOffset()
    })
  })  

  it('Offset should start at decrement by 5 on decrementOffset()', () => {
    
    expect(renderedHook.result.current.offset).toBe(15)

    act(() => {
      renderedHook.result.current.decrementOffset()
    })
    
    expect(renderedHook.result.current.offset).toBe(10)
  })

  it('Offset should start at decrement by 5 on decrementOffset()', () => {
    expect(renderedHook.result.current.offset).toBe(10)
    
    act(() => {
      renderedHook.result.current.decrementOffset()
    })

    expect(renderedHook.result.current.offset).toBe(5)
  })

  it('Offset should stop decrementing when it reaches 0', () => {
    expect(renderedHook.result.current.offset).toBe(5)
    
    act(() => {
      renderedHook.result.current.decrementOffset()
    })

    expect(renderedHook.result.current.offset).toBe(0)
    
    act(() => {
      renderedHook.result.current.decrementOffset()
    })
    
    act(() => {
      renderedHook.result.current.decrementOffset()
    })

    expect(renderedHook.result.current.offset).toBe(0)    
  })
})

describe("Test clearSearchResults", () => {
  let renderedHook: RenderHookResult<HookReturnType, HookReturnType>;
  beforeAll(() => {
    renderedHook = renderHook(() => useSearch())
  })

  it("Clearing search result when it's already empty should do nothing", () => {
    expect(renderedHook.result.current.searchResults).toEqual([])
    act(() => {
      renderedHook.result.current.clearSearchResults()
    })

    expect(renderedHook.result.current.searchResults).toEqual([])
  })

  it("Clearing search result should work in proper conditions", () => {
    expect(renderedHook.result.current.searchResults).toEqual([])

    act(() => {
      renderedHook.result.current.setSearchResults(sampleSearchResults)
    })

    act(() => {
      renderedHook.result.current.clearSearchResults()
    })

    expect(renderedHook.result.current.searchResults).toEqual([])
  })
})
