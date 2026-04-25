import { j as jsxRuntimeExports, r as reactExports } from "./app-DdRauoZk.js";
import { c as cn, a as cva } from "./app-logo-icon-CVLnt-Ci.js";
import { P as Primitive } from "./index-CeIbEZGH.js";
function InputError({ message, className = "", ...props }) {
  return message ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { ...props, className: cn("text-sm text-red-600 dark:text-red-400", className), children: message }) : null;
}
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
export {
  InputError as I,
  Label as L
};
//# sourceMappingURL=label-CwuVpc8O.js.map
