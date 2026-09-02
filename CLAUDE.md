# Project instructions

The authoritative build specification is:

docs/BUILD_CONTRACT.md

Read it before making architectural decisions.

This is an OpenAI WebMCP Challenge submission built by extending an existing
normal careers/job portal.

Core rules:

- DO NOT rebuild the careers app.
- DO NOT add an LLM, AI SDK, chat panel, recommendation model, or MCP server.
- The existing app must remain useful with WebMCP unavailable.
- WebMCP exposes semantic equivalents of the site's existing job/application
  capabilities.
- Use the site's CURRENT candidate session and current UI context.
- Never expose auth/session secrets.
- Public job/application text is untrusted content.
- Prefer existing service adapters/store/domain logic over DOM automation.
- Mutations must use the same application services as the human UI.
- Human edits to application drafts must not be silently overwritten.
- The page is the integration.
- Read docs/BUILD_CONTRACT.md before deviating.
