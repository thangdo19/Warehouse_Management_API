const { User } = require('../models/User')
const { Permission } = require('../models/Permission')
const { PermissionDetail } = require('../models/PermissionDetail')
const { UserPermission } = require('../models/UserPermission')
const { Warehouse } = require('../models/Warehouse')
const { UserWarehouse } = require('../models/UserWarehouse')
const { Product } = require('../models/Product')
const { WarehouseProduct } = require('../models/WarehouseProduct')
const { City } = require('../models/City')
const { Category } = require('../models/Category')

module.exports = function() {
  // create relationship
  // Permission - PermissionDetail (1:N)
  Permission.hasMany(PermissionDetail, {
    as: 'permissionDetails',
    foreignKey: 'permissionId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  PermissionDetail.belongsTo(Permission, {
    as: 'permission',
    foreignKey: 'permissionId'
  })
  // User - Permission (M:N)
  User.belongsToMany(Permission, {
    through: UserPermission,
    as: 'permissions',
    foreignKey: 'userId',
    otherKey: 'permissionId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Permission.belongsToMany(User, {
    through: UserPermission,
    as: 'users',
    foreignKey: 'permissionId',
    otherKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  // User - Warehouse (M:N)
  User.belongsToMany(Warehouse, {
    through: UserWarehouse,
    as: "warehouses",
    foreignKey: "userId",
    otherKey: "warehouseId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  })
  Warehouse.belongsToMany(User, {
    through: UserWarehouse,
    as: "users",
    foreignKey: "warehouseId",
    otherKey: "userId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL" 
  })
  // Warehouse - Product (M:N)
  Warehouse.belongsToMany(Product, {
    through: WarehouseProduct,
    as: "products",
    foreignKey: "warehouseId",
    otherKey: "productId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL" 
  })
  Product.belongsToMany(Warehouse, {
    through: WarehouseProduct,
    as: "warehouses",
    foreignKey: "productId",
    otherKey: "warehouseId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  })
  // City - Warehouse (1:N)
  City.hasMany(Warehouse, {
    as: 'warehouses',
    foreignKey: 'cityId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Warehouse.belongsTo(City, {
    as: 'city',
    foreignKey: 'cityId'
  })
  // City - Warehouse (1:N)
  Category.hasMany(Product, {
    as: 'products',
    foreignKey: 'categoryId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Product.belongsTo(Category, {
    as: 'category',
    foreignKey: 'categoryId'
  })
}