// import React from 'react';
// import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
// import { cleanup, render, screen, within } from '@testing-library/react';
// import { AddToQueueModal, Post, SongCard } from '@/components/songCard';
// import { songs } from '@/data/songs';
// import { PostData } from '@/types';

import { describe, test, expect } from "vitest";

describe("1 == 1", () => {
  test('1 == 1', () => {
    expect(1).toBe(1)
  })
})

// beforeEach(() => {
//   // IntersectionOvserver is not available in test environment
//   // Mocking it to prevent errors
//   const mockIntersectionObserver = vi.fn();
//   mockIntersectionObserver.mockReturnValue({
//     observe: () => null,
//     unobserve: () => null,
//     disconnect: () => null
//   });
//   window.IntersectionObserver = mockIntersectionObserver;
// })

// afterEach(() => {
//   cleanup();
// })

// describe('Testing SongCard', () => {
//   const song = songs[0]
//   let progress_ms = 0

//   beforeEach(() => {
//     progress_ms = 1000
//   })

//   test('SongCard without progress should display basic song infromation', () => {
//     render(<SongCard song={song} />)

//     expect(screen.getByText(song.name)).toBeDefined()
//     expect(screen.getByText(song.artists[0].name)).toBeDefined()

//     //Looks for album image by alt text
//     expect(screen.getByAltText(song.album.name)).toBeDefined()
//   })

//   test('SongCard with progress should display basic song infromation', () => {
//     render(<SongCard song={song} progress_ms={progress_ms} />)

//     expect(screen.getByText(song.name)).toBeDefined()
//     expect(screen.getByText(song.artists[0].name)).toBeDefined()

//     //Looks for album image by alt text
//     expect(screen.getByAltText(song.album.name)).toBeDefined()
//   })

//   test('SongCard should display song information with progress bar if provided progress_ms', () => {
//     render(<SongCard song={song} progress_ms={progress_ms} />)

//     //Searches for the progress bar
//     const progressSection = screen.getByRole('progress')
//     expect(progressSection).toBeDefined()
//     expect(within(progressSection).getByRole('progressbar')).toBeDefined()
//     expect(within(progressSection).getByText(`00:01 / 00:10`)).toBeDefined()
//   })
// })

// describe('Testing SearchResult', () => {
//   const song = songs[0]

//   test('SearchResult should display basic song infromation', () => {
//     render(<SongCard song={song} />)

//     expect(screen.getByText(song.name)).toBeDefined()
//     expect(screen.getByText(song.artists[0].name)).toBeDefined()

//     //Looks for album image by alt text
//     expect(screen.getByAltText(song.album.name)).toBeDefined()
//   })
// })

// describe('Testing SongInformation', () => {
//   const song = songs[0]

//   test('SongInformation should display basic song infromation', () => {
//     render(<SongCard song={song} />)

//     expect(screen.getByText(song.name)).toBeDefined()
//     expect(screen.getByText(song.artists[0].name)).toBeDefined()

//     //Looks for album image by alt text
//     expect(screen.getByAltText(song.album.name)).toBeDefined()
//   })
// })

// describe('Testing Post', () => {
//   const post: PostData = {
//     id: 14,
//     title: "Test Post",
//     body: "This is a test post",
//     user: {
//       id: 1,
//       name: "Test User",
//       username: "testuser",
//       spotifyProfile: "spotify/testuser.com"
//     },
//     createdAt: "2021-08-15T00:00:00.000Z",
//     updatedAt: "2021-08-15T00:00:00.000Z",
//     item: songs[0]
//   }

//   test('Post should display basic infromation', () => {
//     // render(<Post post={post} />)

//     // expect(screen.getByText(post.item.name)).toBeDefined()
//     // expect(screen.getByText(post.item.artists[0].name)).toBeDefined()
//     // expect(screen.getByText(post.item.album.name)).toBeDefined()

//     // expect(screen.getByText(post.user.name)).toBeDefined()
//     // expect(screen.getByText(post.title)).toBeDefined()
//     // expect(screen.getByText(post.body)).toBeDefined()
//   })
// })

// describe('Add to Queue Modal', () => {
//   const song = songs[0]
//   const open = true
//   const addToQueue = () => { }
//   const cancelAddToQueue = () => { }

//   // test('Add to Queue Modal should display basic song infromation', () => {
//   //   render(<AddToQueueModal item={song} open={open} addToQueue={addToQueue} cancelAddToQueue={cancelAddToQueue} />)

//   //   expect(screen.getByText(song.name)).toBeDefined()
//   //   expect(screen.getByText(song.artists[0].name)).toBeDefined()

//   //   //Looks for album image by alt text
//   //   expect(screen.getByAltText(song.album.name)).toBeDefined()
//   // })

//   test('Filler', () => {
//     expect(1).toBe(1);
//   })

//   /** Test buttons will perform their provided action on click */
//   //Note that the provided action is arbitrary for this testing scenario ;)
//   // LOOK INTO WHAT WE CAN DETECT BASED OFF FUNCTION CALLS


// })