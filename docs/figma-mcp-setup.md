# Connecting Figma MCP to Cursor

This guide helps ensure the Figma MCP server is connected so the Cursor agent can call tools like `get_variable_defs` to pull design tokens from your Doggo Figma file.

---

## Current Status

- **MCP config**: Figma Desktop is configured in `~/.cursor/mcp.json` at `http://127.0.0.1:3845/mcp`
- **Tool descriptors**: Cursor has the Figma MCP tool definitions (get_variable_defs, get_design_context, etc.) in the project
- **Issue**: The agent in this session doesn't have access to invoke MCP tools — this can be a session/model limitation

---

## Steps to Enable Figma MCP

### 1. Figma Desktop app

1. **Install/update** the [Figma Desktop app](https://www.figma.com/downloads/) (required; browser-only Figma won't work for the desktop MCP)
2. **Open** your Doggo file in Figma Desktop
3. **Switch to Dev Mode** — with nothing selected, use the toggle in the top toolbar to turn on Dev Mode
4. **Enable MCP** — in the right sidebar (Dev Mode panel), find and turn on the "MCP Server" toggle
5. **Confirm** — Figma should show a message that the server is running and give you a URL to copy (should be `http://127.0.0.1:3845/mcp`)

### 2. Cursor MCP settings

1. Open **Cursor Settings** (Cmd+, on Mac, Ctrl+, on Windows)
2. Go to **Features → MCP**
3. Confirm **Figma Desktop** appears in the list with a green/connected indicator
4. If it shows disconnected or missing:
   - Click **+ Add New MCP Server**
   - Use **URL** as the transport type
   - URL: `http://127.0.0.1:3845/mcp`
   - Name: `Figma Desktop`
5. Click **Refresh** to reload the tool list
6. Check that tools like `get_variable_defs`, `get_design_context`, etc. appear under "Available Tools"

### 3. Use Composer (Agent mode)

MCP tools are **only available in Composer**, not in regular Chat.

1. Open **Composer** (Cmd+I or Ctrl+I, or the Composer icon)
2. Start a **new** Composer session (sometimes a fresh session picks up MCP tools better)
3. Ensure you're in **Agent** mode (not Plan mode) if your Cursor version has that option

### 4. Explicitly ask for the tool

The agent may not always infer that it should use MCP. Try a direct request, for example:

> "Call the Figma MCP get_variable_defs tool with nodeId 17:163 to fetch the base color tokens from my Doggo Figma file. I have Figma Desktop open with the file."

Or:

> "Use the get_variable_defs MCP tool for node 17:163 and return the variable names and hex values."

### 5. If it still doesn't work

- **Restart Cursor** — MCP connections can get stuck
- **Restart Figma Desktop** — then re-enable the MCP toggle
- **Check the model** — some models may not support MCP; try a different model in Composer
- **Verify Figma is running** — the MCP server only runs while Figma Desktop is open
- **Check Cursor version** — ensure you're on a recent Cursor release with MCP support

---

## Alternative: Manual copy

If MCP continues to fail:

1. In Figma, open **Variables** (left sidebar or via the Variables panel)
2. Select the Base Colors collection (or the frame with node 17:163)
3. Copy variable names and values manually
4. Paste them into `docs/design-tokens.md` in the "Raw Figma Output" section
5. I can then map them to CSS variables in `globals.css`

---

## Your mcp.json (for reference)

```json
{
  "mcpServers": {
    "Figma Desktop": {
      "url": "http://127.0.0.1:3845/mcp",
      "headers": {}
    }
  }
}
```

Location: `~/.cursor/mcp.json`
