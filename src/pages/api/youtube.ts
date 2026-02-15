import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const videoId = url.searchParams.get('id');
  
  if (!videoId) {
    return new Response(JSON.stringify({ error: 'No video ID provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const apiKey = import.meta.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ views: 0, likes: 0 }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      return new Response(JSON.stringify({
        views: parseInt(stats.viewCount) || 0,
        likes: parseInt(stats.likeCount) || 0
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ views: 0, likes: 0 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ views: 0, likes: 0 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
