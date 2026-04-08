import DataBase from "../config/Database.js";

export default class EvaluacionCriterio{
    constructor(){
    }


    async guardarCriteriosEvaluacion(id_evaluacion_clinica, arrayCriterios){
        try{
            const conexion = DataBase.getInstance();

            const placeholders = arrayCriterios.map(() => '(?, ?, ?, NOW())').join(', ');
            const params = arrayCriterios.flatMap(c => [
                id_evaluacion_clinica,
                c.id_criterio,
                c.activo
            ]);

            const query = `
          INSERT INTO evaluacion_criterio
          (id_evaluacion_clinica, id_criterio, activo, fecha_creacion)
          VALUES ${placeholders}
          `;

            const respuestaQuery = await conexion.ejecutarQuery(query, params);
            return respuestaQuery;
        }catch(err){
            console.error(err);
            throw new Error(err);
        }
    }
    async obtenerCriteriosPorEvaluacion(id_evaluacion_clinica){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            SELECT
            evaluacion_criterio.*,
            criterios_clinicos.nombre AS nombreCriterioClinico,
            criterios_clinicos.descripcion AS descripcionCriterioClinico,
            criterios_clinicos.estado as estadoCriterioClinico
            
            FROM evaluacion_criterio
            
            INNER JOIN criterios_clinicos ON
            criterios_clinicos.id_criterio = evaluacion_criterio.id_criterio
            
            WHERE 
            id_evaluacion_clinica = ? 
  
            AND criterios_clinicos.estado <> 0

            
            `;
            const params = [id_evaluacion_clinica];

            const respuestaQuery = await conexion.ejecutarQuery(query,params);
            if(  respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw new Error(err);
        }
    }




    /*
        TABLA:
        evaluacion_criterio

        COLUMNAS:
        id_evaluacion_criterios,
        id_evaluacion_clinica,
        id_criterio,
        activo,
        fecha_creacion
        * */

    async actualizarSwitchEspecifico(activo,id_evaluacion_criterios){
        try{
            const conexion = DataBase.getInstance();
            const query = `
             UPDATE evaluacion_criterio
  SET activo = ?
  WHERE id_evaluacion_criterios = ?
            `;
            const params = [activo,id_evaluacion_criterios];

            const respuestaQuery = await conexion.ejecutarQuery(query,params);
            if(  respuestaQuery){
                return respuestaQuery;
            }else{
                return respuestaQuery;
            }
        }catch(err){
            console.error(err);
            throw new Error(err);
        }
    }




    async eliminarEvaluacionCriterio(id_evaluacion_criterios){
        try {
            const conexion = DataBase.getInstance();
            const query = `
            UPDATE evaluacion_criterio
            SET activo = 0 WHERE id_evaluacion_criterios = ?`;
            const params = [id_evaluacion_criterios]

            const resultadoConsulta = await conexion.ejecutarQuery(query,params);
            return resultadoConsulta;
        }catch(err){
            console.error(err);
            throw new Error(err);
        }
    }


    /*
    TABLA:
    evaluacion_criterio

    COLUMNAS:
    id_evaluacion_criterios,
    id_evaluacion_clinica,
    id_criterio,
    activo,
    fecha_creacion
    * */

    async obtener_criterios_evaluacion_especifica(id_evaluacion_criterios){
        try {
            const conexion = DataBase.getInstance();
            const query = `
SELECT * FROM evaluacion_criterio WHERE id_evaluacion_criterios = ? AND activo <> 0`;
            const params = [id_evaluacion_criterios]
            const resultadoConsulta = await conexion.ejecutarQuery(query,params);
            return resultadoConsulta;

        }catch(err){
            console.error(err);
            throw new Error(err);
        }
    }


}