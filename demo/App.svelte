<script>
  import FroalaEditor from "../lib/FroalaEditor.svelte";
  import 'froala-editor/css/froala_editor.pkgd.min.css';
  import 'froala-editor/css/froala_style.css';

  // 1. Basic & Two-way Binding
  let basicHtml = "<p>Hello Froala! Try editing this content.</p>";
  let sharedHtml =
    "<p>These two editors share the same model. Changes in one reflect in the other.</p>";

  // 2. Custom Config
  let configHtml =
    "<p>This editor has a custom toolbar and a fixed height.</p>";
  let customConfig = {
    height: 200,
    placeholderText: "Start typing here...",
    toolbarButtons: [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "|",
      "fontFamily",
      "fontSize",
      "color",
      "|",
      "paragraphFormat",
      "align",
      "formatOL",
      "formatUL",
      "|",
      "insertLink",
      "insertImage",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
  };

  // 3. External Updates
  let externalHtml = "<p>This content can be modified by the button above.</p>";
  function updateExternal() {
    externalHtml = `<p><strong>Updated externally!</strong> Current time: ${new Date().toLocaleTimeString()}</p>`;
  }

  // 4. Special Tags
  let imageModel = {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s",
    alt: "Froala Logo",
    style: "width: 150px; border-radius: 8px;",
  };

  let buttonModel = {
    innerHTML: "Editable Button Content",
    class: "demo-custom-btn",
  };

  let inputModel = {
    value: "Editable Input Field",
    type: "text",
    style:
      "padding: 12px; border: 2px solid #1e88e5; border-radius: 4px; width: 100%; box-sizing: border-box;",
  };

  let linkModel = {
    href: "https://froala.com",
    innerHTML: "Visit Froala Official Site",
    target: "_blank",
    style: "color: #1e88e5; font-weight: bold; text-decoration: underline;",
  };

  // 5. Manual & Instance
  let manualEditor;
  let editorInstance;
  let isInitialized = false;

  function handleInitialized(e) {
    console.log("Editor initialized successfully!", e.detail);
    isInitialized = true;
  }

  function logInstance() {
    if (editorInstance) {
      console.log("Current Editor Instance Object:", editorInstance);
      alert("Editor instance logged to the console!");
    }
  }

  // 6. Init on Delay
  let delayedEditor;
  let countdown = 0;
  let isDelayedInitStarted = false;

  function startDelayedInit() {
    if (isDelayedInitStarted) return;
    isDelayedInitStarted = true;
    countdown = 3;

    const interval = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(interval);
        if (delayedEditor) {
          delayedEditor.initializeEditor();
        }
      }
    }, 1000);
  }
</script>

