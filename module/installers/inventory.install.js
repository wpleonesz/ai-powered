import ModuleData from '@database/base/module';
import RoleData from '@database/base/role';
import { upsert } from '@module/tools/upsert';

const entities = async () => {
  const moduleData = new ModuleData();
  const inventoryModule = await moduleData
    .where({ code: 'inventory' })
    .getUnique();
  const data = [
    {
      code: 'inventory',
      name: 'Inventario',
      moduleId: inventoryModule.id,
    },
  ];
  return await upsert.entities(data);
};

const pages = async (moduleId) => {
  const data = [
    {
      code: 'inventory',
      name: 'Inventario',
      url: '/inventory',
      moduleId: moduleId,
    },
    {
      code: 'configInventory',
      name: 'Configuración de Inventario',
      url: '/inventory/config',
      moduleId: moduleId,
    },
    {
      code: 'inventoryItem',
      name: 'Item de Inventario',
      url: '/inventory/config/item',
      moduleId: moduleId,
    },
  ];
  return await upsert.pages(data);
};

const menus = async (moduleId, pages) => {
  let data = [
    {
      code: 'headerInventory',
      name: 'Inventario',
      moduleId: moduleId,
    },
  ];
  const header = await upsert.menus(data);
  //const menuData = new MenuData();
  data = [
    {
      code: 'inventory',
      name: 'Item de Inventario',
      icon: 'inventory',
      header: false,
      priority: 5,
      pageId: pages.inventory.id,
      moduleId: moduleId,
      menuId: header.headerInventory.id,
    },
    {
      code: 'configInventory',
      name: 'Configuración',
      icon: 'settings',
      header: false,
      priority: 900,
      pageId: pages.configInventory.id,
      moduleId: moduleId,
      menuId: header.headerInventory.id,
    },
  ];

  const configInventory = await upsert.menus(data);

  data = [
    {
      code: 'inventoryItem',
      name: 'Item de Inventario',
      icon: 'inventory',
      header: false,
      priority: 5,
      pageId: pages.inventoryItem.id,
      moduleId: moduleId,
      menuId: configInventory.configInventory.id,
    },
  ];
  const _menus = await upsert.menus(data);
  return { _menus, configInventory, header };
};

const roles = async (moduleId) => {
  const data = [
    {
      code: 'inventoryViewer',
      name: 'Gestor de inventario',
      description: 'Visualizar y gestionar registros de inventario',
      moduleId: moduleId,
    },
  ];
  return await upsert.roles(data);
};

const parseRoleMenu = (roleId, menuId) => {
  return { where: { roleId_menuId: { roleId, menuId } }, roleId, menuId };
};

const rolesOnMenus = async (_roles, _menus) => {
  const roleData = new RoleData();
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();
  const data = [
    parseRoleMenu(_roles.inventoryViewer.id, _menus.inventory.id),
    parseRoleMenu(administratorRole.id, _menus.inventory.id),
  ];
  await upsert.rolesOnMenus(data);
};

const installer = async (moduleId) => {
  const _entities = await entities();
  const _pages = await pages(moduleId);
  const _menus = await menus(moduleId, _pages);
  const _roles = await roles(moduleId);
  await access(_roles, _entities);
  await rolesOnMenus(_roles, _menus);
};

export default installer;
