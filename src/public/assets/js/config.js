"use strict";
let config = {
    s: {
      primary: "#138C01",
      secondary: "#8592a3",
      success: "#71dd37",
      info: "#03c3ec",
      warning: "#ffab00",
      danger: "#ff3e1d",
      dark: "#233446",
      black: "#000",
      white: "#fff",
      body: "#f4f5fb",
      heading: "#566a7f",
      axis: "#a1acb8",
      border: "#eceef1",
    },
    s_label: {
      primary: "#666ee81a",
      secondary: "#8897aa1a",
      success: "#28d0941a",
      info: "#1e9ff21a",
      warning: "#ff91491a",
      danger: "#ff49611a",
      dark: "#181c211a",
    },
    s_dark: {
      card: "#2b2c40",
      heading: "#cbcbe2",
      axis: "#7071a4",
      border: "#444564",
    },
    enableMenuLocalStorage: !0,
  },
  assetsPath = document.documentElement.getAttribute("data-assets-path"),
  templateName = document.documentElement.getAttribute("data-template"),
  rtlSupport = !0;
"undefined" != typeof TemplateCustomizer &&
  (window.templateCustomizer = new TemplateCustomizer({
    cssPath: assetsPath + "vendor/css" + (rtlSupport ? "/rtl" : "") + "/",
    themesPath: assetsPath + "vendor/css" + (rtlSupport ? "/rtl" : "") + "/",
    displayCustomizer: !0,
    defaultShowDropdownOnHover: !0,
  }));
