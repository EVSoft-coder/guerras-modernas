import { r as reactExports, m as me, j as jsxRuntimeExports, K, L as Le, $ as $e } from "./app-Dum54gXN.js";
import { L as Label, I as InputError } from "./label-D8kYuhbK.js";
import { B as Button } from "./app-logo-icon-seZqlBeI.js";
import { I as Input } from "./index-BeOXWa8o.js";
import { H as HeadingSmall, S as SettingsLayout } from "./layout-CLjxD9GQ.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, d as DialogTitle, b as DialogDescription, e as DialogFooter, g as DialogClose } from "./dialog-DOPSkggd.js";
import { A as AppLayout } from "./app-layout-LnJIwgdZ.js";
import { z as ze } from "./transition-AlxkxsAT.js";
import "./index-BLl7KzLi.js";
function DeleteUser() {
  const passwordInput = reactExports.useRef(null);
  const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = me({ password: "" });
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        var _a;
        return (_a = passwordInput.current) == null ? void 0 : _a.focus();
      },
      onFinish: () => reset()
    });
  };
  const closeModal = () => {
    clearErrors();
    reset();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeadingSmall, { title: "Delete account", description: "Delete your account and all of its resources" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative space-y-0.5 text-red-600 dark:text-red-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Please proceed with caution, this cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", children: "Delete account" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Are you sure you want to delete your account?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-6", onSubmit: deleteUser, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "sr-only", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "password",
                  type: "password",
                  name: "password",
                  ref: passwordInput,
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  placeholder: "Password",
                  autoComplete: "current-password"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: closeModal, children: "Cancel" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", disabled: processing, asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", children: "Delete account" }) })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const breadcrumbs = [
  {
    title: "Profile settings",
    href: "/settings/profile"
  }
];
function Profile({ mustVerifyEmail, status }) {
  var _a, _b, _c, _d;
  const auth = ((_a = K().props) == null ? void 0 : _a.auth) ?? null;
  const { data, setData, patch, errors, processing, recentlySuccessful } = me({
    name: ((_b = auth == null ? void 0 : auth.user) == null ? void 0 : _b.name) ?? "",
    email: ((_c = auth == null ? void 0 : auth.user) == null ? void 0 : _c.email) ?? ""
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Profile settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsLayout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HeadingSmall, { title: "Profile information", description: "Update your name and email address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "name",
                className: "mt-1 block w-full",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                required: true,
                autoComplete: "name",
                placeholder: "Full name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { className: "mt-2", message: errors.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "email",
                type: "email",
                className: "mt-1 block w-full",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                required: true,
                autoComplete: "username",
                placeholder: "Email address"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { className: "mt-2", message: errors.email })
          ] }),
          mustVerifyEmail && ((_d = auth == null ? void 0 : auth.user) == null ? void 0 : _d.email_verified_at) === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-neutral-800", children: [
              "Your email address is unverified.",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                $e,
                {
                  href: route("verification.send"),
                  method: "post",
                  as: "button",
                  className: "rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
                  children: "Click here to re-send the verification email."
                }
              )
            ] }),
            status === "verification-link-sent" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm font-medium text-green-600", children: "A new verification link has been sent to your email address." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: processing, children: "Save" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ze,
              {
                show: recentlySuccessful,
                enter: "transition ease-in-out",
                enterFrom: "opacity-0",
                leave: "transition ease-in-out",
                leaveTo: "opacity-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-neutral-600", children: "Saved" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteUser, {})
    ] })
  ] });
}
export {
  Profile as default
};
//# sourceMappingURL=profile-b1mKIeU1.js.map
