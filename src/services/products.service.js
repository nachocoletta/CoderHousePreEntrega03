// import ProductDao from "../dao/product.dao.js";

import { persistence } from "../dao/factory.js";

export default class ProductsService {

    static findAll(filter = {}, options) {
        return persistence.ProductDao.get(filter, options)
        // return ProductDao.get(filter, options)
    }

    static async create(payload) {
        console.log('creando producto');
        // console.log("payload en service", payload);
        const product = await persistence.ProductDao.create(payload)
        // const product = await ProductDao.create(payload);

        console.log(`Producto creado correctamente (${product._id})`)
        return product;
    }

    static findById(pid) {
        return persistence.ProductDao.getById(pid)
    }

    static updateById(pid, payload) {
        return persistence.ProductDao.updateById(pid, payload)
    }

    static deleteById(pid) {
        return ProductDao.deleteById(pid)
    }
}