// 'use server'

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utilities/OAuth/authOptions"
// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// // export async function addPost(formData: FormData, publish: boolean) {
// //   const session = await getServerSession(authOptions);

// //   if (!session?.user?.id) {
// //     throw new Error('Not authenticated');
// //   }

// //   const title = formData.get('title');
// //   const content = formData.get('content');
// //   const song = formData.get('song');

// //   if (typeof title !== 'string' || typeof content !== 'string') {
// //     throw new Error('Invalid form data');
// //   }

// //   if (!title.trim() || !content.trim()) {
// //     throw new Error('Post must have a title and content');
// //   }

// //   try {
// //     const post = await prisma.post.create({
// //       data: {
// //         title,
// //         content,
// //         song,
// //         published: publish,
// //         // authorId: session.user.id,
// //       },
// //     });
// //     revalidatePath(`/`);
// //     return post;
// //    } catch (error) {
// //      throw new Error(error);
// //    }
// //   }
// // }

// export async function getPost(id: number) {
//   const session  = await getServerSession(authOptions);

//   if (!session) {
//     throw new Error('Not authenticated');
//   }

//   try {
//     const result = await prisma.post.findUnique({
//       where: { id },
//     });
//     // const post: Post = result;
//     return result;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

// export async function getPosts() {

// }

// export async function updatePost(id: number, formData: FormData, publish: boolean) {

// }

// export async function deletePost(id: number) {

// }

// export async function publishPost(id: number) {

// }

// export async function unpublishPost(id: number) {

// }

// export async function getPublishedPosts() {

// }

// export async function getDraftPosts() {

// }
