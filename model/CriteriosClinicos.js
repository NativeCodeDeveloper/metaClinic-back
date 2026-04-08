import DataBase from "../config/Database.js";

export default class CriteriosClinicos{
    constructor(){
    }

    async crearCriterio(
        nombre,
        descripcion,
        valor_tipo,
        excluye_glp1,
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `INSERT INTO criterios_clinicos(
            nombre,
            descripcion,
            valor_tipo,
            excluye_glp1
            ) VALUES (?,?,?,?)
            `;

            const params = [
                nombre,
                descripcion,
                valor_tipo,
                excluye_glp1,
          ];

            const respuestaQuery = await conexion.ejecutarQuery(query,params);
                return respuestaQuery;


        }catch(err){
            throw err;
        }

    }




    async obtenerTodosActivos(){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            SELECT * FROM criterios_clinicos WHERE estado <> 0
            `;
            const respuestaQuery = await conexion.ejecutarQuery(query);
            return respuestaQuery;
        }catch(err){
            console.error(err);
            throw err;
        }

    }





    async obtenerPorId(
        id_criterio
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            SELECT * FROM criterios_clinicos WHERE id_criterio = ?`;
            const params = [id_criterio]

            const respuestaQuery = await conexion.ejecutarQuery(query,params);
            if(respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw err;
        }
    }





    async actualizarCriterio(
        nombre,
        descripcion,
        valor_tipo,
        excluye_glp1,
        fecha_creacion,
        id_criterio
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            UPDATE criterios_clinicos SET
                    nombre = ?,
                    descripcion= ?,
                    valor_tipo= ?,
            excluye_glp1= ?,
        fecha_creacion = ?
        
        WHERE id_criterio = ?
            `;
            const params = [nombre, descripcion, valor_tipo, excluye_glp1, fecha_creacion, id_criterio];


            const respuestaQuery = await conexion.ejecutarQuery(query,params);
            if(respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw err;
        }
    }




    async eliminarCriterio(
        id_criterio
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            UPDATE criterios_clinicos SET
             estado = 0 
        WHERE id_criterio = ?
            `;
            const params = [id_criterio]

            const respuestaQuery = await conexion.ejecutarQuery(query,params);
            if(respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw err;
        }
    }





    async obtenerExcluyentesGLP1(
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `
SELECT * FROM criterios_clinicos WHERE excluye_glp1 = 1 AND estado = 1
            `;
            const respuestaQuery = await conexion.ejecutarQuery(query);
            if(respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw err;
        }
    }



    /*
NOMBRE DE LA TABLA: criterios_clinicos

* */
    async obtenercriterios_valor_tipo(
        valor_tipo
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `
           SELECT * FROM criterios_clinicos 
           WHERE valor_tipo = ? AND estado <> 0`;
            const params = [valor_tipo]
            const respuestaQuery = await conexion.ejecutarQuery(query,params);
            if(respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw err;
        }
    }

}