import { m as me, j as jsxRuntimeExports, L as Le } from "./app-B7YTo-M6.js";
import { T as TextLink } from "./text-link-2AunWBAr.js";
import { B as Button } from "./app-logo-icon-Dm_FtrKc.js";
import { A as AuthLayout } from "./auth-layout-CBAkO1s7.js";
import { L as LoaderCircle } from "./loader-circle-9zr2ZuVE.js";
function VerifyEmail({ status }) {
  const { post, processing } = me({});
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthLayout, { title: "Verify email", description: "Please verify your email address by clicking on the link we just emailed to you.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Email verification" }),
    status === "verification-link-sent" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: "A new verification link has been sent to the email address you provided during registration." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: processing, variant: "secondary", children: [
        processing && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Resend verification email"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextLink, { href: route("logout"), method: "post", className: "mx-auto block text-sm", children: "Log out" })
    ] })
  ] });
}
export {
  VerifyEmail as default
};
//# sourceMappingURL=verify-email-CtHw7LFx.js.map
