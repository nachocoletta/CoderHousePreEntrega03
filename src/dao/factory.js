import config from "../config.js";


export let persistence = {};

switch (config.persistence) {
    case 'mongodb':
        persistence.ProductDao = (await import('./product.dao.js')).default // lleva await porque devuelve una promesa el import y default va porque se exporta de tal forma
        break;
    case 'file':
        persistence.ProductDao = (await import('./product.dao.file.js')).default // este archivo no existe es para ver que funciona
        break;

    default:
        break;
}