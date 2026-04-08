import EvaluacionCriterio from '../model/EvaluacionCriterios.js';


export default class EvolucionCriterioController {
    constructor(){
    }

    static async guardarCriteriosEvaluacion(req, res){
        try{
            const {
                id_evaluacion_clinica, arrayCriterios
            } = req.body;

            if(!id_evaluacion_clinica || !Array.isArray(arrayCriterios) || arrayCriterios.length === 0){
                return res.status(400).send({
                    message: `sindata`
                })
            }

            const EvaluacionCriterioClass = new EvaluacionCriterio();
            const respuestaModel = await EvaluacionCriterioClass.guardarCriteriosEvaluacion(id_evaluacion_clinica, arrayCriterios);

            if(respuestaModel.affectedRows > 0){
                return res.status(400).send({
                    message: true
                })
            }else{
                return res.status(200).send({
                    message: false
                })
            }

        }catch(err){
           return  res.status(500).send({
                message: `errorServer :  ${err}`,
            })
        }

    }

    static async obtenerCriteriosPorEvaluacion(req, res){
        try{
            const {
                id_evaluacion_clinica
            } = req.body;
            if(!id_evaluacion_clinica){
                return res.status(400).send({
                    message: `sindata`
                })
            }
            const EvaluacionCriterioClass = new EvaluacionCriterio();
            const respuestaModel = await EvaluacionCriterioClass.obtenerCriteriosPorEvaluacion(id_evaluacion_clinica);

            if(Array.isArray(respuestaModel) && respuestaModel.length > 0){
                return res.status(200).send(respuestaModel);
            }else{
                return res.status(200).send([])
            }
        }catch(err){
            return  res.status(500).send({
                message: `errorServer :  ${err}`,
            })
        }

    }

    static async actualizarSwitchEspecifico(req, res){
        try{
            const {
                activo,
                id_evaluacion_criterios
            } = req.body;
            if(!activo || !id_evaluacion_criterios){
                return res.status(400).send({
                    message: `sindata`
                })
            }
            const EvaluacionCriterioClass = new EvaluacionCriterio();
            const respuestaModel = await EvaluacionCriterioClass.actualizarSwitchEspecifico(
                activo,
                id_evaluacion_criterios
            );

            if(respuestaModel.affectedRows > 0){
                return res.status(400).send({
                    message: true
                });
            }else{
                return res.status(200).send({
                    message: false
                })
            }
        }catch(err){
            return  res.status(500).send({
                message: `errorServer :  ${err}`,
            })
        }

    }

    static async eliminarEvaluacionCriterio(req, res){
        try{
            const {
                id_evaluacion_criterios
            } = req.body;
            if(!id_evaluacion_criterios){
                return res.status(400).send({
                    message: `sindata`
                })
            }
            const EvaluacionCriterioClass = new EvaluacionCriterio();
            const respuestaModel = await EvaluacionCriterioClass.eliminarEvaluacionCriterio(
                id_evaluacion_criterios
            );

            if(respuestaModel.affectedRows > 0){
                return res.status(400).send({
                    message: true
                });
            }else{
                return res.status(200).send({
                    message: false
                })
            }
        }catch(err){
            return  res.status(500).send({
                message: `errorServer :  ${err}`,
            })
        }
    }

    static async obtener_criterios_evaluacion_especifica(req, res){
        try{
            const {
                id_evaluacion_criterios
            } = req.body;
            if(!id_evaluacion_criterios){
                return res.status(400).send({
                    message: `sindata`
                })
            }
            const EvaluacionCriterioClass = new EvaluacionCriterio();
            const respuestaModel = await EvaluacionCriterioClass.obtener_criterios_evaluacion_especifica(
                id_evaluacion_criterios
            );

            if(respuestaModel.affectedRows > 0){
                return res.status(400).send(respuestaModel);
            }else{
                return res.status(200).send([])
            }
        }catch(err){
            return  res.status(500).send({
                message: `errorServer :  ${err}`,
            })
        }
    }





}
