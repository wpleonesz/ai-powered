import ModuleData from '@database/base/module';
import RoleData from '@database/base/role';
import { upsert } from '@module/tools/upsert';
import { capitalize } from 'lodash';

const entities = async () => {
  const moduleData = new ModuleData();
  const inventoryModule = await moduleData
    .where({ code: 'inventory' })
    .getUnique();

  const data = [
    // Core
    { code: 'product', name: 'Productos', moduleId: inventoryModule.id },
    { code: 'movement', name: 'Movimientos', moduleId: inventoryModule.id },
    { code: 'warehouse', name: 'Bodegas', moduleId: inventoryModule.id },
    { code: 'report', name: 'Reportes', moduleId: inventoryModule.id },

    // Configuración
    {
      code: 'productCategory',
      name: 'Categorías de Productos',
      moduleId: inventoryModule.id,
    },
    { code: 'brand', name: 'Marcas', moduleId: inventoryModule.id },
    { code: 'provider', name: 'Proveedores', moduleId: inventoryModule.id },
    {
      code: 'warehouseConfig',
      name: 'Gestión de Bodegas (Config)',
      moduleId: inventoryModule.id,
    },
  ];

  return await upsert.entities(data);
};

const pages = async (moduleId) => {
  const data = [
    // Menú principal
    {
      code: 'products',
      name: 'Productos',
      url: '/inventory/products',
      moduleId,
    },
    {
      code: 'movements',
      name: 'Movimientos',
      url: '/inventory/movements',
      moduleId,
    },
    {
      code: 'warehouses',
      name: 'Bodegas',
      url: '/inventory/warehouses',
      moduleId,
    },
    { code: 'reports', name: 'Reportes', url: '/inventory/reports', moduleId },

    // Configuración
    {
      code: 'inventoryConfig',
      name: 'Configuración de Inventario',
      url: '/inventory/config',
      moduleId,
    },
    {
      code: 'productCategory',
      name: 'Categorías de Productos',
      url: '/inventory/config/categories',
      moduleId,
    },
    {
      code: 'brandsProviders',
      name: 'Marcas/Proveedores',
      url: '/inventory/config/brands-providers',
      moduleId,
    },
    {
      code: 'warehouseConfig',
      name: 'Gestión de Bodegas',
      url: '/inventory/config/warehouses',
      moduleId,
    },
  ];

  return await upsert.pages(data);
};

const menus = async (moduleId, pages) => {
  // Header
  let data = [
    {
      code: 'inventoryhead',
      name: 'Inventario',
      icon: null,
      header: true,
      priority: 5,
      moduleId,
    },
  ];
  const header = await upsert.menus(data);

  // Ítems principales
  data = [
    {
      code: 'products',
      name: 'Productos',
      icon: 'inventory_2',
      priority: 10,
      pageId: pages.products.id,
      moduleId,
      menuId: header.inventoryhead.id,
    },
    {
      code: 'movements',
      name: 'Movimientos',
      icon: 'swap_horiz',
      priority: 20,
      pageId: pages.movements.id,
      moduleId,
      menuId: header.inventoryhead.id,
    },
    {
      code: 'warehouses',
      name: 'Bodegas',
      icon: 'warehouse',
      priority: 30,
      pageId: pages.warehouses.id,
      moduleId,
      menuId: header.inventoryhead.id,
    },
    {
      code: 'reports',
      name: 'Reportes',
      icon: 'bar_chart',
      priority: 40,
      pageId: pages.reports.id,
      moduleId,
      menuId: header.inventoryhead.id,
    },
    {
      code: 'inventoryConfig',
      name: 'Configuración de Inventario',
      displayName: 'Configuración',
      icon: 'settings',
      priority: 900,
      pageId: pages.inventoryConfig.id,
      dashboard: true,
      moduleId,
      menuId: header.inventoryhead.id,
    },
  ];
  const mainMenus = await upsert.menus(data);

  // Submenús dentro de Configuración
  data = [
    {
      code: 'productCategory',
      name: 'Categorías de Productos',
      description: 'Administración de categorías',
      icon: 'category',
      header: false,
      priority: 10,
      pageId: pages.productCategory.id,
      moduleId,
      menuId: mainMenus.inventoryConfig.id,
    },
    {
      code: 'brandsProviders',
      name: 'Marcas/Proveedores',
      description: 'Gestión de marcas y proveedores',
      icon: 'badge', // alternativa: 'handshake' o 'storefront'
      header: false,
      priority: 20,
      pageId: pages.brandsProviders.id,
      moduleId,
      menuId: mainMenus.inventoryConfig.id,
    },
    {
      code: 'warehouseConfig',
      name: 'Gestión de Bodegas',
      description: 'Parámetros y ubicaciones de bodegas',
      icon: 'warehouse',
      header: false,
      priority: 30,
      pageId: pages.warehouseConfig.id,
      moduleId,
      menuId: mainMenus.inventoryConfig.id,
    },
  ];
  const configSubmenus = await upsert.menus(data);

  return { ...header, ...mainMenus, ...configSubmenus };
};