<div class="page-wrapper">
  <header class="main-header">
    <h1>Froala Svelte Wrapper Demo</h1>
    <p class="subtitle">Experience seamless WYSIWYG editing in Svelte</p>
  </header>

  <main class="content-container">
    <section class="demo-section">
      <div class="section-header">
        <h2>1. Basic Usage & Two-way Binding</h2>
        <span class="badge">Standard</span>
      </div>
      <div class="card">
        <div class="editor-wrap">
          <FroalaEditor
            bind:model={basicHtml}
            config={{
              events: {
                focus() {
                  console.log("focus triggered");
                },
                blur() {
                  console.log("blur triggered");
                },
                contentChanged() {
                  console.log("content changed");
                },
                "image.inserted"(img) {
                  console.log("image inserted", img);
                },
              },
            }}
          />
        </div>
        <div class="live-preview">
          <h4>Live Preview:</h4>
          <div class="preview-content">{@html basicHtml}</div>
        </div>
      </div>

      <div class="card mt-20">
        <h3>Shared Model Sync</h3>
        <p class="desc">Two editor instances bound to the same variable.</p>
        <div class="editor-grid">
          <FroalaEditor bind:model={sharedHtml} />
          <FroalaEditor bind:model={sharedHtml} />
        </div>
      </div>
    </section>

    <section class="demo-section">
      <div class="section-header">
        <h2>2. Custom Configuration</h2>
        <span class="badge secondary">Configured</span>
      </div>
      <div class="card">
        <FroalaEditor bind:model={configHtml} config={customConfig} />
      </div>
    </section>

    <section class="demo-section">
      <div class="section-header">
        <h2>3. External State Control</h2>
        <span class="badge info">External</span>
      </div>
      <div class="card">
        <div class="toolbar-mock">
          <button class="btn primary" on:click={updateExternal}
            >Change Content From Svelte</button
          >
        </div>
        <FroalaEditor bind:model={externalHtml} />
      </div>
    </section>

    <section class="demo-section">
      <div class="section-header">
        <h2>4. Special Tag Integration</h2>
        <span class="badge warning">Advanced</span>
      </div>
      <p class="section-desc">
        Initialize Froala on non-div elements. The model becomes an attribute
        object.
      </p>

      <div class="tag-grid">
        <div class="card tag-card">
          <h3>Image Editor</h3>
          <div class="tag-preview">
            <FroalaEditor tag="img" bind:model={imageModel} />
          </div>
          <pre class="json-code">{JSON.stringify(imageModel, null, 2)}</pre>
        </div>

        <div class="card tag-card">
          <h3>Button Editor</h3>
          <div class="tag-preview">
            <FroalaEditor tag="button" bind:model={buttonModel} />
          </div>
          <pre class="json-code">{JSON.stringify(buttonModel, null, 2)}</pre>
        </div>

        <div class="card tag-card">
          <h3>Input Field</h3>
          <div class="tag-preview">
            <FroalaEditor tag="input" bind:model={inputModel} />
          </div>
          <pre class="json-code">{JSON.stringify(inputModel, null, 2)}</pre>
        </div>

        <div class="card tag-card">
          <h3>Link / Anchor</h3>
          <div class="tag-preview">
            <FroalaEditor tag="a" bind:model={linkModel} />
          </div>
          <pre class="json-code">{JSON.stringify(linkModel, null, 2)}</pre>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <div class="section-header">
        <h2>5. API & Lifecycle Control</h2>
        <span class="badge dark">Manual</span>
      </div>
      <div class="card">
        <div class="toolbar-mock">
          <button
            class="btn success"
            on:click={() => manualEditor.initializeEditor()}>Init Editor</button
          >
          <button class="btn danger" on:click={() => manualEditor.destroy()}
            >Destroy Editor</button
          >
          <button
            class="btn outline"
            on:click={logInstance}
            disabled={!isInitialized}>Inspect Instance</button
          >
        </div>
        <div class="manual-box">
          <FroalaEditor
            bind:this={manualEditor}
            bind:editor={editorInstance}
            manual={true}
            on:initialized={handleInitialized}
            model="<p>This editor was initialized via the component API.</p>"
          />
        </div>
      </div>
    </section>

    <section class="demo-section">
      <div class="section-header">
        <h2>6. Delayed Initialization</h2>
        <span class="badge info">Timer</span>
      </div>
      <div class="card">
        <div class="toolbar-mock">
          {#if !isDelayedInitStarted}
            <button class="btn primary" on:click={startDelayedInit}
              >Start 3s Delay Init</button
            >
          {:else if countdown > 0}
            <button class="btn outline" disabled
              >Initializing in {countdown}s...</button
            >
          {:else}
            <button class="btn success" disabled>Editor Initialized!</button>
          {/if}
        </div>
        <div class="delayed-box">
          <FroalaEditor
            bind:this={delayedEditor}
            manual={true}
            model="<p>This editor appeared after a 3-second delay.</p>"
          />
        </div>
      </div>
    </section>
  </main>

  <footer class="main-footer">
    <p>Powered by <strong>Froala Editor</strong> & <strong>Svelte</strong></p>
  </footer>
</div>

<style>
  :global(body) {
    font-family:
      "Inter",
      -apple-system,
      system-ui,
      sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    color: #1e293b;
  }

  .page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    color: white;
    text-align: center;
    padding: 60px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .main-header h1 {
    margin: 0;
    font-size: 2.5rem;
    letter-spacing: -1px;
  }
  .subtitle {
    margin: 10px 0 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  .content-container {
    max-width: 1100px;
    margin: -40px auto 40px;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .demo-section {
    margin-bottom: 60px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .section-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #334155;
  }
  .section-desc {
    color: #64748b;
    margin-bottom: 25px;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .live-preview {
    margin-top: 24px;
    padding: 20px;
    background: #f1f5f9;
    border-radius: 8px;
    border-left: 4px solid #1e88e5;
  }

  .preview-content {
    background: white;
    padding: 15px;
    border-radius: 4px;
    min-height: 50px;
  }

  .editor-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 25px;
  }

  .tag-card h3 {
    margin-top: 0;
    font-size: 1rem;
    color: #475569;
  }
  .tag-preview {
    padding: 20px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 120px;
  }

  .json-code {
    background: #1e293b;
    color: #38bdf8;
    padding: 15px;
    border-radius: 6px;
    font-size: 0.85rem;
    margin-top: 15px;
    overflow-x: auto;
  }

  .toolbar-mock {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* Buttons */
  .btn {
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .primary {
    background: #1e88e5;
    color: white;
  }
  .primary:hover {
    background: #1565c0;
  }
  .success {
    background: #10b981;
    color: white;
  }
  .danger {
    background: #ef4444;
    color: white;
  }
  .outline {
    background: white;
    border: 1px solid #cbd5e1;
    color: #475569;
  }
  .outline:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Badges */
  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    background: #e2e8f0;
    color: #475569;
  }

  .badge.secondary {
    background: #e0f2fe;
    color: #0369a1;
  }
  .badge.info {
    background: #fef9c3;
    color: #854d0e;
  }
  .badge.warning {
    background: #ffedd5;
    color: #9a3412;
  }
  .badge.dark {
    background: #334155;
    color: white;
  }

  .main-footer {
    margin-top: auto;
    padding: 40px;
    text-align: center;
    background: white;
    border-top: 1px solid #e2e8f0;
    color: #64748b;
  }

  :global(.demo-custom-btn) {
    padding: 12px 24px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .editor-grid,
    .tag-grid {
      grid-template-columns: 1fr;
    }
    .main-header h1 {
      font-size: 1.8rem;
    }
  }
</style>
