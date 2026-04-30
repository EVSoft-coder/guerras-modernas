import { m as me, j as jsxRuntimeExports, L as Le } from "./app-DpVMLtDv.js";
import { L as Label, I as InputError } from "./label-BkaQjUVv.js";
import { T as TextLink } from "./text-link-DCH9w7UU.js";
import { B as Button } from "./app-logo-icon-CPUcFckN.js";
import { I as Input } from "./index-tTnglD3x.js";
import { A as AuthLayout } from "./auth-layout-B8x5vqL8.js";
import { L as LoaderCircle } from "./loader-circle-Db3-5Xds.js";
function Register() {
  const { data, setData, post, processing, errors, reset } = me({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthLayout, { title: "Create an account", description: "Enter your details below to create your account", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Register" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "flex flex-col gap-6", onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              type: "text",
              required: true,
              autoFocus: true,
              tabIndex: 1,
              autoComplete: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              disabled: processing,
              placeholder: "Full name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              required: true,
              tabIndex: 2,
              autoComplete: "email",
              value: data.email,
              onChange: (e) => setData("email", e.target.value),
              disabled: processing,
              placeholder: "email@example.com"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              tabIndex: 3,
              autoComplete: "new-password",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              disabled: processing,
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
              required: true,
              tabIndex: 4,
              autoComplete: "new-password",
              value: data.password_confirmation,
              onChange: (e) => setData("password_confirmation", e.target.value),
              disabled: processing,
              placeholder: "Confirm password"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "mt-2 w-full", tabIndex: 5, disabled: processing, children: [
          processing && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Create account"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-center text-sm", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextLink, { href: route("login"), tabIndex: 6, children: "Log in" })
      ] })
    ] })
  ] });
}
export {
  Register as default
};
//# sourceMappingURL=Register-F7GFm-ad.js.map
