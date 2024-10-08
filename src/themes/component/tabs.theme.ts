export default {
  baseStyle: {},
  variants: {
    userDetails: {
      root: {
        maxHeight: "inherit",
      },
      tab: {
        _selected: {
          borderBottom: "1px solid",
          borderColor: "brand.500",
          mb: "-2px",
        },
      },
      tablist: {
        borderBottom: "1px solid",
        borderColor: "#e1dede",
        justifyContent: "center",
      },
      tabpanels: {
        padding: 0,
      },
      tabpanel: {
        p: 0,
        paddingTop: 4,
      },
    },
  },
  sizes: {},
};
