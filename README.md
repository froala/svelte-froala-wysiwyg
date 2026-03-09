# Froala WYSIWYG Editor Svelte Wrapper

[![npm version](https://badge.fury.io/js/svelte-froala-wysiwyg.svg)](https://badge.fury.io/js/svelte-froala-wysiwyg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official Svelte wrapper for [Froala WYSIWYG HTML Editor](https://froala.com/wysiwyg-editor/).

## Features
- **Two-way Data Binding:** Seamlessly sync editor content with Svelte variables.
- **Custom Configuration:** Full access to all Froala options and events.
- **Special Tag Support:** Initialize the editor on `<img>`, `<button>`, `<input>`, and `<a>` tags.
- **Manual Control:** Programmatically initialize and destroy editor instances.

---

## Installation

```bash
npm install svelte-froala-wysiwyg
```
## Development Setup
```bash
npm install
```

```bash
npm run dev 
```

## Quick Start

### Props
model
config
tag
editor
manual

### Methods
initializeEditor()
destroy()
getEditor()

### Basic Usage
Use the `FroalaEditor` component in your Svelte file:

```svelte
<script>
  import FroalaEditor from "svelte-froala-wysiwyg";

  let htmlContent = "<p>Hello, Froala!</p>";
</script>

<FroalaEditor bind:model={htmlContent} />

<div class="preview">
  {@html htmlContent}
</div>
```

---

## Advanced Usage

### Custom Configuration
Pass any [Froala Options](https://froala.com/wysiwyg-editor/docs/options/) via the `config` prop:

```svelte
<script>
  const myConfig = {
    placeholderText: 'Start typing...',
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'insertLink']
  };
</script>

<FroalaEditor config={myConfig} />
```

### Handling Events
Events can be defined within the `config.events` object:

```svelte
<script>
  const config = {
    events: {
      'contentChanged': function () {
        console.log('Content updated!');
      },
      'focus': function () {
        console.log('Editor focused');
      }
    }
  };
</script>

<FroalaEditor {config} />
```

### Special Tags (Non-div Elements)
Initialize Froala on elements like images or buttons. In this mode, the `model` becomes an object representing the element's attributes.

```svelte
<script>
  let imageModel = {
    src: "https://froala.com/assets/img/logo.png",
    alt: "Froala Logo"
  };
</script>

<FroalaEditor tag="img" bind:model={imageModel} />
```

### Manual Initialization
If you need to delay initialization or control it manually:

```svelte
<script>
  let editorRef;

  function init() {
    editorRef.initializeEditor();
  }
</script>

<button on:click={init}>Initialize Editor</button>

<FroalaEditor 
  bind:this={editorRef} 
  manual={true} 
  model="<p>Wait for it...</p>" 
/>
```

## Documentation
For full documentation on the Froala Editor API, options, and events, visit the [Official Froala Documentation](https://froala.com/wysiwyg-editor/docs/).

## License
The `svelte-froala-wysiwyg` wrapper is released under the **MIT License**.
However, **Froala Editor** itself requires a commercial license. Please visit [Froala Pricing](https://froala.com/wysiwyg-editor/pricing/) for more details.
