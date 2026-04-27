import { m as me, j as jsxRuntimeExports, L as Le } from "./app-SO311K6Z.js";
import { L as Label, I as InputError } from "./label-DoDrP5ps.js";
import { B as Button } from "./app-logo-icon-3Xs4UngZ.js";
import { I as Input } from "./index-CQTYb8nv.js";
import { A as AuthLayout } from "./auth-layout-BE8QMBvc.js";
import { L as LoaderCircle } from "./loader-circle-CkZeVH9t.js";
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = me({
    password: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AuthLayout,
    {
      title: "Confirm your password",
      description: "This is a secure area of the application. Please confirm your password before continuing.",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Confirm password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "password",
                type: "password",
                name: "password",
                placeholder: "Password",
                autoComplete: "current-password",
                value: data.password,
                autoFocus: true,
                onChange: (e) => setData("password", e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", disabled: processing, children: [
            processing && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Confirm password"
          ] }) })
        ] }) })
      ]
    }
  );
}
export {
  ConfirmPassword as default
};
//# sourceMappingURL=ConfirmPassword-Brd9801c.js.map
