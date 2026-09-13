export default {
  async fetch(request) {
    let repostsCount = 0;

    try {
      const url = new URL(request.url);
      const postId = url.searchParams.get('id') || 'BAJBkVbhyl';

      // 1. 抓取 Threads 頁面內容
      const res = await fetch(`https://www.threads.net/share/${postId}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        },
        redirect: 'follow',
      });

      if (res.ok) {
        const html = await res.text();
        // 2. 正則匹配抓取轉發數
        const match = html.match(/"repost_count":\s*(\d+)/) || html.match(/"reshare_count":\s*(\d+)/);
        if (match && match[1]) {
          repostsCount = parseInt(match[1], 10);
        }
      }
    } catch (e) {
      // 發生任何網路或解析異常時，自動回退顯示 0，防止 Error 1101
      repostsCount = 0;
    }

    // 3. 繪製並回傳 SVG 圖片
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

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  },
};
