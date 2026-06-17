import {
  DESKTOP_AUTH_SCHEME,
  buildDesktopAuthCallbackUrl,
} from "@/features/auth/lib/desktop-callback";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildDesktopAuthBridgeHtml(deepLink: string): string {
  const safeLink = escapeHtml(deepLink);
  const appName = escapeHtml(DESKTOP_AUTH_SCHEME);

  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Amadeus 로그인</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #0b0b0f;
        color: #f5f5f7;
      }
      main {
        width: min(420px, calc(100vw - 32px));
        padding: 32px 24px;
        border: 1px solid #2a2a33;
        border-radius: 20px;
        background: #14141a;
        text-align: center;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 1.25rem;
      }
      p {
        margin: 0 0 20px;
        color: #a1a1aa;
        line-height: 1.5;
        font-size: 0.95rem;
      }
      a, button {
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        border: 0;
        border-radius: 999px;
        padding: 14px 18px;
        font-size: 0.95rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        background: #7c5cff;
        color: white;
      }
      .hint {
        margin-top: 16px;
        font-size: 0.8rem;
        color: #71717a;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Amadeus 앱으로 돌아가는 중</h1>
      <p>브라우저가 자동으로 앱을 열지 않으면 아래 버튼을 눌러주세요.</p>
      <a id="open-app" href="${safeLink}">Amadeus 앱 열기</a>
      <p class="hint">로그인을 완료하려면 ${appName}:// 프로토콜이 등록된 앱이 필요합니다.</p>
    </main>
    <script>
      (function () {
        var target = ${JSON.stringify(deepLink)};
        function openApp() {
          window.location.href = target;
        }
        setTimeout(openApp, 120);
        setTimeout(openApp, 800);
        document.getElementById("open-app").addEventListener("click", function (event) {
          event.preventDefault();
          openApp();
        });
      })();
    </script>
  </body>
</html>`;
}

export function desktopAuthBridgeResponse(deepLink: string): Response {
  return new Response(buildDesktopAuthBridgeHtml(deepLink), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
