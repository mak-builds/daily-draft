export default {
  baseStyle: {},
  variants: {
    users: {
      table: {
        height: "fit-content",
        padding: "1rem",
        position: "relative",
      },
      thead: {
        zIndex: "tableStickyHeaders",
        position: "sticky",
        top: 0,
        backgroundColor: "white.900",
      },
      tbody: {
        tr: {
          _hover: {
            bgColor: " #f4f7fe",
          },
        },
      },
      th: {
        fontFamily: "inherit",
        color: "gray.500",
        fontWeight: "bold",
        borderBottom: "1px solid",
        borderColor: "gray.200",
        fontSize: "xs",
        minWidth: "150px",
        maxWidth: "200px",
      },
      td: {
        fontSize: "md",
        color: "gray.900",
        maxWidth: "250px",
        whiteSpace: "nowrap",
        overflowX: "hidden",
        textOverflow: "ellipsis",
      },
      tr: {
        borderBottom: "1px solid",
        borderColor: "gray.200",
      },
    },
  },
  sizes: {},
};
