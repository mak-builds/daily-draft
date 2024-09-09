const enumsToValue = [
  { eighteen_to_thirty: "18-30" },
  { thirty_one_to_fourty_five: "30-45" },
  { fourty_six_to_sixty: "46-60" },
  { sixty_plus: "60+" },
];

type EnumLookup = {
  [key: string]: string;
};
const lookup: EnumLookup = enumsToValue.reduce((acc, enumObj) => {
  return { ...acc, ...enumObj };
}, {});

export const ParseEnum = (input: string) => {
  return lookup[input] || input;
};

// const valueToEnums = [
//   { "18-30": "eighteen_to_thirty" },
//   { "30-45": "thirty_one_to_fourty_five" },
//   { "46-60": "fourty_six_to_sixty" },
//   { "60+": "sixty_plus" },
// ];
