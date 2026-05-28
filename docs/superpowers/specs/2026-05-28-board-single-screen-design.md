# Board Single Screen Design Spec

**Date:** 2026-05-28
**Status:** Approved

## Overview

Build a single-page board experience that lets authenticated users create posts, add comments, and reply to comments in a threaded hierarchy. The page should feel like one cohesive board view rather than a multi-page forum.

## Scope

This feature covers one board screen with:
- a post composer
- a post detail area
- a threaded comment list
- inline reply forms for nested replies
- permission-based edit and delete actions

It does not cover search, pagination, file uploads, reactions, notifications, or multiple boards.

## Roles

Use four roles:
- `guest`: can read the board only
- `member`: can create posts, comments, and replies
- `moderator`: can create content and edit/delete any post or comment
- `admin`: can create content and edit/delete any post or comment

## Data Model

Extend the existing Prisma schema with:
- `User.role`
- `Post`
- `Comment`

### Post

Fields:
- `id`
- `title`
- `content`
- `authorId`
- `createdAt`
- `updatedAt`
- `deletedAt` optional for soft delete

### Comment

Fields:
- `id`
- `postId`
- `parentId` optional for replies
- `content`
- `authorId`
- `createdAt`
- `updatedAt`
- `deletedAt` optional for soft delete

The comment tree is represented with `parentId`, so any comment may have nested replies.

## Permission Rules

- `guest` can only read.
- `member` can create posts and comments, but can only edit/delete their own content.
- `moderator` and `admin` can edit/delete any post or comment.
- Deletion should be soft delete so the thread structure remains intact.

## UI Behavior

The board screen should show:
- a post editor at the top
- the current post content directly below
- a comment composer beneath the post
- comments rendered in nested order
- reply buttons under each comment
- edit and delete controls where permissions allow

Replies should open inline under the target comment. The thread should preserve parent-child relationships visually with indentation.

## Server Behavior

Use server actions for:
- creating posts
- creating comments
- creating replies
- editing content
- soft deleting content

All permission checks must happen on the server, not only in the UI.

## Files

Create or modify:
- `prisma/schema.prisma`
- `lib/board.ts`
- `app/page.tsx`
- `app/components/board.tsx`
- `app/components/post-editor.tsx`
- `app/components/comment-thread.tsx`
- `app/components/comment-form.tsx`
- `app/components/comment-item.tsx`
- `app/actions/board.ts`
- `app/(auth)/login/page.tsx` if needed for role-aware navigation
- `lib/auth.ts` if user role must be exposed in session

## Success Criteria

1. A signed-in `member` can create a post, add a comment, and reply to a reply.
2. A `guest` cannot create or edit content.
3. `moderator` and `admin` can edit and delete any visible post or comment.
4. Soft-deleted content stays in the thread so reply context is not broken.
5. The board works as a single screen without navigating away.

