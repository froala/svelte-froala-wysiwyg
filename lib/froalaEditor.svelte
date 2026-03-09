<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import FroalaEditor from "froala-editor";
  import "froala-editor/css/froala_editor.pkgd.min.css";
  import "froala-editor/js/plugins.pkgd.min.js";

  /*
  Public props
  These behave similar to the React wrapper API
*/
  export let model = ""; // Editor content
  export let config = {}; // Froala configuration object
  export let tag = "div"; // HTML element on which editor is initialized
  export let editor = null; // Expose editor instance to parent
  export let manual = false; // If true editor must be initialized manually

  let el; // DOM element reference
  let instance = null; // Froala editor instance
  let oldModel = null; // Used to detect external model changes
  let initialized = false; // Track editor initialization

  const dispatch = createEventDispatcher();

  /*
  Froala supports initializing editor on special elements
  like img, button, input and a.
*/
  const SPECIAL_TAGS = ["img", "button", "input", "a"];
  const INNER_HTML_ATTR = "innerHTML";

  let hasSpecialTag = false;

  /* Utility: check if value is plain object */
  function isObject(val) {
    return val !== null && typeof val === "object" && !Array.isArray(val);
  }

  /*
  Detect if the current DOM element is a special tag.
  Froala behaves differently for those.
*/
  function detectTag() {
    const tagName = el.tagName.toLowerCase();
    if (SPECIAL_TAGS.indexOf(tagName) !== -1) {
      tag = tagName;
      hasSpecialTag = true;
    }
  }

  /*
  Create Froala editor instance
  Merges user config with wrapper events.
*/
  function createEditor() {
    if (instance) return;

    detectTag();

    const userEvents = config?.events || {};

    const finalConfig = {
      ...config,
      events: {
        ...userEvents,

        /*
        Froala initialized callback.
        Here we expose instance and sync initial model.
      */
        initialized() {
          editor = this;
          instance = this;
          initialized = true;

          dispatch("editor", this);
          dispatch("initialized", this);

          if (model !== undefined) {
            setContent(true);
          }

          initListeners();

          // Call user's initialized event if provided
          if (userEvents.initialized) {
            userEvents.initialized.call(this);
          }
        },
      },
    };

    instance = new FroalaEditor(el, finalConfig);
  }

  /*
  Push external model value into editor
*/
  function setContent(firstTime = false) {
    if (!instance) return;

    oldModel = isObject(model) ? JSON.stringify(model) : model;

    if (hasSpecialTag) {
      setSpecialTagContent();
    } else {
      setNormalContent(firstTime);
    }
  }

  /*
  Set HTML content in standard Froala editor
*/
  function setNormalContent(firstTime) {
    function htmlSet() {
      if (
        !instance ||
        !instance.html ||
        typeof instance.html.set !== "function"
      ) {
        return;
      }

      instance.html.set(model || "");

      /*
      Save undo step so external model updates
      behave like user edits
    */
      if (initialized && instance.undo) {
        instance.undo.saveStep();
      }
    }

    htmlSet();
  }

  /*
  Apply model attributes for special elements
  like img, button, input etc.
*/
  function setSpecialTagContent() {
    const tags = model;

    if (!isObject(tags)) return;

    for (let attr in tags) {
      if (attr !== INNER_HTML_ATTR) {
        el.setAttribute(attr, tags[attr]);
      }
    }

    if (tags[INNER_HTML_ATTR]) {
      el.innerHTML = tags[INNER_HTML_ATTR];
    }
  }

  /*
  Extract editor content and update model
*/
  function updateModel() {
    if (!instance) return;

    let modelContent = "";

    if (hasSpecialTag) {
      let attrs = {};
      let attributeNodes = el.attributes;

      // Collect attributes from element
      for (let i = 0; i < attributeNodes.length; i++) {
        const attrName = attributeNodes[i].name;
        attrs[attrName] = attributeNodes[i].value;
      }

      if (el.innerHTML) {
        attrs[INNER_HTML_ATTR] = el.innerHTML;
      }

      modelContent = attrs;
    } else {
      const returnedHtml = instance.html.get();

      if (typeof returnedHtml === "string") {
        modelContent = returnedHtml;
      }
    }

    oldModel = isObject(modelContent)
      ? JSON.stringify(modelContent)
      : modelContent;

    model = modelContent;

    // Emit event so parent can react
    dispatch("modelChange", modelContent);
  }

  /*
  Register Froala internal listeners
*/
  function initListeners() {
    if (!instance?.events) return;

    // Fired when content changes
    instance.events.on("contentChanged", () => {
      updateModel();
    });
  }

  /*
  Watch for external model updates
  and push them into Froala
*/
  $: if (
    initialized &&
    instance &&
    instance.html &&
    JSON.stringify(oldModel) !== JSON.stringify(model)
  ) {
    setContent();
  }

  /* Lifecycle */

  onMount(() => {
    // Auto initialize editor unless manual mode is enabled
    if (!manual) {
      createEditor();
    }
  });

  onDestroy(() => {
    // Destroy editor when component unmounts
    if (instance) {
      instance.destroy();
      instance = null;
      initialized = false;
    }
  });

  /* Manual controller API */

  /*
  Allows parent to initialize editor manually
*/
  export function initializeEditor() {
    createEditor();
  }

  /*
  Destroy editor manually
*/
  export function destroy() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }

  /*
  Retrieve editor instance
*/
  export function getEditor() {
    return instance;
  }
</script>

<!--
  Dynamic element (div, textarea, img, button etc.)
  where Froala will attach
-->
<svelte:element this={tag} bind:this={el}></svelte:element>
