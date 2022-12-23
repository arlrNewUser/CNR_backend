import { Testimonial } from "../models/Testimonial.js";
import { User } from "../models/User.js";
import Sequelize from "sequelize";

const addTestimonial = async (req, res) => {
    const { rating } = req.body;

    // Check not null
    if (!rating){
        const error = new Error("Debe ingresar los siguientes campos: rating");
        return res.status(400).json({ msg: error.message });
    }

    
    try{
        // Save new testimonial
        const testimonial = new Testimonial(req.body, {
            fields: ["message", "rating"]
        });
        await testimonial.save();
    } catch {
        const error = new Error("Error desconocido al guardar el testimonial");
        return res.status(400).json({ msg: error.message });
    }
    
    res.json({
        msg: "Testimonial enviado exitosamente"
    });
};

const getTestimonials = async (req, res) => {
    let testimonial;
    try{
        testimonial = await Testimonial.findAll({
            attributes: { exclude: ["id", "createdAt", "updatedAt", "userId"] }
        });
    } catch {
        const error = new Error("Error desconocido al obtener los testimoniales");
        return res.status(404).json({ msg: error.message });
    }
    res.json(testimonial);
};

const getTestimonial = async (req, res) => {
    const { date } = req.params;
    let testimonial;
    try{
        testimonial = await Testimonial.findAll({
            where: Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '=', date),
            attributes: { exclude: ["id", "createdAt", "updatedAt", "userId"] }
        });
    } catch(e) {
        const error = new Error("Error desconocido al obtener el testimonial");
        console.log(e)
        return res.status(400).json({ msg: error.message });
    }
    if(!testimonial || testimonial.length === 0){
        const error = new Error("Testimonial no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(testimonial);
};

export {
    addTestimonial,
    getTestimonials,
    getTestimonial
}