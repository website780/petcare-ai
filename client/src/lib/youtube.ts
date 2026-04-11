export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

// Helper function to extract video ID from YouTube URL
export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Get proper YouTube embed URL
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

// Search for YouTube videos
export async function searchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return response.json();
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}
