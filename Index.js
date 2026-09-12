// index.js (Cloudflare Worker)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('id') || 'BAJBkVbhyl'; // 預設貼文 ID
    const accessToken = env.THREADS_ACCESS_TOKEN; // 從 Cloudflare 環境變數讀取

    let repostsCount = 0;

    // 1. 抓取 Threads 最新數據
    try {
      const apiRes = await fetch(
        `https://graph.threads.net/v1.0/${postId}?fields=reposts_count&access_token=${accessToken}`
      );
      const data = await apiRes.json();
      repostsCount = data.reposts_count || 0;
    } catch (err) {
      repostsCount = 0;
    }

    // 2. 即時繪製 SVG 動態圖片
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#101010"/>
        <text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" fill="#8E8E93" font-size="42" font-family="sans-serif">
          🔄 貼文累積轉發數量
        </text>
        <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#00D26A" font-size="140" font-weight="bold" font-family="sans-serif">
          ${repostsCount.toLocaleString()}
        </text>
      </svg>
    `;

    // 3. 回傳 SVG 圖片（設定 no-cache 讓每次點擊/發布時重新抓取）
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  },
};
