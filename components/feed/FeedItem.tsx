// Feed item wrapper component

import { FeedPost } from '@/types/feed.types';
import PuzzlePost from './PuzzlePost';
import CompletionPost from './CompletionPost';

interface FeedItemProps {
  post: FeedPost;
  onRoot: () => void;
  onDelete?: () => void;
  canRoot: boolean;
}

export default function FeedItem({ post, onRoot, onDelete, canRoot }: FeedItemProps) {
  if (post.type === 'puzzle') {
    return <PuzzlePost post={post} onRoot={onRoot} canRoot={canRoot} />;
  }
  
  return <CompletionPost post={post} onRoot={onRoot} onDelete={onDelete} canRoot={canRoot} />;
}