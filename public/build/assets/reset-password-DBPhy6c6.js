import { a as me, j as jsxRuntimeExports, L as Le } from "./app-CmD9YlXK.js";
import { L as Label, I as InputError } from "./label-BaKnXBZy.js";
import { B as Button } from "./app-logo-icon-D1rsR2lR.js";
import { I as Input } from "./index-D8KFBCLZ.js";
import { A as AuthLayout } from "./auth-layout-CMt7mWsb.js";
import { L as LoaderCircle } from "./loader-circle-DEGmnoqt.js";
function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = me({
    token,
    email,
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthLayout, { title: "Reset password", description: "Please enter your new password below", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Reset password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            type: "email",
            name: "email",
            autoComplete: "email",
            value: data.email,
            className: "mt-1 block w-full",
            readOnly: true,
            onChange: (e) => setData("email", e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "password",
            type: "password",
            name: "password",
            autoComplete: "new-password",
            value: data.password,
            className: "mt-1 block w-full",
            autoFocus: true,
            onChange: (e) => setData("password", e.target.value),
            placeholder: "Password"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password_confirmation", children: "Confirm password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "password_confirmation",
            type: "password",
            name: "password_confirmation",
            autoComplete: "new-password",
            value: data.password_confirmation,
            className: "mt-1 block w-full",
            onChange: (e) => setData("password_confirmation", e.target.value),
            placeholder: "Confirm password"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "mt-4 w-full", disabled: processing, children: [
        processing && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Reset password"
      ] })
    ] }) })
  ] });
}
export {
  ResetPassword as default
};
//# sourceMappingURL=reset-password-DBPhy6c6.js.map
