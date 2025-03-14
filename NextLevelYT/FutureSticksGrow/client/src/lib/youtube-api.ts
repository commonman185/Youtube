import { apiRequest } from './queryClient';

/**
 * Simulated YouTube API client for demo purposes
 * In a real application, this would integrate with the actual YouTube API
 */

interface YouTubeChannelData {
  id: string;
  name: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnail: string;
}

interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  thumbnail: string;
}

interface YouTubeCommentData {
  id: string;
  authorName: string;
  authorProfileImageUrl: string;
  text: string;
  publishedAt: string;
  likeCount: number;
}

export async function linkYouTubeChannel(
  userId: number,
  channelUrl: string
): Promise<YouTubeChannelData> {
  // Extract channel ID from URL
  const channelId = extractChannelId(channelUrl);
  
  if (!channelId) {
    throw new Error('Invalid YouTube channel URL');
  }
  
  try {
    // Simulate fetching channel data
    const channelData: YouTubeChannelData = {
      id: channelId,
      name: 'Your Channel Name',
      subscriberCount: Math.floor(Math.random() * 10000),
      videoCount: Math.floor(Math.random() * 100),
      viewCount: Math.floor(Math.random() * 1000000),
      thumbnail: 'https://via.placeholder.com/150'
    };
    
    // Save to backend
    await apiRequest('POST', '/api/channels', {
      userId,
      channelId: channelData.id,
      channelName: channelData.name,
      subscriberCount: channelData.subscriberCount,
      videoCount: channelData.videoCount,
      viewCount: channelData.viewCount,
      channelThumbnail: channelData.thumbnail,
      lastUpdated: new Date().toISOString()
    });
    
    return channelData;
  } catch (error) {
    console.error('Error linking YouTube channel:', error);
    throw new Error('Failed to link YouTube channel. Please try again later.');
  }
}

export async function getYouTubeChannelData(userId: number): Promise<YouTubeChannelData | null> {
  try {
    const response = await apiRequest('GET', `/api/channels/user/${userId}`);
    const data = await response.json();
    
    return {
      id: data.channelId,
      name: data.channelName,
      subscriberCount: data.subscriberCount,
      videoCount: data.videoCount,
      viewCount: data.viewCount,
      thumbnail: data.channelThumbnail
    };
  } catch (error) {
    // Channel might not be linked yet
    return null;
  }
}

export async function getRecentVideos(channelId: string): Promise<YouTubeVideoData[]> {
  // Simulate fetching recent videos
  const videos: YouTubeVideoData[] = [];
  
  for (let i = 0; i < 5; i++) {
    videos.push({
      id: `video-${i}`,
      title: `Video Title ${i + 1}`,
      description: 'This is a video description.',
      viewCount: Math.floor(Math.random() * 5000),
      likeCount: Math.floor(Math.random() * 500),
      commentCount: Math.floor(Math.random() * 100),
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      thumbnail: 'https://via.placeholder.com/320x180'
    });
  }
  
  return videos;
}

export async function getVideoComments(videoId: string): Promise<YouTubeCommentData[]> {
  // Simulate fetching comments
  const comments: YouTubeCommentData[] = [];
  
  const sampleTexts = [
    'Great video! I learned a lot from this content.',
    'I have a question about the technique you showed at 3:45.',
    'Your setup is amazing! What microphone are you using?',
    'Could you make a tutorial about this specific topic?',
    'I have been following your channel for months and your content keeps getting better!'
  ];
  
  for (let i = 0; i < 5; i++) {
    comments.push({
      id: `comment-${i}`,
      authorName: `User ${i + 1}`,
      authorProfileImageUrl: 'https://via.placeholder.com/50',
      text: sampleTexts[i],
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      likeCount: Math.floor(Math.random() * 20)
    });
  }
  
  return comments;
}

function extractChannelId(url: string): string | null {
  // Extract channel ID from various YouTube URL formats
  // This is a simplified version
  const patterns = [
    /youtube\.com\/channel\/([\w-]+)/,
    /youtube\.com\/c\/([\w-]+)/,
    /youtube\.com\/user\/([\w-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  // If no pattern matches, return a mock ID for demo purposes
  return 'UC-demo-channel-id';
}
