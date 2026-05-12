const port = process.env.PORT || 3000;

Bun.serve({
  port: port,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Hello via Bun! (Transactions Microservice)");
  },
});

console.log(`🚀 Server running at http://localhost:${port}`);
