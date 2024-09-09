export default {
  baseStyle: {},
  variants: {
    table: {
      button: {
        background: "none",
      },
      list: {
        minWidth: "10rem",
        borderRadius: "sm",
        boxShadow: "1px 1px 10px #dad7d7",
      },
    },
    header: {
      button: {
        color: "white.900",
        width: "40px",
        height: "40px",
        bgColor: "brand.200",
        borderRadius: "50%",
      },
      list: {
        marginTop: "10px",
        borderRadius: "md",
        boxShadow: "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
        // _hover: { bg: "none" },
        // _focus: { bg: "none" },
        zIndex: 10,
      },
    },
  },
  sizes: {},
};
