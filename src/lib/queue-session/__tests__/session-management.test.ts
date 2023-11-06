import { beforeEach, describe, expect, it } from "vitest";

import { Context, createMockContext,MockContext } from "@/../context";

import { createSession } from "../session-management";

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

// NOTE: Not an actual functional test at the moment..
describe('', () => {
  it('', async () => {
    const user = {
      id: '1',
      name: 'Gordon',
      email: 'Gordon@myspace.com',
      emailVerified: null,
      image: null,
      accounts: [],
      sessions: [],
      posts: [],
      currentlyPlayingId: null,
      currentlyPlaying: null,
      queueId: null,
      queue: null,
      suggestedId: null,
      suggested: null
    }
    
    mockCtx.prisma.user.findFirst.mockResolvedValue(user)
    
    await expect(createSession()).resolves.toEqual(user)
  })
})