const DEFAULT = {
  id: true,
  name: true,
  institutionId: true,
  active: true,
  code_ext_mrt: true,
  Institution: {
    select: {
      name: true,
    },
  },
};

const schemas = { DEFAULT };

export default schemas;
