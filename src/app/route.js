export async function GET() {
  try {
    const res = await fetch("https://minimum-place-850981.framer.app/", {
      next: { revalidate: 60 } // cache landing page for 60 seconds
    });
    let html = await res.text();
    
    // Inject client-side script to rewrite link hrefs and intercept clicks
    const script = `
      <script>
        (function() {
          function rewriteLinks() {
            const links = document.querySelectorAll("a");
            links.forEach(a => {
              const text = a.textContent ? a.textContent.trim().toLowerCase() : "";
              const htmlContent = a.innerHTML ? a.innerHTML.toLowerCase() : "";
              const hasSignIn = text.includes("sign in") || htmlContent.includes("sign in");
              const hasSignUp = text.includes("sign up") || htmlContent.includes("sign up") || text.includes("get started") || htmlContent.includes("get started") || text.includes("register") || htmlContent.includes("register");
              const hasExplore = text.includes("explore") || htmlContent.includes("explore");
              
              if (hasSignIn) {
                a.setAttribute("href", "/login");
                if (!a.dataset.rewritten) {
                  a.dataset.rewritten = "true";
                  a.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = "/login";
                  }, true); // Use capture phase to intercept before React router
                }
              } else if (hasSignUp) {
                a.setAttribute("href", "/signup");
                if (!a.dataset.rewritten) {
                  a.dataset.rewritten = "true";
                  a.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = "/signup";
                  }, true); // Use capture phase to intercept before React router
                }
              } else if (hasExplore) {
                a.setAttribute("href", "/login");
                if (!a.dataset.rewritten) {
                  a.dataset.rewritten = "true";
                  a.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = "/login";
                  }, true); // Use capture phase to intercept before React router
                }
              }
            });
          }
          // Run immediately on page load
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", rewriteLinks);
          } else {
            rewriteLinks();
          }
          // Periodically execute to handle React hydration overwrites
          setInterval(rewriteLinks, 300);
          // Observe mutations to handle dynamically rendered parts of Framer
          if (typeof MutationObserver !== "undefined") {
            const observer = new MutationObserver(rewriteLinks);
            observer.observe(document.documentElement, { childList: true, subtree: true });
          }
        })();
      </script>
    `;
    
    html = html.replace("</body>", `${script}</body>`);
    
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=60"
      },
    });
  } catch (err) {
    console.error("Framer proxy load error:", err);
    // Simple fallback redirect to dashboard if proxy fails
    return new Response(
      `<html><head><meta http-equiv="refresh" content="0; url=/dashboard" /></head><body>Redirecting to dashboard...</body></html>`,
      {
        headers: { "Content-Type": "text/html" }
      }
    );
  }
}
