export async function GET() {
  try {
    const res = await fetch("https://minimum-place-850981.framer.app/", {
      next: { revalidate: 60 } // cache landing page for 60 seconds
    });
    let html = await res.text();
    
    // Inject client-side script to rewrite link hrefs and intercept clicks
    const script = `
      <style>
        #__framer-badge-container { display: none !important; visibility: hidden !important; opacity: 0 !important; }
      </style>
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
          function modifyFooter() {
            if (window.footerUpdated) return;
            const links = Array.from(document.querySelectorAll("a"));
            // Find links that are likely in the footer (bottom of the page)
            const docLinks = links.filter(a => a.textContent.trim() === "Documentation");
            
            if (docLinks.length >= 2) {
              const footerDocLink = docLinks[docLinks.length - 1];
              
              // Try to find the footer container to hide it entirely
              let parent = footerDocLink.parentElement;
              for (let i = 0; i < 8; i++) {
                if (parent && parent.tagName !== "BODY") {
                  // Check if it's a wide container (like a section) but not too tall (to avoid hiding the whole page)
                  if (parent.offsetWidth > window.innerWidth * 0.8 && parent.offsetHeight < 800) {
                    parent.style.display = "none"; // Hide the old footer completely
                    window.footerUpdated = true;
                    
                    // Inject our brand new custom footer
                    const newFooter = document.createElement("div");
                    newFooter.style.cssText = "width: 100%; padding: 40px 60px; background: #fdf2f8; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #fbcfe8; font-family: 'Outfit', sans-serif; box-sizing: border-box;";
                    newFooter.innerHTML = \`
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #f43f5e, #a855f7); box-shadow: 0 4px 10px rgba(244,63,94,0.3);"></div>
                        <span style="font-weight: 900; font-size: 20px; color: #0f172a; tracking: -0.5px;">SocialPulse</span>
                      </div>
                      <div style="display: flex; gap: 18px;">
                        <!-- X (Twitter) -->
                        <a href="#" style="color: #475569; transition: color 0.2s;" onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#475569'">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <!-- Facebook -->
                        <a href="#" style="color: #475569; transition: color 0.2s;" onmouseover="this.style.color='#1877F2'" onmouseout="this.style.color='#475569'">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        </a>
                        <!-- Instagram -->
                        <a href="#" style="color: #475569; transition: color 0.2s;" onmouseover="this.style.color='#E1306C'" onmouseout="this.style.color='#475569'">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                      </div>
                    \`;
                    document.body.appendChild(newFooter);
                    break;
                  }
                  parent = parent.parentElement;
                }
              }
            }
          }
          // Run immediately on page load
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => { rewriteLinks(); modifyFooter(); });
          } else {
            rewriteLinks();
            modifyFooter();
          }
          // Periodically execute to handle React hydration overwrites
          setInterval(() => { rewriteLinks(); modifyFooter(); }, 300);
          // Observe mutations to handle dynamically rendered parts of Framer
          if (typeof MutationObserver !== "undefined") {
            const observer = new MutationObserver(() => { rewriteLinks(); modifyFooter(); });
            observer.observe(document.documentElement, { childList: true, subtree: true });
          }
        })();
      </script>
    `;
    
    // Remove any Framer favicons directly by URL
    html = html.replace(/https:\/\/framerusercontent\.com\/sites\/icons\/[^"]+/gi, '/favicon.ico');
    
    // Also strip out any meta tags that mention framer
    html = html.replace(/<meta[^>]*content="[^"]*framer[^"]*"[^>]*>/gi, '');

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
