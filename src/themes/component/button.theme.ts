export default {
  baseStyle: {
    borderRadius: "sm",
    boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
    transition: ".25s all ease",
    boxSizing: "border-box",
    _focus: {
      boxShadow: "none",
    },
    _active: {
      boxShadow: "none",
    },
  },
  variants: {
    default_color: {
      borderRadius: "sm",
      boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
      transition: ".25s all ease",
      boxSizing: "border-box",
      bgColor: "brand.200",
      color: "white.900",
      _focus: {
        boxShadow: "none",
      },
      _active: {
        boxShadow: "none",
      },
      _hover: {
        background: "brand.200",
      },
    },
    default: {
      borderRadius: "sm",
      boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
      transition: ".25s all ease",
      boxSizing: "border-box",
      bgColor: "gray.400",
      color: "black.900",
      _focus: {
        boxShadow: "none",
      },
      _active: {
        boxShadow: "none",
      },
      _hover: {
        background: "gray.400",
      },
    },
    brand: {
      bg: "brand.200",
      color: "white",
      height: "50",
      fontWeight: "500",
      fontSize: "sm",
      width: "180px",
      _hover: {
        _disabled: {
          bg: "brand.200",
        },
      },
    },
    clear_button: {
      width: "fit-content",
      height: "fit-content",
      backgroundColor: "transparent",
      color: "#8C88A9",
      borderRadius: "6px",
      fontWeight: "400",
      padding: ".5rem 1.2rem",
      _hover: {},
    },
    save_button: {
      width: "fit-content",
      height: "fit-content",
      backgroundColor: "#702F6F",
      color: "white",
      borderRadius: "6px",
      fontWeight: "400",
      padding: ".5rem 1.2rem",
      _hover: {
        _disabled: {
          bg: "brand.200",
        },
      },
    },
    create_button: {
      width: "fit-content",
      height: "fit-content",
      backgroundColor: "#702F6F",
      color: "white",
      borderRadius: "6px",
      fontWeight: "400",
      padding: ".7rem 2rem",
      _hover: {},
    },
    prev_next_button: {
      position: "absolute",
      top: "50%",
      bgColor: "brand.200",
      color: "white.900",
      border: "none",
      padding: "10px",
      cursor: "pointer",
      zIndex: "1",
    },
  },
  sizes: {},
};
