import { mount } from "svelte";
import FroalaEditor from "./froalaEditor.svelte";

// Named export → for npm users
export { FroalaEditor };

// Default export → for npm users who import default
export default FroalaEditor;

// CDN helper
export function createEditor(target, props) {
  return mount(FroalaEditor, { target, props });
}