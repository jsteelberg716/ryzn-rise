import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ─────────────────────────────────────────────────────────────────────
// Edge-functions dev plugin
//
// In production, files under `api/*.ts` deploy as Vercel functions and
// answer at `/api/<name>`. Vite's dev server doesn't know about them,
// so `/api/chat` in localhost falls through to the SPA's HTML and the
// chat widget chokes on JSON.parse. This plugin bridges that gap: when
// the dev server sees POST /api/chat, it dynamically imports the same
// `api/chat.ts` module that ships to prod, adapts the Node request to
// a Web `Request`, calls the Edge handler, then writes the Web
// `Response` back to Node. Single source of truth — no duplicated
// OpenAI call, no drift between dev + prod.
// ─────────────────────────────────────────────────────────────────────
const edgeFunctionsDevPlugin = () => ({
  name: "ryzn-edge-functions-dev",
  apply: "serve" as const,
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const url: string = req.url ?? "";
      const pathname = url.split("?")[0];
      // Only /api/chat is dev-shimmed. /api/stats and /api/track use
      // Upstash Redis + Vercel Node types and need the real Vercel
      // runtime — they're not blockers for chat work.
      if (pathname !== "/api/chat") return next();

      try {
        const mod = await server.ssrLoadModule(
          path.resolve(__dirname, "api/chat.ts"),
        );
        const handler = mod.default;
        if (typeof handler !== "function") return next();

        // Drain the Node request body and rebuild it as a Web Request
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = chunks.length ? Buffer.concat(chunks) : undefined;

        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) {
          if (Array.isArray(v)) headers.set(k, v.join(", "));
          else if (typeof v === "string") headers.set(k, v);
        }

        const webReq = new Request(`http://localhost${url}`, {
          method: req.method,
          headers,
          body:
            body && req.method !== "GET" && req.method !== "HEAD"
              ? body
              : undefined,
        });

        const webRes: Response = await handler(webReq);
        res.statusCode = webRes.status;
        webRes.headers.forEach((value, key) => res.setHeader(key, value));
        const text = await webRes.text();
        res.end(text);
      } catch (err) {
        console.error("[ryzn-edge-functions-dev]", err);
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "dev-handler error" }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // The Edge handler reads `process.env.OPENAI_API_KEY`. Vite loads
  // `.env.local` into `import.meta.env`, not into `process.env`, so we
  // copy it across for the dev-shim path.
  const env = loadEnv(mode, process.cwd(), "");
  if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && edgeFunctionsDevPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
