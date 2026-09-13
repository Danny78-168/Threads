export default {
  async fetch(request) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('id') || 'BAJBkVbhyl';
    let repostsCount = 0;

    try {
      // 1. 免 Token 爬取 Threads 頁面 HTML
      const res = await fetch(`https://www.threads.net/share/${postId}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        },
        redirect: 'follow',
      });

      if (res.ok) {
        const htmlText = await res.text();
        const match = htmlText.match(/"repost_count":\s*(\d+)/) || htmlText.match(/"reshare_count":\s*(\d+)/);
        if (match && match[1]) {
          repostsCount = parseInt(match[1], 10);
        }
      }
    } catch (e) {
      repostsCount = 0;
    }

    // 2. 建立 Threads 官方一鍵轉發 Intent 網址
    const currentUrl = request.url;
    const shareText = encodeURIComponent(`這篇貼文目前累積轉發：${repostsCount} 次！點擊網址讓數字 +1：${currentUrl}`);
    const threadsIntentUrl = `https://www.threads.net/intent/post?text=${shareText}`;

    // 3. 回傳互動式 HTML 網頁
    const htmlPage = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Threads 轉發即時數</title>
        <style>
          body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
          .card { background: #181818; border: 1px solid #2a2a2a; border-radius: 20px; padding: 40px 20px; max-width: 450px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .title { font-size: 20px; color: #a0a0a0; margin-bottom: 10px; }
          .count { font-size: 80px; font-weight: 800; color: #00D26A; margin: 20px 0; letter-spacing: -2px; }
          .btn { display: inline-block; background-color: #fff; color: #000; font-weight: 700; padding: 16px 32px; border-radius: 99px; text-decoration: none; font-size: 18px; margin-top: 15px; transition: transform 0.15s ease, opacity 0.15s ease; }
          .btn:active { transform: scale(0.95); opacity: 0.9; }
          .tip { font-size: 13px; color: #666; margin-top: 25px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">🔄 貼文累積轉發數量</div>
          <div class="count">${repostsCount.toLocaleString()}</div>
          <a class="btn" href="${threadsIntentUrl}">一鍵轉發讓數字 +1</a>
          <div class="tip">點擊按鈕將自動跳轉至 Threads 帶入轉發文章</div>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlPage, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  },
};