const roles = async (moduleId) => {
  const data = [
    {
      code: 'manager',
      name: 'Gestor',
      description: 'Gestor de inventario con permisos completos',
      moduleId,
    },
    {
      code: 'operator',
      name: 'Operador',
      description: 'Operador de inventario con permisos operativos',
      moduleId,
    },
  ];
  return await upsert.roles(data);
};

const parseRoleMenu = (roleId, menuId) => {
  return { where: { roleId_menuId: { roleId, menuId } }, roleId, menuId };
};

const roleOnMenus = async (_roles, _menus) => {
  const roleData = new RoleData();
  const data = [];

  // Administrador: acceso a todos los menús
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();
  Object.entries(_menus).forEach(([_, menu]) => {
    data.push(parseRoleMenu(administratorRole.id, menu.id));
  });

  // Gestor: acceso a todos los menús de Inventario
  const managerRole = await roleData
    .where({ code: 'manager' })
    .getUnique()
    .catch(() => null);
  if (managerRole) {
    Object.entries(_menus).forEach(([_, menu]) => {
      data.push(parseRoleMenu(managerRole.id, menu.id));
    });
  }

  // Operador: acceso a Productos, Movimientos y Bodegas (no configuración global ni reportes si no deseas)
  const operatorRole = await roleData
    .where({ code: 'operator' })
    .getUnique()
    .catch(() => null);
  if (operatorRole) {
    const allowedCodes = ['products', 'movements', 'warehouses'];
    Object.entries(_menus).forEach(([key, menu]) => {
      if (allowedCodes.includes(key))
        data.push(parseRoleMenu(operatorRole.id, menu.id));
    });
  }

  await upsert.rolesOnMenus(data);
};

const access = async (_roles, _entities) => {
  const roleData = new RoleData();
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();

  const data = [];
  // Administrador: full CRUD en todas las entidades del módulo
  Object.entries(_entities).forEach(([_, entity]) => {
    data.push({
      code: `adm${capitalize(entity.code)}`,
      entityId: entity.id,
      roleId: administratorRole.id,
      read: true,
      create: true,
      write: true,
      remove: true,
    });
  });

  // Gestor: full CRUD también
  const managerRole = await roleData
    .where({ code: 'manager' })
    .getUnique()
    .catch(() => null);
  if (managerRole) {
    Object.entries(_entities).forEach(([_, entity]) => {
      data.push({
        code: `mgr${capitalize(entity.code)}`,
        entityId: entity.id,
        roleId: managerRole.id,
        read: true,
        create: true,
        write: true,
        remove: true,
      });
    });
  }

  // Operador: lectura y escritura operativa en product, movement, warehouse
  const operatorRole = await roleData
    .where({ code: 'operator' })
    .getUnique()
    .catch(() => null);
  if (operatorRole) {
    const opEntities = ['product', 'movement', 'warehouse'];
    Object.entries(_entities).forEach(([_, entity]) => {
      const canOperate = opEntities.includes(entity.code);
      data.push({
        code: `opr${capitalize(entity.code)}`,
        entityId: entity.id,
        roleId: operatorRole.id,
        read: true,
        create: canOperate, // crear productos/movimientos/bodegas si así lo decides
        write: canOperate,
        remove: false,
      });
    });
  }

  await upsert.access(data);
};

const installer = async (moduleId) => {
  const _entities = await entities();
  const _pages = await pages(moduleId);
  const _menus = await menus(moduleId, _pages);
  const _roles = await roles(moduleId);
  await roleOnMenus(_roles, _menus);
  await access(_roles, _entities);
};

export default installer;
