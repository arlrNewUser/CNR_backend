import { Menu } from "../models/Menu.js";
import { Content } from "../models/Content.js";
import { Type } from "../models/Type.js";

// Add menu
const addMenu = async (req, res) => {
    const { date } = req.body;
    // Check if not null
    if (!date){
        const error = new Error("Debe ingresar los siguientes campos: date");
        return res.status(400).json({ msg: error.message });
    }

    // Check if menu exists
    const menuExists = await Menu.findOne({
        where: { date }
    });
    if (menuExists) {
        const error = new Error("Menú ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    let menuSaved;
    try {
        // Save new menu
        const menu = new Menu(req.body, {
            fields: ["date", "organizationId"]
        });
        menuSaved = await menu.save();

    } catch {
        const error = new Error("Error desconocido al registrar el menú");
        return res.status(400).json({ msg: error.message });
    }

    // Menu contents
    const { contents } = req.body;

    // Check if not null
    if (!contents){
        const error = new Error("Debe ingresar los siguientes campos: menuContents");
        return res.status(400).json({ msg: error.message });
    }
    if (!Array.isArray(contents)) {
        const error = new Error("Formato inválido en menuContents");
        return res.status(400).json({ msg: error.message});
    }

    await Promise.all(contents.map(async (id) => {

        try {
            // Find content
            const content = await Content.findByPk(id);

            // Asociate content
            await menuSaved.addContent(content);
        } catch {
            const error = new Error(`Error desconocido al asociar el contenido ${id}`);
            return error;
        }

    }));

    let newMenu;
    try{
        newMenu = await Menu.findByPk(menuSaved.id, {
            include: [
                {
                    model: Content,
                    include: {
                        model: Type,
                    }
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener el menú");
        return res.status(400).json({ msg: error.message });
    }
    
    return res.json(newMenu);
}


// Get menus
const getMenus = async (req, res) => {
    let menu;
    try{
        menu = await Menu.findAll({
            include: [
                {
                    model: Content,
                    include: {
                        model: Type,
                    }
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener los menús");
        return res.status(404).json({ msg: error.message });
    }
    res.json(menu);
};


// Get menu
const getMenu = async (req, res) => {
    const { date } = req.params;
    let menu;
    try{
        menu = await Menu.findOne({
            where: { date },
            include: [
                {
                    model: Content,
                    include: {
                        model: Type,
                    }
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener el menú");
        return res.status(400).json({ msg: error.message });
    }
    if(!menu){
        const error = new Error("Menú no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(menu);

};


// Update menu
const updateMenu = async(req, res) => {
    const { date } = req.params;

    // Check if menu exists
    const menu = await Menu.findOne({
        where: { date }
    });
    if (!menu) {
        const error = new Error("Menú no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    // Menu contents
    const { contents } = req.body;
    // Check if not null
    if (!contents){
        const error = new Error("Debe ingresar los siguientes campos: menuContents");
        return res.status(400).json({ msg: error.message });
    }
    if (!Array.isArray(contents)) {
        const error = new Error("Formato inválido en menuContents");
        return res.status(400).json({ msg: error.message });
    }

    await menu.setContents([])
    await Promise.all(contents.map(async (id) => {

        try {
            // Update menu
            const content = await Content.findByPk(id);

            // Asociate content
            await menu.addContent(content);
        } catch {
            const error = new Error(`Error desconocido al asociar el contenido ${id}`);
            return error;
        }

    }));

    let newMenu;

    try{
        newMenu = await Menu.findByPk(menu.id, {
            include: [
                {
                    model: Content,
                    include: {
                        model: Type,
                    }
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al actualizar el menú");
        return res.status(400).json({ msg: error.message });
    }
    
    return res.json(newMenu);
};


// Remove menu
const removeMenu = async (req, res) => {
    
    const { date } = req.params;

    // Check if menu exists
    const menu = await Menu.findOne({
        where: { date }
    });
    if (!menu) {
        const error = new Error("Menú no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await menu.destroy();
    } catch {
        const error = new Error("Error desconocido al eliminar el menú");
        return res.status(400).json({ msg: error.message });
    }
    res.json({ msg: "Menú eliminado" });
};


// Add content
const addContent = async (req, res) => {
    const { typeId, name } = req.body;
    // Check if not null
    if (!typeId || !name){
        const error = new Error("Debe ingresar los siguientes campos: typeId, name");
        return res.status(400).json({ msg: error.message });
    }

    // Check if content exists
    const contentExists = await Content.findOne({
        where: {
            typeId,
            name
        }
    });
    if (contentExists) {
        const error = new Error("Contenido ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    let contentSaved;
    try {
        // Save new content
        const content = new Content(req.body, {
            fields: ["typeId", "name"]
        });
        contentSaved = await content.save();

    } catch {
        const error = new Error("Error desconocido al registrar el contenido");
        return res.status(400).json({ msg: error.message });
    }

    let newContent;
    try{
        newContent = await Content.findByPk(contentSaved.id, {
            include: [
                {
                    model: Type,
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener el contenido");
        return res.status(400).json({ msg: error.message });
    }
    
    return res.json(newContent);
}

// Get contents
const getContents = async (req, res) => {
    let content;
    try{
        content = await Content.findAll({
            include: [
                {
                    model: Type,
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener los contenidos");
        return res.status(404).json({ msg: error.message });
    }
    res.json(content);
};

// Get content
const getContent = async (req, res) => {
    const { id } = req.params;
    let content;
    try{
        content = await Content.findByPk(id, {
            include: [
                {
                    model: Type,
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener el contenido");
        return res.status(400).json({ msg: error.message });
    }
    if(!content){
        const error = new Error("Contenido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(content);

};


// Update menu
const updateContent = async(req, res) => {
    const { id } = req.params;

    // Check if content exists
    const content = await Content.findByPk(id);
    if (!content) {
        const error = new Error("Contenido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    const { name } = req.body;
    content.name = name;
    
    await content.save();

    let newContent;
    try{
        newContent = await Content.findByPk(content.id, {
            include: [
                {
                    model: Type,
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al actualizar el contenido");
        return res.status(400).json({ msg: error.message });
    }
    
    return res.json(newContent);
};

// Remove content
const removeContent = async (req, res) => {
    
    const { id } = req.params;

    // Check if content exists
    const content = await Content.findByPk(id);
    if (!content) {
        const error = new Error("Contenido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await content.destroy();
    } catch {
        const error = new Error("Error desconocido al eliminar el contenido");
        return res.status(400).json({ msg: error.message });
    }
    res.json({ msg: "Contenido eliminado" });
};


export {
    addMenu,
    getMenus,
    getMenu,
    updateMenu,
    removeMenu,
    addContent,
    getContents,
    getContent,
    updateContent,
    removeContent,
}
