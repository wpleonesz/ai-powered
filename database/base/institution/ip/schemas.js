const DEFAULT = {
  id: true,
  name: true,
  ip: true,
  institutionId: true,
  campusId: true,
  latitude: true,
  longitude: true,
  active: true,
  Institution: {
    select: {
      name: true,
    },
  },
};

const schemas = { DEFAULT };

export default schemas;
