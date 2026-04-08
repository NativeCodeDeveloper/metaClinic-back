import CriteriosClinicos from "../model/CriteriosClinicos.js";

export default class CriteriosClinicosController {
    constructor(){
    }

    static async crearCriterio(req, res){
        try{
            const {
                nombre,
                descripcion,
                valor_tipo,
                excluye_glp1,
            } = req.body;

            console.log(req.body);
            if(!nombre || !descripcion || !valor_tipo){
            return res.status(400).send({
                message: `sindata`})
            }

            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.crearCriterio(
                nombre,
                descripcion,
                valor_tipo,
                excluye_glp1,
                );

            if(resultadoModel.affectedRows > 0){
                return res.status(200).send({
                    message: true
                })
            }else{
                return res.status(200).send({message: false})
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }
    static async obtenerTodosActivos(req, res){
        try{

            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.obtenerTodosActivos();

            if(Array.isArray(resultadoModel) && resultadoModel.length > 0){
                return res.status(200).send(resultadoModel)
            }else{
                return res.status(200).send([])
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }
    static async obtenerPorId(req, res){
        try{
            const {
                id_criterio
            } = req.body;

            console.log(req.body);
            if(!id_criterio){
                return res.status(400).send({
                    message: `sindata`})
            }
            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.obtenerPorId(id_criterio);

            if(Array.isArray(resultadoModel) && resultadoModel.length > 0){
                return res.status(200).send(resultadoModel)
            }else{
                return res.status(200).send([])
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }
    static async actualizarCriterio(req, res){
        try{
            const {
                nombre,
                descripcion,
                valor_tipo,
                excluye_glp1,
                fecha_creacion,
                id_criterio
            } = req.body;

            console.log(req.body);
            if(!nombre || !descripcion || !valor_tipo || !fecha_creacion || !id_criterio){
                return res.status(400).send({
                    message: `sindata`})
            }

            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.actualizarCriterio(
                nombre,
                descripcion,
                valor_tipo,
                excluye_glp1,
                fecha_creacion,
                id_criterio
        );
            if(resultadoModel.affectedRows > 0){
                return res.status(200).send({
                    message: true
                })
            }else{
                return res.status(200).send({message: false})
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }
    static async eliminarCriterio(req, res){
        try{
            const {
                id_criterio
            } = req.body;

            console.log(req.body);
            if(!id_criterio){
                return res.status(400).send({
                    message: `sindata`})
            }

            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.eliminarCriterio(id_criterio);
            if(resultadoModel.affectedRows > 0){
                return res.status(200).send({
                    message: true
                })
            }else{
                return res.status(200).send({message: false})
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }
    static async obtenerExcluyentesGLP1(req, res){
        try{

            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.obtenerExcluyentesGLP1();

            if(Array.isArray(resultadoModel) && resultadoModel.length > 0){
                return res.status(200).send(resultadoModel)
            }else{
                return res.status(200).send([])
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }
    static async obtenercriterios_valor_tipo(req, res){
        try{
            const {valor_tipo} = req.body;
            console.log(req.body);

            if(!valor_tipo){
                return res.status(400).send({
                    message: `sindata`
                })
            }

            const CriteriosClinicosClass = new CriteriosClinicos();
            const resultadoModel = await CriteriosClinicosClass.obtenercriterios_valor_tipo(valor_tipo);

            if(Array.isArray(resultadoModel) && resultadoModel.length > 0){
                return res.status(200).send(resultadoModel)
            }else{
                return res.status(200).send([])
            }
        }catch(err){
            return res.status(500).send({
                message: `serverError: ${err}`
            })
        }
    }


}