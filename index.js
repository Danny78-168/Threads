// 免 Token 爬蟲範例 (index.js)
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('id') || 'BAJBkVbhyl';
    
    // 1. 直接抓取 Threads 公開頁面 HTML
    const htmlRes = await fetch(`https://www.threads.net/share/${postId}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await htmlRes.text();
    
    // 2. 用正則表達式從網頁原始碼提取轉發數
    const match = html.match(/"repost_count":(\d+)/);
    const repostsCount = match ? parseInt(match[1]) : 0;

    // 3. 回傳 SVG 圖片 (可自由加上倍率)
    // ... (繪製 SVG 邏輯)
  }
}
