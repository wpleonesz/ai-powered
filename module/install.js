/* eslint-disable @next/next/no-assign-module-variable */
import audit from '@module/installers/audit.install';
import inventory from '@module/installers/inventory.install';

const install = async (module) => {
  if (module.code === 'audit') await audit(module.id);
  if (module.code === 'inventory') await inventory(module.id);
};

const module = { install };

export default module;
